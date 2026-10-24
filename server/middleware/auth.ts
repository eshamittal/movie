import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbStore } from '../data/store.ts';

export const JWT_SECRET = process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_2025';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export function generateToken(payload: { _id: string; email: string; role: 'user' | 'admin' }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      _id: string;
      email: string;
      role: 'user' | 'admin';
    };

    const user = dbStore.findUserById(decoded._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session or user not found. Please log in again.',
      });
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.',
    });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges required.',
      });
    }
    next();
  });
}
