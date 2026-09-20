import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISession extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  ipAddress: string;
  userAgent: string;
  deviceType: string; // 'mobile' | 'desktop' | 'tablet' | 'unknown'
  browser: string;
  os: string;
  isRevoked: boolean;
  lastActiveAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, index: true },
    ipAddress: { type: String, default: 'unknown' },
    userAgent: { type: String, default: 'unknown' },
    deviceType: { type: String, default: 'unknown' },
    browser: { type: String, default: 'unknown' },
    os: { type: String, default: 'unknown' },
    isRevoked: { type: Boolean, default: false, index: true },
    lastActiveAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, index: { expires: '30d' } },
  },
  {
    timestamps: true,
  }
);

sessionSchema.index({ userId: 1, isRevoked: 1 });

export const Session = mongoose.model<ISession>('Session', sessionSchema);
