import { Request, Response, NextFunction } from 'express';
import { BadRequestError, UnauthorizedError, formatSuccess } from '@leaklens/shared';

import { UploadService } from '../services/upload.service';

export class UploadController {
  public static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      if (!req.file) {
        throw new BadRequestError('No file was attached to the request.');
      }

      const data = await UploadService.processUpload({
        file: req.file,
        userId: req.user.userId,
      });

      return res
        .status(201)
        .json(formatSuccess('Document processed successfully', data));
    } catch (error) {
      return next(error);
    }
  };

  public static list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      const data = await UploadService.listUploads(req.user.userId);

      return res.status(200).json(formatSuccess('Uploads retrieved successfully.', data));
    } catch (error) {
      return next(error);
    }
  };

  public static detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      const data = await UploadService.getUploadDetail(req.user.userId, req.params.id);

      return res.status(200).json(formatSuccess('Upload detail retrieved successfully.', data));
    } catch (error) {
      return next(error);
    }
  };

  public static dashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      const data = await UploadService.getDashboardData(req.user.userId);

      return res.status(200).json(formatSuccess('Dashboard data retrieved successfully.', data));
    } catch (error) {
      return next(error);
    }
  };

  public static insights = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      const data = await UploadService.getInsightsData(req.user.userId);

      return res.status(200).json(formatSuccess('Insights data retrieved successfully.', data));
    } catch (error) {
      return next(error);
    }
  };
}
