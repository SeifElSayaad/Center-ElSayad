import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  registerSchema,
  loginSchema,
  socialLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../types/schemas';

const router = Router();

// Public routes
router.post('/register',         validate(registerSchema),        authController.registerB2C);
router.post('/login',            validate(loginSchema),           authController.login);
router.post('/social',           validate(socialLoginSchema),     authController.socialLogin);
router.post('/forgot-password',  validate(forgotPasswordSchema),  authController.forgotPassword);
router.post('/reset-password',   validate(resetPasswordSchema),   authController.resetPassword);

// Protected routes (require valid JWT)
router.post('/logout', requireAuth, authController.logout);
router.get('/me',      requireAuth, authController.me);

export default router;
