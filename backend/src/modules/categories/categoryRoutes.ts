import { Hono } from 'hono';
import { getAllCategories, getCategoryBySlug } from './categoryController.js';

export const categoryRoutes = new Hono();

categoryRoutes.get('/', getAllCategories);
categoryRoutes.get('/:slug', getCategoryBySlug);
