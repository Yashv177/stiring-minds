import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
import User from '../models/user.model';

export interface AuthRequest extends Request {
  user?: any;
}

export async function jwtAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });

    const token = auth.split(' ')[1];
    const payload = verifyJwt<{ sub: string }>(token);
    if (!payload || !payload.sub) return res.status(401).json({ error: 'Invalid token' });

    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Invalid token', detail: err.message });
  }
}
