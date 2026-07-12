import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No Gexcite authentication token provided' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'gexcite-secret-key-change-in-production'
    ) as DecodedToken;
    
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired Gexcite token' });
  }
};

export default auth;