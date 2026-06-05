import { z } from 'zod';

export const MAX_UPLOAD_SIZE_BYTES = 20 * 1024 * 1024;

export const SUPPORTED_FILE_MIME_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/webp',
  'application/pdf',
] as const;

export const uploadFileSchema = z.object({
  mimetype: z.enum(SUPPORTED_FILE_MIME_TYPES, {
    errorMap: () => ({
      message: `Unsupported file type. Allowed types: ${SUPPORTED_FILE_MIME_TYPES.join(', ')}`,
    }),
  }),
  size: z
    .number()
    .max(MAX_UPLOAD_SIZE_BYTES, 'File size exceeds the 20MB limit.'),
  originalname: z.string().min(1, 'Original filename is required.'),
});

export const expenseAnalysisSchema = z.object({
  vendor: z.string().trim().min(1, 'vendor is required'),
  amount: z.number().finite().nonnegative('amount must be non-negative'),
  invoiceNumber: z.string().trim().nullable(),
  category: z.string().trim().min(1, 'category is required'),
  transactionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'transactionDate must be YYYY-MM-DD'),
  summary: z.string().trim().min(1, 'summary is required'),
  riskScore: z.number().int().min(0).max(100),
  duplicateExpense: z.boolean(),
  subscriptionDetected: z.boolean(),
  fraudIndicators: z.array(z.string().trim().min(1)).default([]),
  anomalies: z.array(z.string().trim().min(1)).default([]),
  estimatedSavings: z.number().finite().nonnegative(),
  recommendations: z.array(z.string().trim().min(1)).default([]),
});

export type ExpenseAnalysisSchema = z.infer<typeof expenseAnalysisSchema>;
