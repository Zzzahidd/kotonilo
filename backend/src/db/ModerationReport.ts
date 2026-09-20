import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IModerationReport extends Document {
  reportId: Types.ObjectId;
  userId: Types.ObjectId;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: Date;
}

const moderationReportSchema = new Schema<IModerationReport>(
  {
    reportId: { type: Schema.Types.ObjectId, ref: 'PriceReport', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: {
      type: String,
      required: true,
      enum: ['ভুল দাম', 'ভুল তথ্য', 'ডুপ্লিকেট রিপোর্ট', 'অপ্রাসঙ্গিক', 'অন্য কিছু'],
    },
    details: { type: String, maxlength: 500 },
    status: { type: String, enum: ['pending', 'reviewed', 'dismissed'], default: 'pending' },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ModerationReport = mongoose.model<IModerationReport>('ModerationReport', moderationReportSchema);
