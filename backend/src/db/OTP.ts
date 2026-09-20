import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otpHash: string;
  purpose: 'login' | 'verify_email' | 'password_reset';
  attempts: number;
  maxAttempts: number;
  isUsed: boolean;
  ipAddress: string;
  expiresAt: Date;
  createdAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    otpHash: { type: String, required: true },
    purpose: {
      type: String,
      enum: ['login', 'verify_email', 'password_reset'],
      default: 'login',
    },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    isUsed: { type: Boolean, default: false },
    ipAddress: { type: String, default: 'unknown' },
    expiresAt: { type: Date, required: true, index: { expires: '10m' } },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

otpSchema.index({ email: 1, purpose: 1, isUsed: 1 });

export const OTP = mongoose.model<IOTP>('OTP', otpSchema);
