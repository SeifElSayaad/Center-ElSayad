import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import prisma from '../lib/prisma';

export const CartController = {
  getCart: async (expressReq: Request, res: Response): Promise<void> => {
    const req = expressReq as AuthenticatedRequest;
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const cartItems = await prisma.cartItem.findMany({
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
        }
      });

      // Map to the frontend CartItem expected interface
      const formattedItems = cartItems.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: item.product.retailPrice,
        quantity: item.quantity,
        imageUrl: item.product.images[0]?.url || undefined
      }));

      res.status(200).json(formattedItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Internal server error fetching cart' });
    }
  },

  addItem: async (expressReq: Request, res: Response): Promise<void> => {
    const req = expressReq as AuthenticatedRequest;
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { productId, quantity = 1 } = req.body;

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

      // Check for existing cart item
      const existingItem = await prisma.cartItem.findFirst({
        where: { userId, productId }
      });

      if (existingItem) {
        // Increment quantity
        const updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity }
        });
        res.status(200).json(updatedItem);
      } else {
        // Create new cart item
        const newItem = await prisma.cartItem.create({
          data: {
            userId,
            productId,
            quantity
          }
        });
        res.status(201).json(newItem);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ message: 'Internal server error adding to cart' });
    }
  },

  updateQuantity: async (expressReq: Request, res: Response): Promise<void> => {
    const req = expressReq as AuthenticatedRequest;
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const productId = req.params?.productId as string;
      const { quantity } = req.body;

      if (quantity === undefined || quantity < 0) {
        res.status(400).json({ message: 'Valid quantity is required' });
        return;
      }

      if (quantity === 0) {
        // Delete if quantity is exactly 0
        await prisma.cartItem.deleteMany({
          where: { userId, productId }
        });
        res.status(204).send();
        return;
      }

      const updatedItem = await prisma.cartItem.updateMany({
        where: { userId, productId },
        data: { quantity }
      });

      if (updatedItem.count === 0) {
         res.status(404).json({ message: 'Cart item not found' });
         return;
      }

      res.status(200).json({ message: 'Quantity updated' });
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      res.status(500).json({ message: 'Internal server error updating cart quantity' });
    }
  },

  removeItem: async (expressReq: Request, res: Response): Promise<void> => {
    const req = expressReq as AuthenticatedRequest;
    try {
      const userId = req.user?.userId;
      if (!userId) {
         res.status(401).json({ message: 'Unauthorized' });
         return;
      }

      const productId = req.params?.productId as string;

      const deletedItem = await prisma.cartItem.deleteMany({
        where: { userId, productId }
      });

      if (deletedItem.count === 0) {
         res.status(404).json({ message: 'Cart item not found' });
         return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error removing cart item:', error);
      res.status(500).json({ message: 'Internal server error removing cart item' });
    }
  },

  clearCart: async (expressReq: Request, res: Response): Promise<void> => {
    const req = expressReq as AuthenticatedRequest;
    try {
      const userId = req.user?.userId;
      if (!userId) {
         res.status(401).json({ message: 'Unauthorized' });
         return;
      }

      await prisma.cartItem.deleteMany({
        where: { userId }
      });

      res.status(204).send();
    } catch (error) {
       console.error('Error clearing cart:', error);
       res.status(500).json({ message: 'Internal server error clearing cart' });
    }
  }
};
