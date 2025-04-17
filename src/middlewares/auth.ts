import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { errorResponse } from '../utils/responseHandler';

interface DecodedToken {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      errorResponse(res, 'Access denied. No token provided.', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.JWT_SECRET) as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      errorResponse(res, 'Token expired.', 401);
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorResponse(res, 'Invalid token.', 401);
    } else {
      errorResponse(res, 'Authentication failed.', 401);
    }
  }
};


// Middleware for role-based access control
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, 'Access denied. Not authenticated.', 401);
    }
    
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'Access denied. Not authorized.', 403);
    }
    
    next();
  };
};
