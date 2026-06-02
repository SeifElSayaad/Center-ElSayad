import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { ReviewController } from '../controllers/review.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { validate } from '../middleware/validate.middleware';
import { createProductSchema, updateProductSchema, createReviewSchema } from '../types/schemas';

const router = Router();

// Public routes
router.get('/',    ProductController.getProducts);
router.get('/:id', ProductController.getProductById);

// Reviews (Public GET, Auth POST/DELETE)
router.get('/:productId/reviews', ReviewController.getProductReviews);
router.post('/:productId/reviews', requireAuth, validate(createReviewSchema), ReviewController.submitReview);
router.delete('/:productId/reviews', requireAuth, ReviewController.deleteReview);

// Admin-only routes
router.post('/',    requireAuth, requireAdmin, validate(createProductSchema), ProductController.createProduct);
router.put('/:id',  requireAuth, requireAdmin, validate(updateProductSchema), ProductController.updateProduct);
router.delete('/:id', requireAuth, requireAdmin, ProductController.deleteProduct);

export default router;
