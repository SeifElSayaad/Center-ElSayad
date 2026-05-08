import { Router } from 'express';
import { FavoriteController } from '../controllers/favorite.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Retrieve all favorites for current user
router.get('/', requireAuth, FavoriteController.getFavorites);

// Toggle (add/remove) a product in favorites
router.post('/toggle/:productId', requireAuth, FavoriteController.toggleFavorite);

export default router;
