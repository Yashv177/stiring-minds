import mongoose, { Schema, Document } from 'mongoose';

export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'redeemed';

export interface IClaim extends Document {
  user: mongoose.Types.ObjectId;
  deal: mongoose.Types.ObjectId;
  status: ClaimStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ClaimSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deal: { type: Schema.Types.ObjectId, ref: 'Deal', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'redeemed'], default: 'pending' },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

// Prevent duplicate claims from same user for same deal
ClaimSchema.index({ user: 1, deal: 1 }, { unique: true });

export default mongoose.model<IClaim>('Claim', ClaimSchema);
