import { Hono } from 'hono';
import { getImageKitAuth, uploadFile } from './uploadController.js';
import { optionalAuth } from '../../middleware/auth.js';

export const uploadRoutes = new Hono();

uploadRoutes.get('/auth', getImageKitAuth);
uploadRoutes.post('/', optionalAuth, uploadFile);
