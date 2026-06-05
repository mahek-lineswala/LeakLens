import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

dotenv.config();

if (!process.env.DATABASE_URL) {
  const rootEnvPath = path.resolve(__dirname, '../../../../.env');
  if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath });
  }
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
  AI_PROVIDER: z.enum(['openai', 'gemini']).default('gemini'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-5-mini'),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
});

const parsedEnv = envSchema.superRefine((value, ctx) => {
  if (value.AI_PROVIDER === 'openai' && !value.OPENAI_API_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['OPENAI_API_KEY'],
      message: 'OPENAI_API_KEY is required when AI_PROVIDER=openai',
    });
  }

  if (value.AI_PROVIDER === 'gemini' && !value.GEMINI_API_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['GEMINI_API_KEY'],
      message: 'GEMINI_API_KEY is required when AI_PROVIDER=gemini',
    });
  }
}).parse(process.env);

export const env = parsedEnv;
export type Env = typeof env;
