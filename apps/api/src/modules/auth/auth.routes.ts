import { Router } from 'express';
import { AuthController } from './auth.controller';
import { registerSchema, loginSchema } from './auth.validator';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Public Routes
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

// Protected Routes
router.get('/me', authenticate, AuthController.me);

export { router as authRoutes };
export default router;
