import { prisma } from '@leaklens/database';

import { ExpenseAnalysisResult } from '../../upload/types/upload.types';

interface CreateExpenseInput {
  uploadedById: string;
  uploadId: string;
  analysis: ExpenseAnalysisResult;
}

export class ExpenseService {
  public static async createFromAnalysis({
    uploadedById,
    uploadId,
    analysis,
  }: CreateExpenseInput) {
    const transactionDate = new Date(`${analysis.transactionDate}T00:00:00.000Z`);

    return prisma.expense.create({
      data: {
        uploadedById,
        uploadId,
        amount: analysis.amount,
        currency: 'USD',
        category: analysis.category,
        merchant: analysis.vendor,
        vendor: analysis.vendor,
        date: transactionDate,
        transactionDate,
        status: 'ANALYZED',
        invoiceNumber: analysis.invoiceNumber,
        summary: analysis.summary,
        riskScore: analysis.riskScore,
        duplicateExpense: analysis.duplicateExpense,
        subscriptionDetected: analysis.subscriptionDetected,
        fraudIndicators: analysis.fraudIndicators,
        anomalies: analysis.anomalies,
        estimatedSavings: analysis.estimatedSavings,
        recommendations: analysis.recommendations,
      },
    });
  }
}
