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

export interface Expense {
  id: string;
  organizationId: string;
  uploadedById: string;
  amount: number;
  currency: string;
  category: string;
  merchant: string;
  date: Date;
  status: ExpenseStatus;
  invoiceId?: string | null;
  receiptId?: string | null;
  ocrScore?: number | null;
  matchedLeakId?: string | null;
  createdAt: Date;
  updatedAt: Date;
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
