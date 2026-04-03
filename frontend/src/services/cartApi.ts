import apiClient from './apiClient';

export interface CartItemAPI {
  id: string; // Cart item ID
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export const cartApi = {
  getCart: async (): Promise<CartItemAPI[]> => {
    const response = await apiClient.get('/cart');
    return response.data;
  },
  
  addItem: async (productId: string, quantity: number = 1): Promise<void> => {
    await apiClient.post('/cart', { productId, quantity });
  },
  
  updateQuantity: async (productId: string, quantity: number): Promise<void> => {
    await apiClient.put(`/cart/${productId}`, { quantity });
  },
  
  removeItem: async (productId: string): Promise<void> => {
    await apiClient.delete(`/cart/${productId}`);
  },
  
  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart');
  }
};
