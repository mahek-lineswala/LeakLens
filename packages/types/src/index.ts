export type UserRole = 'ADMIN' | 'BUSINESS_OWNER' | 'ACCOUNTANT';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'INVITED';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  organizationId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  subscriptionStatus: 'FREE' | 'PRO' | 'ENTERPRISE';
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseStatus = 'PENDING' | 'ANALYZED' | 'FLAGGED' | 'APPROVED' | 'REJECTED';
export type UploadStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Expense {
  id: string;
  organizationId?: string | null;
  uploadedById: string;
  uploadId?: string | null;
  amount: number;
  currency: string;
  category: string;
  merchant: string;
  vendor?: string | null;
  date: Date;
  transactionDate?: Date | null;
  status: ExpenseStatus;
  invoiceNumber?: string | null;
  summary?: string | null;
  riskScore?: number | null;
  duplicateExpense?: boolean;
  subscriptionDetected?: boolean;
  fraudIndicators?: string[];
  anomalies?: string[];
  estimatedSavings?: number | null;
  recommendations?: string[];
  invoiceId?: string | null;
  receiptId?: string | null;
  ocrScore?: number | null;
  matchedLeakId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Upload {
  id: string;
  organizationId?: string | null;
  uploadedById: string;
  originalName: string;
  fileUrl: string;
  cloudinaryPublicId: string;
  fileType: string;
  fileSize: number;
  status: UploadStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface OCRResult {
  id: string;
  uploadId: string;
  rawText: string;
  createdAt: Date;
}

export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Invoice {
  id: string;
  organizationId: string;
  expenseId?: string | null;
  fileUrl: string;
  fileKey: string;
  status: DocumentStatus;
  invoiceNumber?: string | null;
  billingDate?: Date | null;
  dueDate?: Date | null;
  totalAmount?: number | null;
  taxAmount?: number | null;
  vendorName?: string | null;
  vendorAddress?: string | null;
  detectedIban?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Receipt {
  id: string;
  organizationId: string;
  expenseId?: string | null;
  fileUrl: string;
  fileKey: string;
  status: DocumentStatus;
  merchantName?: string | null;
  transactionDate?: Date | null;
  totalAmount?: number | null;
  taxAmount?: number | null;
  paymentMethod?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type AlertStatus = 'ACTIVE' | 'RESOLVED' | 'MUTED';
export type AlertType = 'DUPLICATE_EXPENSE' | 'UNUSUAL_TRANSACTION' | 'SUBSCRIPTION_LEAK' | 'INVOICE_FRAUD';

export interface Alert {
  id: string;
  organizationId: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  metadata?: Record<string, any> | null;
  resolvedById?: string | null;
  resolvedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ReportType = 'MONTHLY_SUMMARY' | 'LEAK_DETECTION' | 'TAX_COMPLIANCE';
export type ReportStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Report {
  id: string;
  organizationId: string;
  generatedById: string;
  type: ReportType;
  status: ReportStatus;
  name: string;
  fileUrl?: string | null;
  filters?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionLeak {
  id: string;
  organizationId: string;
  serviceName: string;
  estimatedMonthlyCost: number;
  frequency: string;
  status: 'ACTIVE' | 'RESOLVED' | 'IGNORED';
  detectedDate: Date;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
