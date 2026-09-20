import { Context, Next } from 'hono';
import { verifyAccessToken, TokenPayload } from '../utils/auth.js';

export interface AuthContextVariables {
  user?: TokenPayload;
}

export async function authRequired(c: Context<{ Variables: AuthContextVariables }>, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, message: 'অনুমতি নেই। অনুগ্রহ করে লগইন করুন।' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ success: false, message: 'টোকেন মেয়াদোত্তীর্ণ বা অবৈধ। আবার লগইন করুন।' }, 401);
  }

  c.set('user', payload);
  await next();
}

export async function optionalAuth(c: Context<{ Variables: AuthContextVariables }>, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    if (payload) {
      c.set('user', payload);
    }
  }
  await next();
}
