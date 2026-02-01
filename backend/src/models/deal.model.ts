import mongoose, { Schema, Document } from 'mongoose';

export interface IDeal extends Document {
  title: string;
  description: string;
  provider: string;
  isLocked: boolean;
  isHumanity: boolean;
  termsUrl?: string;
  tags: string[];
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    provider: { type: String, required: true },
    isLocked: { type: Boolean, default: false },
    isHumanity: { type: Boolean, default: false },
    termsUrl: { type: String },
    tags: [{ type: String, index: true }],
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

// Text index for search functionality
DealSchema.index({ title: 'text', description: 'text', provider: 'text' });

export default mongoose.model<IDeal>('Deal', DealSchema);
