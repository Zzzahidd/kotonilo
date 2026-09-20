import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVote extends Document {
  reportId: Types.ObjectId;
  userId: Types.ObjectId;
  voteType: 'positive' | 'negative';
  createdAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    reportId: { type: Schema.Types.ObjectId, ref: 'PriceReport', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    voteType: { type: String, enum: ['positive', 'negative'], required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

voteSchema.index({ reportId: 1, userId: 1 }, { unique: true });

export const Vote = mongoose.model<IVote>('Vote', voteSchema);
