import { Hono } from 'hono';
import {
  createPriceReport,
  getPrices,
  getPriceReportById,
  getPriceSummary,
  checkMyPrice,
  votePriceReport,
  reportProblem,
  getMyReports,
  updatePriceReport,
  deletePriceReport,
} from './priceController.js';
import { authRequired, optionalAuth } from '../../middleware/auth.js';

export const priceRoutes = new Hono();

// Public / optional auth routes
priceRoutes.get('/', optionalAuth, getPrices);
priceRoutes.get('/summary', getPriceSummary);
priceRoutes.post('/check', checkMyPrice);
priceRoutes.get('/:id', optionalAuth, getPriceReportById);

// Protected routes
priceRoutes.post('/', authRequired, createPriceReport);
priceRoutes.post('/:id/vote', authRequired, votePriceReport);
priceRoutes.post('/:id/report', authRequired, reportProblem);
priceRoutes.get('/user/my-reports', authRequired, getMyReports);
priceRoutes.patch('/:id', authRequired, updatePriceReport);
priceRoutes.delete('/:id', authRequired, deletePriceReport);
