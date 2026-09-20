import { Hono } from 'hono';
import {
  register,
  login,
  createAnonymous,
  googleLogin,
  sendOtp,
  verifyOtp,
  refresh,
  logout,
  logoutAllDevices,
  getSessions,
  revokeSession,
  getMe,
} from './authController.js';
import { authRequired } from '../../middleware/auth.js';

export const authRoutes = new Hono();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/anonymous', createAnonymous);
authRoutes.post('/google', googleLogin);
authRoutes.post('/otp/send', sendOtp);
authRoutes.post('/otp/verify', verifyOtp);
authRoutes.post('/refresh', refresh);
authRoutes.post('/logout', logout);

// Protected routes
authRoutes.post('/logout-all', authRequired, logoutAllDevices);
authRoutes.get('/sessions', authRequired, getSessions);
authRoutes.delete('/sessions/:id', authRequired, revokeSession);
authRoutes.get('/me', authRequired, getMe);
