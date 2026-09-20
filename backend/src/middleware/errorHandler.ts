import { Context } from 'hono';
import { ZodError } from 'zod';

export function errorHandler(err: Error, c: Context) {
  console.error('[API Error]:', err.message);

  if (err instanceof ZodError) {
    return c.json(
      {
        success: false,
        message: 'তথ্য যাচাইকরণে সমস্যা হয়েছে',
        errors: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
      400
    );
  }

  return c.json(
    {
      success: false,
      message: err.message || 'সার্ভারে সাময়িক সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।',
    },
    500
  );
}
