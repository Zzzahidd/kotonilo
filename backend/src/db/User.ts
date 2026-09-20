import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  displayName: string;
  email?: string;
  passwordHash?: string;
  isAnonymous: boolean;
  googleId?: string;
  avatar?: string;
  createdIp?: string;
  deviceFingerprint?: string;
  lastIp?: string;
  role: 'user' | 'moderator' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      index: true,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdIp: {
      type: String,
      sparse: true,
      index: true,
    },
    deviceFingerprint: {
      type: String,
      sparse: true,
      index: true,
    },
    lastIp: {
      type: String,
    },
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', userSchema);
