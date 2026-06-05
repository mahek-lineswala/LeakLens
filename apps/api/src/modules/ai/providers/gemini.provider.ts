import { GoogleGenAI } from '@google/genai';
import { InternalServerError } from '@leaklens/shared';

import { env } from '../../../config/env';
import { expenseAnalysisSchema } from '../../upload/validators/upload.validator';
import { ExpenseAnalysisResult } from '../../upload/types/upload.types';
import { AIProvider } from './ai-provider';

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    vendor: { type: 'string' },
    amount: { type: 'number' },
    invoiceNumber: { type: ['string', 'null'] },
    category: { type: 'string' },
    transactionDate: { type: 'string' },
    summary: { type: 'string' },
    riskScore: { type: 'number' },
    duplicateExpense: { type: 'boolean' },
    subscriptionDetected: { type: 'boolean' },
    fraudIndicators: { type: 'array', items: { type: 'string' } },
    anomalies: { type: 'array', items: { type: 'string' } },
    estimatedSavings: { type: 'number' },
    recommendations: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'vendor',
    'amount',
    'invoiceNumber',
    'category',
    'transactionDate',
    'summary',
    'riskScore',
    'duplicateExpense',
    'subscriptionDetected',
    'fraudIndicators',
    'anomalies',
    'estimatedSavings',
    'recommendations',
  ],
  additionalProperties: false,
} as const;

export class GeminiProvider implements AIProvider {
  private readonly client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

  public async analyze(text: string): Promise<ExpenseAnalysisResult> {
    try {
      const response = await this.client.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: this.buildPrompt(text),
        config: {
          temperature: 0.1,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      });

      const parsed = JSON.parse(response.text ?? '');
      return expenseAnalysisSchema.parse(parsed);
    } catch (error) {
      throw new InternalServerError('Gemini analysis failed.');
    }
  }

  private buildPrompt(text: string): string {
    return [
      'You are LeakLens AI.',
      'You are a financial intelligence engine.',
      'Analyze the following invoice, receipt, bank statement, or expense document.',
      'Return ONLY valid JSON.',
      'Extract:',
      '* vendor',
      '* amount',
      '* invoiceNumber',
      '* category',
      '* transactionDate',
      '* summary',
      'Perform analysis:',
      '1. Detect duplicate spending.',
      '2. Detect unusual charges.',
      '3. Detect recurring subscriptions.',
      '4. Detect possible fraud indicators.',
      '5. Estimate potential savings.',
      '6. Generate business recommendations.',
      'Return format:',
      '{',
      '"vendor": "",',
      '"amount": 0,',
      '"invoiceNumber": "",',
      '"category": "",',
      '"transactionDate": "",',
      '"summary": "",',
      '"riskScore": 0,',
      '"duplicateExpense": false,',
      '"subscriptionDetected": false,',
      '"fraudIndicators": [],',
      '"anomalies": [],',
      '"estimatedSavings": 0,',
      '"recommendations": []',
      '}',
      'If invoiceNumber is missing, return null for that field.',
      'Use an empty array when no fraud indicators, anomalies, or recommendations are found.',
      '',
      'Document Text:',
      text,
    ].join('\n');
  }
}
