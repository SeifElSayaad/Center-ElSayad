import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All cart operations require authentication
router.use(requireAuth as any);

router.get('/', CartController.getCart);
router.post('/', CartController.addItem);
router.delete('/', CartController.clearCart);

router.put('/:productId', CartController.updateQuantity);
router.delete('/:productId', CartController.removeItem);

export default router;
