import { Request, Response, NextFunction } from 'express';
import Deal from '../models/deal.model';

interface ListDealsQuery {
  q?: string;
  tags?: string;
  page?: number;
  limit?: number;
}

export async function listDeals(req: Request, res: Response, next: NextFunction) {
  try {
    const { q, tags, page = 1, limit = 10 } = req.query as ListDealsQuery;

    const filter: any = {};
    if (q) filter.$text = { $search: String(q) };
    if (tags) filter.tags = { $in: String(tags).split(',') };

    const skip = (Number(page) - 1) * Number(limit);

    const [deals, total] = await Promise.all([
      Deal.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Deal.countDocuments(filter),
    ]);

    res.json({
      deals,
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

export async function getDeal(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const deal = await Deal.findById(id);
    if (!deal) return res.status(404).json({ error: 'Deal not found' });
    res.json({ deal });
  } catch (err) {
    next(err);
  }
}
