import { Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { CreateOrderBody, UpdateOrderStatusBody } from '../types/order.types';
import { AuthenticatedRequest } from '../types/auth.types';

export class OrderController {
  static async createOrder(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const body = req.body as CreateOrderBody;
      const newOrder = await OrderService.createOrder(userId, body);
      res.status(201).json(newOrder);
    } catch (error: Error | any) {
      if (error?.message && (error.message.includes('Insufficient stock') || error.message.includes('must contain at least'))) {
        res.status(400).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  static async getUserOrders(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const orders = await OrderService.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const isAdmin = req.user!.userType === 'ADMIN';
      const orderId = req.params.id as string;

      const order = await OrderService.getOrderById(orderId, userId, isAdmin);

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      res.json(order);
    } catch (error: any) {
      if (error.message === 'Unauthorized access to order') {
        res.status(403).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  static async updateOrderStatus(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.id as string;
      const body = req.body as UpdateOrderStatusBody;
      const updatedOrder = await OrderService.updateOrderStatus(orderId, body.status);
      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  }
}
