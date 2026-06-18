import { Router } from 'express';
import multer from 'multer';
import { AdminController } from '../controllers/admin.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

// Configure multer to store file in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Protect all admin routes
router.use(requireAuth, requireAdmin);

// Dashboard
router.get('/stats', AdminController.getDashboardStats);

// Products
router.post('/products/bulk-sync', upload.single('file'), AdminController.bulkSyncProducts);

// Orders
router.get('/orders', AdminController.getAllOrders);

// Customers
router.get('/customers', AdminController.getCustomers);
router.patch('/customers/:id/status', AdminController.toggleCustomerStatus);

export default router;
