import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', authController.registerB2C);
router.post('/login',    authController.login);
router.post('/social',   authController.socialLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password',  authController.resetPassword);

// Protected routes (require valid JWT)
router.post('/logout', requireAuth, authController.logout);
router.get('/me',      requireAuth, authController.me);

export default router;
