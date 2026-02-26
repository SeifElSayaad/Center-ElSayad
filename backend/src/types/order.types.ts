import { OrderStatus, PaymentMethod } from '@prisma/client';

export interface OrderItemInput {
  productId: string;
  quantity: string | number;
}

export interface CreateOrderBody {
  addressId: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  items: OrderItemInput[];
}

export interface UpdateOrderStatusBody {
  status: OrderStatus;
}
