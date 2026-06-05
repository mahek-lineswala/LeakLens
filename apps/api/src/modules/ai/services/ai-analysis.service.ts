import { InternalServerError } from '@leaklens/shared';

import { env } from '../../../config/env';
import { ExpenseAnalysisResult } from '../../upload/types/upload.types';
import { AIProvider } from '../providers/ai-provider';
import { GeminiProvider } from '../providers/gemini.provider';
import { OpenAIProvider } from '../providers/openai.provider';

export class AIAnalysisService {
  private static provider: AIProvider | null = null;

  public static async analyze(text: string): Promise<ExpenseAnalysisResult> {
    if (!text.trim()) {
      throw new InternalServerError('Cannot analyze an empty OCR payload.');
    }

    return this.getProvider().analyze(text);
  }

  private static getProvider(): AIProvider {
    if (this.provider) {
      return this.provider;
    }

    if (env.AI_PROVIDER === 'openai') {
      this.provider = new OpenAIProvider();
      return this.provider;
    }

    if (env.AI_PROVIDER === 'gemini') {
      this.provider = new GeminiProvider();
      return this.provider;
    }

    throw new InternalServerError(`Unsupported AI provider: ${env.AI_PROVIDER}`);
  }
}
