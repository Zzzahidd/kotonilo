import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { toBanglaNumber } from '../utils/bangla.js';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    if (env.GOOGLE_USER && env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_REFRESH_TOKEN) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: env.GOOGLE_USER,
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          refreshToken: env.GOOGLE_REFRESH_TOKEN,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'mock_user',
          pass: 'mock_pass',
        },
      });
    }
  }
  return transporter;
}

export async function sendOtpEmail(to: string, otp: string, purpose: string = 'লগইন'): Promise<boolean> {
  const banglaOtp = toBanglaNumber(otp);
  const html = `
    <div style="font-family: 'Noto Sans Bengali', sans-serif, Arial; max-width: 500px; margin: 0 auto; padding: 24px; background-color: #F5F3F5; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #191923; margin: 0;">কত নিলো? (Koto Nilo)</h2>
        <p style="color: #55555C; font-size: 14px; margin-top: 4px;">সঠিক দাম জানুন, স্মার্ট সিদ্ধান্ত নিন</p>
      </div>
      <div style="background: #FFFFFF; padding: 24px; border-radius: 12px; border: 1px solid #E3E2E3; text-align: center;">
        <p style="color: #191923; font-size: 16px; margin-bottom: 16px;">আপনার <strong>${purpose}</strong> এর জন্য এককালীন ওটিপি (OTP) কোড:</p>
        <div style="background: #F0EFF0; padding: 16px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #191923; margin: 16px 0;">
          ${banglaOtp} <span style="font-size: 16px; color: #848389; font-weight: normal;">(${otp})</span>
        </div>
        <p style="color: #848389; font-size: 13px; margin: 0;">এই কোডটি পরবর্তী ১০ মিনিট কার্যকর থাকবে। কাউকে এই কোড দেবেন না।</p>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #848389;">
        © ${new Date().getFullYear()} কত নিলো? All rights reserved.
      </div>
    </div>
  `;

  try {
    const mailer = getTransporter();
    await mailer.sendMail({
      from: `"কত নিলো?" <${env.GOOGLE_USER || 'no-reply@kotonilo.com'}>`,
      to,
      subject: `আপনার কত নিলো? ওটিপি কোড: ${otp}`,
      html,
    });
    console.log(`[Email] OTP sent to ${to}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send email:', error);
    if (env.NODE_ENV === 'development') {
      console.log(`[Email DEV Fallback] OTP for ${to} is: ${otp}`);
      return true;
    }
    return false;
  }
}
