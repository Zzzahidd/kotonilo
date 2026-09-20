import { Context } from 'hono';
import { Category } from '../../db/Category.js';

export async function getAllCategories(c: Context) {
  const categories = await Category.find({ isActive: true }).sort({ order: 1 });
  return c.json({
    success: true,
    data: categories,
  });
}

export async function getCategoryBySlug(c: Context) {
  const slug = c.req.param('slug');
  const category = await Category.findOne({ slug, isActive: true });

  if (!category) {
    return c.json({ success: false, message: 'ক্যাটাগরি পাওয়া যায়নি' }, 404);
  }

  return c.json({
    success: true,
    data: category,
  });
}
