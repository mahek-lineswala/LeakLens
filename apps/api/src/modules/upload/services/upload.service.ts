import { prisma } from '@leaklens/database';
import { BadRequestError, NotFoundError } from '@leaklens/shared';

import { AIAnalysisService } from '../../ai/services/ai-analysis.service';
import { OCRService } from '../../ocr/services/ocr.service';
import { ExpenseService } from '../../expenses/services/expense.service';
import { ProcessUploadInput, UploadResponseData } from '../types/upload.types';
import { StorageService } from './storage.service';

export class UploadService {
  public static async processUpload({
    file,
    userId,
  }: ProcessUploadInput): Promise<UploadResponseData> {
    let uploadRecord: Awaited<ReturnType<typeof prisma.upload.create>> | null = null;
    let cloudinaryAsset:
      | {
          publicId: string;
          resourceType: string;
        }
      | null = null;

    try {
      const storedFile = await StorageService.uploadFile(file);
      cloudinaryAsset = {
        publicId: storedFile.publicId,
        resourceType: storedFile.resourceType,
      };

      uploadRecord = await prisma.upload.create({
        data: {
          uploadedById: userId,
          originalName: file.originalname,
          fileUrl: storedFile.secureUrl,
          cloudinaryPublicId: storedFile.publicId,
          fileType: file.mimetype,
          fileSize: file.size,
          status: 'PENDING',
        },
      });

      uploadRecord = await prisma.upload.update({
        where: { id: uploadRecord.id },
        data: { status: 'PROCESSING' },
      });

      const rawText = await OCRService.extractText({
        file,
        cloudinaryPublicId: uploadRecord.cloudinaryPublicId,
      });

      if (!rawText.trim()) {
        throw new BadRequestError('OCR result was empty. Please upload a clearer document.');
      }

      const ocrResult = await prisma.oCRResult.create({
        data: {
          uploadId: uploadRecord.id,
          rawText,
        },
      });

      const analysis = await AIAnalysisService.analyze(rawText);

      const expense = await ExpenseService.createFromAnalysis({
        uploadedById: userId,
        uploadId: uploadRecord.id,
        analysis,
      });

      const completedUpload = await prisma.upload.update({
        where: { id: uploadRecord.id },
        data: { status: 'COMPLETED' },
      });

      return {
        upload: completedUpload,
        ocr: ocrResult,
        expense,
      };
    } catch (error) {
      if (uploadRecord) {
        await prisma.upload.update({
          where: { id: uploadRecord.id },
          data: { status: 'FAILED' },
        });
      } else if (cloudinaryAsset) {
        await StorageService.deleteFile(cloudinaryAsset.publicId, cloudinaryAsset.resourceType);
      }

      throw error;
    }
  }

