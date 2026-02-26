import prisma from '../lib/prisma';
import { CreateOrderBody } from '../types/order.types';
import { OrderStatus } from '@prisma/client';

export class OrderService {
  static async createOrder(userId: string, data: CreateOrderBody) {
    const { addressId, paymentMethod, notes, items } = data;

    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    // 1. Fetch user to check B2B status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { b2bProfile: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isB2BOrder = user.userType === 'B2B' && user.b2bProfile?.status === 'APPROVED';
    
    // Fetch store setting for global B2B discount fallback (optional, relying on profile for now)
    const discountPercent = isB2BOrder && user.b2bProfile ? user.b2bProfile.discountPercent : 0;

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

        const unitRetailPrice = product.retailPrice;
        let finalUnitPrice = unitRetailPrice;

        if (isB2BOrder) {
          finalUnitPrice = unitRetailPrice * (1 - discountPercent / 100);
        }

        const totalPrice = finalUnitPrice * requestedQuantity;
        subtotal += unitRetailPrice * requestedQuantity; // raw subtotal before discounting

        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          unitPrice: finalUnitPrice,
          quantity: requestedQuantity,
          totalPrice,
        });
      }

      // Calculate totals
      let totalAmount = 0;
      let discountAmount = 0;
      
      const taxAmount = 0;      // Hardcoded for now. Can pull from StoreSetting
      const shippingAmount = 0; // Hardcoded.

      if (isB2BOrder) {
         discountAmount = subtotal * (discountPercent / 100);
      }
      
      totalAmount = subtotal - discountAmount + taxAmount + shippingAmount;

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
          isB2BOrder,
          discountPercent,
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
