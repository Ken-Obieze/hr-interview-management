import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { errorResponse } from '../utils/responseFormatter';

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

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Access denied. No token provided.', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET) as DecodedToken;
    
    // Add user info to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return errorResponse(res, 'Invalid token.', 401);
    }
    if (error instanceof jwt.TokenExpiredError) {
      return errorResponse(res, 'Token expired.', 401);
    }
    return errorResponse(res, 'Authentication failed.', 401);
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
