import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './modules/auth/authRoutes.js';
import { priceRoutes } from './modules/prices/priceRoutes.js';
import { categoryRoutes } from './modules/categories/categoryRoutes.js';
import { uploadRoutes } from './modules/upload/uploadRoutes.js';

export const app = new Hono();

// Global Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: (origin) => origin || '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  })
);

// Health Check
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    app: 'Koto Nilo API (কত নিলো?)',
    timestamp: new Date().toISOString(),
  });
});

// Register Module Routes
app.route('/api/auth', authRoutes);
app.route('/api/prices', priceRoutes);
app.route('/api/categories', categoryRoutes);
app.route('/api/upload', uploadRoutes);

// Error and Not Found Handlers
app.onError(errorHandler);
app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: 'API রুটটি পাওয়া যায়নি',
    },
    404
  );
});
