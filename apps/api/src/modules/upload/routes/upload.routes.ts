import { Router } from 'express';

import { authenticate } from '../../../middleware/auth.middleware';
import { createUploadMiddleware, handleUploadMiddlewareError, validateUploadedFile } from '../services/upload.middleware';
import { UploadController } from '../controllers/upload.controller';

const router = Router();

router.get('/dashboard', authenticate, UploadController.dashboard);
router.get('/insights', authenticate, UploadController.insights);
router.get('/history', authenticate, UploadController.list);
router.get('/:id', authenticate, UploadController.detail);
router.post(
  '/',
  authenticate,
  createUploadMiddleware().single('file'),
  handleUploadMiddlewareError,
  validateUploadedFile,
  UploadController.create
);

export { router as uploadRoutes };
export default router;
