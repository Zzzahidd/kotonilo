import { create } from 'zustand';
import { User } from '../types';
import { authApi } from '../api/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  generatedCredentials: { username: string; password: string } | null;
  showAuthModal: boolean;
  authModalView: 'login' | 'register' | 'anonymous' | 'anonymousSuccess';

  // Actions
  setUser: (user: User | null) => void;
  openAuthModal: (view?: 'login' | 'register' | 'anonymous' | 'anonymousSuccess') => void;
  closeAuthModal: () => void;
  initAuth: () => Promise<void>;
  login: (data: { usernameOrEmail: string; password: string }) => Promise<boolean>;
  register: (data: { username: string; displayName: string; email?: string; password: string }) => Promise<boolean>;
  createAnonymous: () => Promise<boolean>;
  googleLogin: (credential: string) => Promise<boolean>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  generatedCredentials: null,
  showAuthModal: false,
  authModalView: 'login',

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  openAuthModal: (view = 'login') => set({ showAuthModal: true, authModalView: view }),
  closeAuthModal: () => set({ showAuthModal: false }),

  initAuth: async () => {
    const token = localStorage.getItem('kotonilo_access_token');
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res.success && res.data?.user) {
        set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    try {
      const res = await authApi.login(credentials);
      if (res.success && res.data) {
        localStorage.setItem('kotonilo_access_token', res.data.accessToken);
        localStorage.setItem('kotonilo_refresh_token', res.data.refreshToken);
        set({ user: res.data.user, isAuthenticated: true, showAuthModal: false });
        return true;
      }
      return false;
    } catch (err: any) {
      throw err;
    }
  },

  register: async (data) => {
    try {
      const res = await authApi.register(data);
      if (res.success && res.data) {
        localStorage.setItem('kotonilo_access_token', res.data.accessToken);
        localStorage.setItem('kotonilo_refresh_token', res.data.refreshToken);
        set({ user: res.data.user, isAuthenticated: true, showAuthModal: false });
        return true;
      }
      return false;
    } catch (err: any) {
      throw err;
    }
  },

  createAnonymous: async () => {
    try {
      const res = await authApi.createAnonymous();
      if (res.success && res.data) {
        localStorage.setItem('kotonilo_access_token', res.data.accessToken);
        localStorage.setItem('kotonilo_refresh_token', res.data.refreshToken);
        if (res.data.credentials) {
          set({
            user: res.data.user,
            isAuthenticated: true,
            generatedCredentials: res.data.credentials,
            authModalView: 'anonymousSuccess',
          });
        } else {
          set({
            user: res.data.user,
            isAuthenticated: true,
            generatedCredentials: null,
            showAuthModal: false,
          });
        }
        return true;
      }
      return false;
    } catch (err: any) {
      throw err;
    }
  },

  googleLogin: async (credential) => {
    try {
      const res = await authApi.googleLogin(credential);
      if (res.success && res.data) {
        localStorage.setItem('kotonilo_access_token', res.data.accessToken);
        localStorage.setItem('kotonilo_refresh_token', res.data.refreshToken);
        set({ user: res.data.user, isAuthenticated: true, showAuthModal: false });
        return true;
      }
      return false;
    } catch (err: any) {
      throw err;
    }
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('kotonilo_refresh_token') || undefined;
    try {
      await authApi.logout(refreshToken);
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('kotonilo_access_token');
      localStorage.removeItem('kotonilo_refresh_token');
      set({ user: null, isAuthenticated: false, generatedCredentials: null });
    }
  },

  logoutAll: async () => {
    try {
      await authApi.logoutAll();
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('kotonilo_access_token');
      localStorage.removeItem('kotonilo_refresh_token');
      set({ user: null, isAuthenticated: false, generatedCredentials: null });
    }
  },
}));
