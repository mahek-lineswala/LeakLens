import { prisma } from '@leaklens/database';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyRefreshToken, JWTPayload } from '@leaklens/auth';
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from '@leaklens/shared';
import { Role } from '@leaklens/database';

interface RegisterInputData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  organizationName?: string;
}

export class AuthService {
  /**
   * Register a new user and provision an organization if organizationName is supplied
   */
  public static async register(data: RegisterInputData) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestError('An account with this email address already exists.');
    }

    const hashedPassword = await hashPassword(data.passwordHash);

    // If an organization name is provided, provision a new organization and assign BUSINESS_OWNER
    if (data.organizationName) {
      const slug = this.generateSlug(data.organizationName);

      // Check for slug conflicts and resolve by adding a timestamp suffix if necessary
      const existingOrg = await prisma.organization.findUnique({
        where: { slug },
      });

      const finalSlug = existingOrg 
        ? `${slug}-${Math.floor(Math.random() * 10000)}` 
        : slug;

      const user = await prisma.$transaction(async (tx) => {
        const org = await tx.organization.create({
          data: {
            name: data.organizationName!,
            slug: finalSlug,
            subscriptionStatus: 'FREE',
          },
        });

        return tx.user.create({
          data: {
            email: data.email,
            passwordHash: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            role: 'BUSINESS_OWNER',
            organizationId: org.id,
            status: 'ACTIVE',
          },
          include: {
            organization: true,
          },
        });
      });

      return this.sanitizeUser(user);
    } 
    
    // Register without organization (join later or assign as independent accountant)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'ACCOUNTANT',
        status: 'ACTIVE',
      },
    });

    return this.sanitizeUser(user);
  }

  /**
   * Log in a user and return access + refresh tokens
   */
  public static async login(email: string, passwordHash: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    if (user.status === 'SUSPENDED') {
      throw new ForbiddenError('Your account has been suspended. Please contact support.');
    }

    const isPasswordValid = await comparePassword(passwordHash, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token via refresh token cookie validation
   */
  public static async refresh(token: string) {
    const decoded = verifyRefreshToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new UnauthorizedError('User session not found.');
    }

    if (user.status === 'SUSPENDED') {
      throw new ForbiddenError('Your account has been suspended.');
    }

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };

    const newAccessToken = generateAccessToken(payload);
    return { accessToken: newAccessToken };
  }

  /**
   * Retrieve current authenticated user profile details
   */
  public static async getCurrentUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    return this.sanitizeUser(user);
  }

  // Slug Generator Utility
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Remove sensitive fields before returning user details
  private static sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
