import { Request, Response, NextFunction } from 'express';
import Claim from '../models/claim.model';
import Deal from '../models/deal.model';

export async function createClaim(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const { dealId } = req.body;

    const deal = await Deal.findById(dealId);
    if (!deal) return res.status(404).json({ error: 'Deal not found' });

    // Authorization: locked deals require verified users
    if (deal.isLocked && !user.isVerified) {
      return res.status(403).json({ error: 'Deal locked: verification required' });
    }

    // Check for existing claim
    const existing = await Claim.findOne({ user: user._id, deal: deal._id });
    if (existing) return res.status(409).json({ error: 'You have already claimed this deal' });

    const claim = await Claim.create({
      user: user._id,
      deal: deal._id,
      status: 'pending',
    });

    res.status(201).json({ claim });
  } catch (err: any) {
    // Handle duplicate key error (race condition)
    if (err.code === 11000) {
      return res.status(409).json({ error: 'You have already claimed this deal' });
    }
    next(err);
  }
}

export async function listUserClaims(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const { page = 1, limit = 10, status } = req.query;

    const filter: any = { user: user._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [claims, total] = await Promise.all([
      Claim.find(filter).populate('deal').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Claim.countDocuments(filter),
    ]);

    res.json({
      claims,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}
