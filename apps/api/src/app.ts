import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { formatSuccess, formatError, AppError } from '@leaklens/shared';

import { authRoutes } from './modules/auth/auth.routes';

// In this monorepo, Turbo runs packages with their own CWD (e.g. apps/api),
// so a root-level .env won't be found by default. We try CWD first, then fall back
// to the monorepo root.
dotenv.config();
if (!process.env.DATABASE_URL) {
  const rootEnvPath = path.resolve(__dirname, '../../../.env');
  if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath });
  }
}

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const app = express();

// 1. Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);

// 2. Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 3. Global API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: formatError('Too many requests, please try again later.'),
});

app.use('/api', apiLimiter);

// 4. API Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json(
    formatSuccess('API is healthy and online', {
      uptime: process.uptime(),
      timestamp: new Date(),
    })
  );
});

// 5. Auth Module Routes
app.use('/api/auth', authRoutes);

// 6. Centralized Error Handling Middleware
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'An unexpected error occurred';
  const errors = err instanceof AppError ? err.errors : [];

  // Log server-side 500 errors
  if (statusCode === 500) {
    console.error('[LeakLens Server Error]', err);
  }

  res.status(statusCode).json(formatError(message, errors));
});

export { app };
export default app;
