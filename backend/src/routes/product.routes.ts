import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { ReviewController } from '../controllers/review.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { validate } from '../middleware/validate.middleware';
import { createProductSchema, updateProductSchema, createReviewSchema } from '../types/schemas';
import multer from 'multer';

// Setup multer memory storage (we'll upload the buffer directly to Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = Router();

// Public routes
router.get('/',    ProductController.getProducts);
router.get('/:id', ProductController.getProductById);

// Reviews (Public GET, Auth POST/DELETE)
router.get('/:productId/reviews', ReviewController.getProductReviews);
router.post('/:productId/reviews', requireAuth, validate(createReviewSchema), ReviewController.submitReview);
router.delete('/:productId/reviews', requireAuth, ReviewController.deleteReview);

// Admin-only routes
router.post('/',    requireAuth, requireAdmin, upload.single('image'), validate(createProductSchema), ProductController.createProduct);
router.put('/:id',  requireAuth, requireAdmin, upload.single('image'), validate(updateProductSchema), ProductController.updateProduct);
router.delete('/:id', requireAuth, requireAdmin, ProductController.deleteProduct);

export default router;
