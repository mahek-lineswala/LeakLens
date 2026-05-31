import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { formatSuccess, BadRequestError, UnauthorizedError } from '@leaklens/shared';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  /**
   * Register a new user accounts
   */
  public static register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName, organizationName } = req.body;

      const user = await AuthService.register({
        email,
        passwordHash: password, // Named passwordHash inside body mappings
        firstName,
        lastName,
        organizationName,
      });

      return res
        .status(201)
        .json(formatSuccess('Account successfully registered.', user));
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Log in user, sets secure HttpOnly cookie for Refresh token
   */
  public static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const { user, accessToken, refreshToken } = await AuthService.login(email, password);

      // Set Refresh Token as Secure, HttpOnly cookie
      res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS);

      // Optionally set Access Token as cookie as well for easy client ingestion if needed,
      // but standard API returns it in body.
      return res
        .status(200)
        .json(formatSuccess('Login successful.', { user, accessToken }));
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Rotates JWT access tokens using refresh token cookies
   */
  public static refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.refresh_token;

      if (!token) {
        throw new UnauthorizedError('Session expired or inactive. Please log in again.');
      }

      const { accessToken } = await AuthService.refresh(token);

      return res
        .status(200)
        .json(formatSuccess('Session token successfully refreshed.', { accessToken }));
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Log out user, clearing secure cookies
   */
  public static logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('refresh_token', {
        ...COOKIE_OPTIONS,
        maxAge: 0, // Instant expiry
      });

      return res
        .status(200)
        .json(formatSuccess('Logout successful. Cookie cleared.'));
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Retrieve currently logged-in user profile details
   */
  public static me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Not logged in.');
      }

      const userProfile = await AuthService.getCurrentUserProfile(req.user.userId);

      return res
        .status(200)
        .json(formatSuccess('User profile details retrieved.', userProfile));
    } catch (error) {
      return next(error);
    }
  };
}
