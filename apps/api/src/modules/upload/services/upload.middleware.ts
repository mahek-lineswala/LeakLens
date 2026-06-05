import multer, { FileFilterCallback, MulterError } from 'multer';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '@leaklens/shared';
import { ZodError } from 'zod';

import { MAX_UPLOAD_SIZE_BYTES, SUPPORTED_FILE_MIME_TYPES, uploadFileSchema } from '../validators/upload.validator';

export const createUploadMiddleware = () =>
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: MAX_UPLOAD_SIZE_BYTES,
      files: 1,
    },
    fileFilter: (_req, file, cb: FileFilterCallback) => {
      if (!SUPPORTED_FILE_MIME_TYPES.includes(file.mimetype as (typeof SUPPORTED_FILE_MIME_TYPES)[number])) {
        cb(new BadRequestError(`Unsupported file type. Allowed types: ${SUPPORTED_FILE_MIME_TYPES.join(', ')}`));
        return;
      }

      cb(null, true);
    },
  });

export const handleUploadMiddlewareError = (
  error: unknown,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!error) {
    next();
    return;
  }

  if (error instanceof MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      next(new BadRequestError('File size exceeds the 20MB limit.'));
      return;
    }

    next(new BadRequestError(error.message));
    return;
  }

  next(error);
};

export const validateUploadedFile = (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new BadRequestError('A file is required under the "file" field.');
    }

    uploadFileSchema.parse({
      mimetype: req.file.mimetype,
      size: req.file.size,
      originalname: req.file.originalname,
    });

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      next(
        new BadRequestError(
          'Upload validation failed.',
          error.errors.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          }))
        )
      );
      return;
    }

    next(error);
  }
};