  public static async listUploads(userId: string) {
    const uploads = await prisma.upload.findMany({
      where: { uploadedById: userId },
      include: {
        ocrResult: true,
        expense: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return uploads;
  }

  public static async getUploadDetail(userId: string, uploadId: string) {
    const upload = await prisma.upload.findFirst({
      where: {
        id: uploadId,
        uploadedById: userId,
      },
      include: {
        ocrResult: true,
        expense: true,
      },
    });

    if (!upload) {
      throw new NotFoundError('Upload not found.');
    }

    return upload;
  }

  public static async getDashboardData(userId: string) {
    const uploads = await prisma.upload.findMany({
      where: { uploadedById: userId },
      include: {
        expense: true,
        ocrResult: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const expenses = uploads.flatMap((upload) => (upload.expense ? [upload.expense] : []));

    const totalSpend = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const potentialSavings = expenses.reduce((sum, expense) => sum + (expense.estimatedSavings ?? 0), 0);
    const riskScore = expenses.length
      ? Math.round(expenses.reduce((sum, expense) => sum + (expense.riskScore ?? 0), 0) / expenses.length)
      : 0;

    const dailySpendMap = new Map<string, number>();
    const categoryMap = new Map<string, number>();
    const vendorMap = new Map<string, number>();
    const heatmapMap = new Map<string, { day: string; bucket: string; value: number }>();
    const riskItems: Array<{ id: string; title: string; detail: string; severity: 'Low' | 'Medium' | 'High' }> = [];

    for (const expense of expenses) {
      const dateKey = expense.transactionDate?.toISOString().slice(0, 10) ?? expense.date.toISOString().slice(0, 10);
      dailySpendMap.set(dateKey, (dailySpendMap.get(dateKey) ?? 0) + expense.amount);
      categoryMap.set(expense.category, (categoryMap.get(expense.category) ?? 0) + expense.amount);
      vendorMap.set(expense.vendor ?? expense.merchant, (vendorMap.get(expense.vendor ?? expense.merchant) ?? 0) + expense.amount);

      const sourceDate = expense.transactionDate ?? expense.date;
      const weekday = sourceDate.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
      const hour = sourceDate.getUTCHours();
      const bucket = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
      const heatmapKey = `${weekday}-${bucket}`;
      const existing = heatmapMap.get(heatmapKey);
      heatmapMap.set(heatmapKey, {
        day: weekday,
        bucket,
        value: (existing?.value ?? 0) + 1,
      });

      if (expense.duplicateExpense) {
        riskItems.push({
          id: expense.id,
          title: 'Duplicate Invoice Detected',
          detail: expense.summary ?? `Potential duplicate spend detected for ${expense.vendor ?? expense.merchant}.`,
          severity: 'High',
        });
      }

      if ((expense.riskScore ?? 0) >= 70) {
        riskItems.push({
          id: `${expense.id}-risk`,
          title: 'High Risk Charge',
          detail: expense.summary ?? `Risk score elevated for ${expense.vendor ?? expense.merchant}.`,
          severity: 'High',
        });
      }

      for (const anomaly of expense.anomalies) {
        riskItems.push({
          id: `${expense.id}-${anomaly}`,
          title: 'Spending Anomaly',
          detail: anomaly,
          severity: (expense.riskScore ?? 0) >= 70 ? 'High' : 'Medium',
        });
      }
    }

    const aiSummary = expenses.length
      ? `Processed ${uploads.length} documents. Total spend is $${totalSpend.toFixed(
          2
        )}. Potential savings are $${potentialSavings.toFixed(2)} with an average risk score of ${riskScore}.`
      : 'Upload a document to generate financial summaries, spend trends, and risk analytics.';

    return {
      kpis: {
        totalSpend,
        documentsProcessed: uploads.length,
        potentialSavings,
        riskScore,
      },
      dailySpendTrend: Array.from(dailySpendMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, spend]) => ({ date, spend })),
      expenseCategories: Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value })),
      vendorSpend: Array.from(vendorMap.entries())
        .map(([vendor, spend]) => ({ vendor, spend }))
        .sort((left, right) => right.spend - left.spend)
        .slice(0, 10),
      spendingHeatmap: Array.from(heatmapMap.values()),
      aiSummary,
      recentActivity: uploads.slice(0, 10).map((upload) => ({
        id: upload.id,
        date: upload.createdAt,
        vendor: upload.expense?.vendor ?? 'Unknown',
        amount: upload.expense?.amount ?? 0,
        category: upload.expense?.category ?? 'Uncategorized',
        aiStatus: upload.status,
      })),
      topRisks: riskItems.slice(0, 8),
    };
  }

  public static async getInsightsData(userId: string) {
    const uploads = await prisma.upload.findMany({
      where: { uploadedById: userId },
      include: {
        expense: true,
        ocrResult: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const expenses = uploads.flatMap((upload) => (upload.expense ? [upload.expense] : []));

    const potentialSavings = expenses.reduce((sum, expense) => sum + (expense.estimatedSavings ?? 0), 0);
    const duplicateExpenses = expenses.filter((expense) => expense.duplicateExpense);
    const subscriptions = expenses.filter((expense) => expense.subscriptionDetected);
    const riskScore = expenses.length
      ? Math.round(expenses.reduce((sum, expense) => sum + (expense.riskScore ?? 0), 0) / expenses.length)
      : 0;

    const insightFeed = expenses.flatMap((expense) => {
      const items = [
        ...expense.anomalies.map((detail) => ({
          id: `${expense.id}-${detail}`,
          time: expense.createdAt,
          title: expense.vendor ?? expense.merchant,
          detail,
          severity: (expense.riskScore ?? 0) >= 70 ? 'High' : 'Medium',
          uploadId: expense.uploadId,
        })),
        ...expense.fraudIndicators.map((detail) => ({
          id: `${expense.id}-${detail}`,
          time: expense.createdAt,
          title: 'Fraud Indicator',
          detail,
          severity: 'High',
          uploadId: expense.uploadId,
        })),
      ];

      if (expense.duplicateExpense) {
        items.unshift({
          id: `${expense.id}-duplicate`,
          time: expense.createdAt,
          title: 'Duplicate expense detected',
          detail: expense.summary ?? `Potential duplicate for ${expense.vendor ?? expense.merchant}.`,
          severity: 'High',
          uploadId: expense.uploadId,
        });
      }

      if (expense.subscriptionDetected) {
        items.push({
          id: `${expense.id}-subscription`,
          time: expense.createdAt,
          title: 'Recurring subscription detected',
          detail: expense.summary ?? `Recurring payment found for ${expense.vendor ?? expense.merchant}.`,
          severity: 'Medium',
          uploadId: expense.uploadId,
        });
      }

      return items;
    });

    const vendorGroups = new Map<
      string,
      { vendor: string; total: number; count: number; riskTotal: number; lastDate: Date | null }
    >();

    for (const expense of expenses) {
      const key = expense.vendor ?? expense.merchant;
      const current = vendorGroups.get(key) ?? {
        vendor: key,
        total: 0,
        count: 0,
        riskTotal: 0,
        lastDate: null,
      };

      current.total += expense.amount;
      current.count += 1;
      current.riskTotal += expense.riskScore ?? 0;
      current.lastDate = current.lastDate && current.lastDate > expense.date ? current.lastDate : expense.date;
      vendorGroups.set(key, current);
    }

    return {
      overview: {
        potentialSavings,
        duplicateExpenses: duplicateExpenses.length,
        subscriptionLeaks: subscriptions.length,
        riskScore,
      },
      insightFeed: insightFeed
        .sort((left, right) => right.time.getTime() - left.time.getTime())
        .slice(0, 20),
      leakDetections: expenses
        .filter(
          (expense) =>
            expense.duplicateExpense ||
            expense.subscriptionDetected ||
            expense.anomalies.length > 0 ||
            expense.fraudIndicators.length > 0
        )
        .map((expense) => ({
          id: expense.uploadId ?? expense.id,
          type: expense.duplicateExpense
            ? 'Duplicate Expense'
            : expense.subscriptionDetected
            ? 'Recurring Subscription'
            : 'Spending Anomaly',
          severity: (expense.riskScore ?? 0) >= 70 ? 'High' : (expense.riskScore ?? 0) >= 40 ? 'Medium' : 'Low',
          estimatedSavings: expense.estimatedSavings ?? 0,
          description: expense.summary ?? `Insights generated for ${expense.vendor ?? expense.merchant}.`,
        })),
      vendorAnalysis: Array.from(vendorGroups.values())
        .map((item) => ({
          vendor: item.vendor,
          totalSpend: item.total,
          averageInvoiceValue: item.count ? item.total / item.count : 0,
          riskScore: item.count ? Math.round(item.riskTotal / item.count) : 0,
          invoiceCount: item.count,
        }))
        .sort((left, right) => right.totalSpend - left.totalSpend)
        .slice(0, 10),
      recurringPayments: subscriptions.map((expense) => ({
        id: expense.uploadId ?? expense.id,
        vendor: expense.vendor ?? expense.merchant,
        monthlyCost: expense.amount,
        annualProjection: expense.amount * 12,
        renewalDate: expense.transactionDate ?? expense.date,
      })),
      recommendations: Array.from(
        new Set(expenses.flatMap((expense) => expense.recommendations).filter(Boolean))
      ),
      documents: uploads.map((upload) => ({
        id: upload.id,
        title: upload.originalName,
        vendor: upload.expense?.vendor ?? 'Unknown',
        riskScore: upload.expense?.riskScore ?? 0,
        summary: upload.expense?.summary ?? 'No AI summary available.',
      })),
    };
  }
}
