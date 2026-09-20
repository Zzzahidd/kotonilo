import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILocation {
  division: string;
  district: string;
  area: string;
  fullAddress: string;
}

export interface IPriceReport extends Document {
  userId: Types.ObjectId;
  authorName: string;
  isAnonymous: boolean;
  categoryId: Types.ObjectId;
  categorySlug: string;
  itemTitle: string;
  price: number;
  currency: string;
  location: ILocation;
  condition: string;
  tags: string[];
  attributes: Record<string, any>;
  extraDetails: {
    batteryHealth?: string;
    warranty?: string;
    box?: boolean;
    charger?: boolean;
    repairHistory?: string;
    notes?: string;
    market?: string;
    freshness?: string;
    bookingSource?: string;
    vehicleType?: string;
    serviceType?: string;
  };
  imageUrl?: string;
  imageFileId?: string;
  status: 'published' | 'under_review' | 'flagged' | 'hidden';
  positiveVotesCount: number;
  negativeVotesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<ILocation>(
  {
    division: { type: String, default: 'ঢাকা' },
    district: { type: String, default: 'ঢাকা' },
    area: { type: String, default: 'মিরপুর' },
    fullAddress: { type: String, required: true, default: 'মিরপুর, ঢাকা' },
  },
  { _id: false }
);

const priceReportSchema = new Schema<IPriceReport>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    authorName: { type: String, required: true, default: 'বেনামি ব্যবহারকারী' },
    isAnonymous: { type: Boolean, default: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    categorySlug: { type: String, required: true, index: true },
    itemTitle: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0, index: true },
    currency: { type: String, default: 'BDT' },
    location: { type: locationSchema, required: true },
    condition: { type: String, default: 'ব্যবহৃত' },
    tags: [{ type: String }],
    attributes: { type: Schema.Types.Mixed, default: {} },
    extraDetails: {
      batteryHealth: { type: String },
      warranty: { type: String },
      box: { type: Boolean },
      charger: { type: Boolean },
      repairHistory: { type: String },
      notes: { type: String },
      market: { type: String },
      freshness: { type: String },
      bookingSource: { type: String },
      vehicleType: { type: String },
      serviceType: { type: String },
    },
    imageUrl: { type: String, default: '' },
    imageFileId: { type: String, default: '' },
    status: {
      type: String,
      enum: ['published', 'under_review', 'flagged', 'hidden'],
      default: 'published',
      index: true,
    },
    positiveVotesCount: { type: Number, default: 0 },
    negativeVotesCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Search indexes
priceReportSchema.index({ itemTitle: 'text', 'location.fullAddress': 'text', categorySlug: 1 });
priceReportSchema.index({ categorySlug: 1, createdAt: -1 });
priceReportSchema.index({ price: 1, categorySlug: 1 });

export const PriceReport = mongoose.model<IPriceReport>('PriceReport', priceReportSchema);
