import mongoose, { Schema, Document } from 'mongoose';

export interface IFieldTemplate {
  key: string;
  labelBn: string;
  labelEn: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'date';
  required: boolean;
  options?: string[];
  placeholderBn?: string;
  unit?: string;
}

export interface ICategory extends Document {
  nameBn: string;
  nameEn: string;
  slug: string;
  icon: string;
  descriptionBn?: string;
  requiredFields: IFieldTemplate[];
  optionalFields: IFieldTemplate[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const fieldTemplateSchema = new Schema<IFieldTemplate>(
  {
    key: { type: String, required: true },
    labelBn: { type: String, required: true },
    labelEn: { type: String, required: true },
    type: { type: String, enum: ['text', 'number', 'select', 'boolean', 'date'], required: true },
    required: { type: Boolean, default: false },
    options: [{ type: String }],
    placeholderBn: { type: String },
    unit: { type: String },
  },
  { _id: false }
);

const categorySchema = new Schema<ICategory>(
  {
    nameBn: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    icon: { type: String, required: true, default: 'package' },
    descriptionBn: { type: String },
    requiredFields: [fieldTemplateSchema],
    optionalFields: [fieldTemplateSchema],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model<ICategory>('Category', categorySchema);
