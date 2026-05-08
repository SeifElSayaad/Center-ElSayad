import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { validate } from '../middleware/validate.middleware';
import { createProductSchema, updateProductSchema } from '../types/schemas';

const router = Router();

// Public routes
router.get('/',    ProductController.getProducts);
router.get('/:id', ProductController.getProductById);

// Admin-only routes
router.post('/',    requireAuth, requireAdmin, validate(createProductSchema), ProductController.createProduct);
router.put('/:id',  requireAuth, requireAdmin, validate(updateProductSchema), ProductController.updateProduct);
router.delete('/:id', requireAuth, requireAdmin, ProductController.deleteProduct);

export default router;
