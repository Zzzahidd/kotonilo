import axios from 'axios';
import {
  User,
  PriceReport,
  Category,
  PriceSummary,
  CheckPriceResult,
  SessionInfo,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('kotonilo_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Refresh Token rotation on 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('kotonilo_refresh_token');
      if (!refreshToken || originalRequest.url?.includes('/auth/refresh')) {
        localStorage.removeItem('kotonilo_access_token');
        localStorage.removeItem('kotonilo_refresh_token');
        localStorage.removeItem('kotonilo_user');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        localStorage.setItem('kotonilo_access_token', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('kotonilo_refresh_token', newRefreshToken);
        }

        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('kotonilo_access_token');
        localStorage.removeItem('kotonilo_refresh_token');
        localStorage.removeItem('kotonilo_user');
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  async register(data: { username: string; displayName: string; email?: string; password: string }) {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  async login(data: { usernameOrEmail: string; password: string }) {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },

  async createAnonymous() {
    const res = await apiClient.post('/auth/anonymous');
    return res.data;
  },

  async googleLogin(credential: string) {
    const res = await apiClient.post('/auth/google', { credential });
    return res.data;
  },

  async sendOtp(email: string, purpose: 'login' | 'verify_email' | 'password_reset' = 'login') {
    const res = await apiClient.post('/auth/otp/send', { email, purpose });
    return res.data;
  },

  async verifyOtp(email: string, otp: string, purpose: 'login' | 'verify_email' | 'password_reset' = 'login') {
    const res = await apiClient.post('/auth/otp/verify', { email, otp, purpose });
    return res.data;
  },

  async logout(refreshToken?: string) {
    const res = await apiClient.post('/auth/logout', { refreshToken });
    return res.data;
  },

  async logoutAll() {
    const res = await apiClient.post('/auth/logout-all');
    return res.data;
  },

  async getSessions(): Promise<{ success: boolean; data: SessionInfo[] }> {
    const res = await apiClient.get('/auth/sessions');
    return res.data;
  },

  async revokeSession(id: string) {
    const res = await apiClient.delete(`/auth/sessions/${id}`);
    return res.data;
  },

  async getMe(): Promise<{ success: boolean; data: { user: User } }> {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
};

// Prices API
export const pricesApi = {
  async getPrices(params?: {
    category?: string;
    location?: string;
    search?: string;
    timeframe?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data: {
      reports: PriceReport[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  }> {
    const res = await apiClient.get('/prices', { params });
    return res.data;
  },

  async getPriceById(id: string): Promise<{ success: boolean; data: { report: PriceReport } }> {
    const res = await apiClient.get(`/prices/${id}`);
    return res.data;
  },

  async getSummary(params?: {
    q?: string;
    search?: string;
    category?: string;
    location?: string;
  }): Promise<{ success: boolean; data: PriceSummary }> {
    const res = await apiClient.get('/prices/summary', { params });
    return res.data;
  },

  async checkPrice(data: {
    quotedPrice: number;
    itemTitle?: string;
    categorySlug?: string;
  }): Promise<{ success: boolean; data: CheckPriceResult }> {
    const res = await apiClient.post('/prices/check', data);
    return res.data;
  },

  async createReport(data: any): Promise<{ success: boolean; data: { report: PriceReport } }> {
    const res = await apiClient.post('/prices', data);
    return res.data;
  },

  async voteReport(id: string, voteType: 'positive' | 'negative') {
    const res = await apiClient.post(`/prices/${id}/vote`, { voteType });
    return res.data;
  },

  async reportProblem(id: string, reason: string, details?: string) {
    const res = await apiClient.post(`/prices/${id}/report`, { reason, details });
    return res.data;
  },

  async getMyReports(): Promise<{ success: boolean; data: { reports: PriceReport[] } }> {
    const res = await apiClient.get('/prices/user/my-reports');
    return res.data;
  },

  async updateReport(id: string, data: any) {
    const res = await apiClient.patch(`/prices/${id}`, data);
    return res.data;
  },

  async deleteReport(id: string) {
    const res = await apiClient.delete(`/prices/${id}`);
    return res.data;
  },
};

// Categories API
export const categoriesApi = {
  async getCategories(): Promise<{ success: boolean; data: Category[] }> {
    const res = await apiClient.get('/categories');
    return res.data;
  },

  async getCategoryBySlug(slug: string): Promise<{ success: boolean; data: Category }> {
    const res = await apiClient.get(`/categories/${slug}`);
    return res.data;
  },
};

// Upload API
export const uploadApi = {
  async uploadFile(file: File): Promise<{
    success: boolean;
    data: { url: string; fileId: string; thumbnailUrl: string };
  }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
