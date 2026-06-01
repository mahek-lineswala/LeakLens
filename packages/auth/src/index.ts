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
const requireEnv = (value: string | undefined, name: string): string => {
  if (!value || !value.trim()) {
    throw new Error(`${name} is required. Set it in your .env file.`);
  }
  return value;
};

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, requireEnv(process.env.JWT_ACCESS_SECRET, 'JWT_ACCESS_SECRET'), {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, requireEnv(process.env.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET'), {
    expiresIn: '7d',
  });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, requireEnv(process.env.JWT_ACCESS_SECRET, 'JWT_ACCESS_SECRET')) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, requireEnv(process.env.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET')) as JWTPayload;
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
