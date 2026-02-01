import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';

/**
 * Request verification - for demo purposes, this auto-approves
 * In production, this would send an email, require document upload, etc.
 */
export async function requestVerification(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ error: 'User is already verified' });
    }

    // In a real application, this would:
    // 1. Send a verification email
    // 2. Require document submission
    // 3. Wait for admin approval
    // For demo purposes, we auto-approve after a short delay
    
    // Update user to verified
    await User.findByIdAndUpdate(user._id, { isVerified: true });

    return res.json({
      message: 'Verification approved successfully',
      isVerified: true
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get current verification status
 */
export async function getVerificationStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const userRecord = await User.findById(user._id).select('isVerified createdAt');
    
    return res.json({
      isVerified: userRecord?.isVerified || false,
      verifiedAt: userRecord?.updatedAt
    });
  } catch (err) {
    next(err);
  }
}

