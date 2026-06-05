import { ExpenseAnalysisResult } from '../../upload/types/upload.types';

export interface AIProvider {
  analyze(text: string): Promise<ExpenseAnalysisResult>;
}
