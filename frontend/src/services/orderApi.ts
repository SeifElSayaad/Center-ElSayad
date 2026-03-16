import apiClient from './apiClient';
import { Address } from './addressApi';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentMethod = 'CASH_ON_DELIVERY' | 'MOCK_PAYMENT';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  address?: Address;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface PlaceOrderItem {
  productId: string;
  quantity: number;
}

export interface PlaceOrderPayload {
  addressId: string;
  paymentMethod: PaymentMethod;
  items: PlaceOrderItem[];
  notes?: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export async function placeOrder(data: PlaceOrderPayload): Promise<Order> {
  const response = await apiClient.post<Order>('/orders', data);
  return response.data;
}

export async function getUserOrders(): Promise<Order[]> {
  const response = await apiClient.get<{ orders: Order[] }>('/orders');
  // The backend returns an array directly based on order.service.ts
  return Array.isArray(response.data) ? response.data : (response.data as any).orders || [];
}

export async function getOrderById(orderId: string): Promise<Order> {
  const response = await apiClient.get<Order>(`/orders/${orderId}`);
  return response.data;
}
