import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import { BadRequestError, InternalServerError } from '@leaklens/shared';

import { StorageService } from '../../upload/services/storage.service';

interface ExtractTextOptions {
  file: Express.Multer.File;
  cloudinaryPublicId: string;
}

export class OCRService {
  public static async extractText({ file, cloudinaryPublicId }: ExtractTextOptions): Promise<string> {
    if (file.mimetype === 'application/pdf') {
      return this.extractTextFromPdf(file.buffer, cloudinaryPublicId);
    }

    return this.extractTextFromImage(file.buffer);
  }

  private static async extractTextFromPdf(buffer: Buffer, publicId: string): Promise<string> {
    try {
      const pdfData = await pdfParse(buffer);
      const extractedText = pdfData.text.trim();

      if (extractedText.length > 0) {
        return extractedText;
      }

      const pageCount = Math.max(pdfData.numpages ?? 1, 1);
      const pageTexts: string[] = [];

      for (let page = 1; page <= pageCount; page += 1) {
        const pageImageUrl = StorageService.getPdfPageImageUrl(publicId, page);
        const pageText = await this.runTesseract(pageImageUrl);

        if (pageText) {
          pageTexts.push(pageText);
        }
      }

      const combinedText = pageTexts.join('\n').trim();

      if (!combinedText) {
        throw new BadRequestError('OCR could not extract any text from the uploaded PDF.');
      }

      return combinedText;
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }

      throw new InternalServerError('Failed to extract text from the PDF document.');
    }
  }

  private static async extractTextFromImage(buffer: Buffer): Promise<string> {
    try {
      const extractedText = await this.runTesseract(buffer);

      if (!extractedText) {
        throw new BadRequestError('OCR could not extract any text from the uploaded image.');
      }

      return extractedText;
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }

      throw new InternalServerError('Failed to extract text from the uploaded image.');
    }
  }

  private static async runTesseract(input: string | Buffer): Promise<string> {
    const result = await Tesseract.recognize(input, 'eng');
    return result.data.text.trim();
  }
}
