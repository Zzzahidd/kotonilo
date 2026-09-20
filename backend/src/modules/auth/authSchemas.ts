import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3, 'ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে').max(50),
  displayName: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে').max(100),
  email: z.string().email('সঠিক ইমেইল ঠিকানা দিন').optional(),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'),
});

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'ইউজারনেম বা ইমেইল লিখুন'),
  password: z.string().min(1, 'পাসওয়ার্ড লিখুন'),
});

export const googleAuthSchema = z.object({
  credential: z.string().min(1, 'Google Credential token প্রয়োজন'),
});

export const sendOtpSchema = z.object({
  email: z.string().email('সঠিক ইমেইল ঠিকানা দিন'),
  purpose: z.enum(['login', 'verify_email', 'password_reset']).default('login'),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('সঠিক ইমেইল ঠিকানা দিন'),
  otp: z.string().length(6, '৬ সংখ্যার ওটিপি কোড দিন'),
  purpose: z.enum(['login', 'verify_email', 'password_reset']).default('login'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'রিফ্রেশ টোকেন প্রয়োজন'),
});
