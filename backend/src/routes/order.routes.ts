import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { validate } from '../middleware/validate.middleware';
import { placeOrderSchema } from '../types/schemas';

const router = Router();

// Regular users can place orders, view their history, and see specific order details
router.post('/',    requireAuth, validate(placeOrderSchema), OrderController.createOrder);
router.get('/',     requireAuth, OrderController.getUserOrders);
router.get('/:id',  requireAuth, OrderController.getOrderById);

// Admins only can update the status
router.put('/:id/status', requireAuth, requireAdmin, OrderController.updateOrderStatus);

export default router;
