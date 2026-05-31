import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, hasRequiredRole, JWTPayload } from '@leaklens/auth';
import { UnauthorizedError, ForbiddenError } from '@leaklens/shared';
import { UserRole } from '@leaklens/types';

// Extend Express Request type to include our parsed JWT payload
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Authentication Middleware
 * Validates JWT access token from standard Authorization header or cookies
 */
export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // 1. Check Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } 
    // 2. Fallback to cookies
    else if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      return next(new UnauthorizedError('Authentication token is missing. Please log in.'));
    }

    // Verify token and attach user payload to the request
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    
    return next();
  } catch (error: any) {
    return next(new UnauthorizedError('Invalid or expired authentication token. Please log in again.'));
  }
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * Ensures the authenticated user has the minimum required privileges
 */
export const requireRole = (minimumRole: UserRole) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required.'));
    }

    const hasAccess = hasRequiredRole(req.user.role, minimumRole);
    if (!hasAccess) {
      return next(new ForbiddenError('Access denied. Insufficient account privileges.'));
    }

    return next();
  };
};
