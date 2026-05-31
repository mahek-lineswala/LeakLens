import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '@leaklens/types';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  organizationId: string | null;
}

// Cryptography & Hashing Helpers
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// JWT Handlers
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'leaklens_access_secret_fallback_key';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'leaklens_refresh_secret_fallback_key';

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

// Role-Based Access Control (RBAC) Validators
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  ADMIN: 3,
  BUSINESS_OWNER: 2,
  ACCOUNTANT: 1,
};

export const hasRequiredRole = (userRole: UserRole, minimumRoleRequired: UserRole): boolean => {
  const userRank = ROLE_HIERARCHY[userRole] || 0;
  const requiredRank = ROLE_HIERARCHY[minimumRoleRequired] || 0;
  return userRank >= requiredRank;
};
