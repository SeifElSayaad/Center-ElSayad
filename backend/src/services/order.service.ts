import prisma from '../lib/prisma';
import { CreateOrderBody } from '../types/order.types';
import { OrderStatus } from '@prisma/client';

export class OrderService {
  static async createOrder(userId: string, data: CreateOrderBody) {
    const { addressId, paymentMethod, notes, items } = data;

    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    // 1. Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return prisma.$transaction(async (tx) => {
      // 2. Fetch all products and validate stock/existence
      const productIds = items.map((item) => item.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new Error('One or more products not found');
      }

      const productMap = new Map(products.map((p) => [p.id, p]));

      // 3. Calculate Pricing
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = productMap.get(item.productId)!;
        const requestedQuantity = Number(item.quantity);

        if (product.stockQuantity < requestedQuantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        // Deduct stock
        await tx.product.update({
          where: { id: product.id },
          data: { stockQuantity: { decrement: requestedQuantity } },
        });

        const unitPrice = product.retailPrice;
        const totalPrice = unitPrice * requestedQuantity;
        subtotal += totalPrice;

        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          unitPrice,
          quantity: requestedQuantity,
          totalPrice,
        });
      }

      // Calculate totals
      const taxAmount = 0;      // Hardcoded for now. Can pull from StoreSetting
      const shippingAmount = 0; // Hardcoded.
      const discountAmount = 0;

      const totalAmount = subtotal - discountAmount + taxAmount + shippingAmount;

      // 4. Create Order
      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          paymentMethod: paymentMethod || 'CASH_ON_DELIVERY',
          subtotal,
          discountAmount,
          shippingAmount,
          taxAmount,
          totalAmount,
          notes,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });
  }

  static async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getOrderById(orderId: string, userId: string, isAdmin: boolean) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, address: true },
    });

    if (!order) {
      return null;
    }

    // Security check: only the owner or an admin can view details
    if (!isAdmin && order.userId !== userId) {
      throw new Error('Unauthorized access to order');
    }

    return order;
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
