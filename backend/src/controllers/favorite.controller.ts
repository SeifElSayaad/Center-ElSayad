import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import prisma from '../lib/prisma';

export const FavoriteController = {
  getFavorites: async (expressReq: Request, res: Response): Promise<void> => {
    const req = expressReq as AuthenticatedRequest;
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              images: {
                orderBy: { sortOrder: 'asc' },
                take: 1
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Map to frontend Product/Favorite interface
      const formattedItems = favorites.map(fav => ({
        id: fav.product.id,
        name: fav.product.name,
        slug: fav.product.slug,
        description: fav.product.description,
        retailPrice: fav.product.retailPrice,
        stockQuantity: fav.product.stockQuantity,
        isFeatured: fav.product.isFeatured,
        categoryId: fav.product.categoryId,
        images: fav.product.images.map(img => ({
          id: img.id,
          url: img.url,
          altText: img.altText,
          sortOrder: img.sortOrder
        }))
      }));

      res.status(200).json(formattedItems);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      res.status(500).json({ message: 'Internal server error fetching favorites' });
    }
  },

  toggleFavorite: async (expressReq: Request, res: Response): Promise<void> => {
    const req = expressReq as AuthenticatedRequest;
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const productId = req.params?.productId as string;

      if (!productId) {
        res.status(400).json({ message: 'productId is required' });
        return;
      }

      // Check if product exists
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      // Check for existing favorite item
      const existingFavorite = await prisma.favorite.findFirst({
        where: { userId, productId }
      });

      if (existingFavorite) {
        // Remove it (toggle off)
        await prisma.favorite.delete({
          where: { id: existingFavorite.id }
        });
        res.status(200).json({ message: 'Removed from favorites', isFavorite: false });
      } else {
        // Add it (toggle on)
        await prisma.favorite.create({
          data: {
            userId,
            productId
          }
        });
        res.status(201).json({ message: 'Added to favorites', isFavorite: true });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      res.status(500).json({ message: 'Internal server error toggling favorite' });
    }
  }
};
