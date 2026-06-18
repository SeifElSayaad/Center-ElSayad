import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCategorySchema, updateCategorySchema } from '../types/schemas';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

// Public routes
router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategoryById);

// Admin-only routes
router.post(
  '/',
  requireAuth,
  requireAdmin,
  upload.single('image'),
  validate(createCategorySchema),
  CategoryController.createCategory
);

router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  upload.single('image'),
  validate(updateCategorySchema),
  CategoryController.updateCategory
);

router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  CategoryController.deleteCategory
);

export default router;