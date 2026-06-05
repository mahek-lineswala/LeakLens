import { Expense, OCRResult, Upload } from '@leaklens/database';

export interface ProcessUploadInput {
  file: Express.Multer.File;
  userId: string;
}

export interface ExpenseAnalysisResult {
  vendor: string;
  amount: number;
  invoiceNumber: string | null;
  category: string;
  transactionDate: string;
  summary: string;
  riskScore: number;
  duplicateExpense: boolean;
  subscriptionDetected: boolean;
  fraudIndicators: string[];
  anomalies: string[];
  estimatedSavings: number;
  recommendations: string[];
}

export interface UploadResponseData {
  upload: Upload;
  ocr: OCRResult;
  expense: Expense;
}

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  resourceType: string;
  originalFilename: string;
  bytes: number;
  format?: string;
}
