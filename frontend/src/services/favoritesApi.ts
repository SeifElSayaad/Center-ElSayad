import apiClient from './apiClient';
import { Product } from '../components/ProductCard';

export const favoritesApi = {
  getFavorites: async (): Promise<Product[]> => {
    const response = await apiClient.get('/favorites');
    return response.data;
  },

  toggleFavorite: async (productId: string): Promise<{ message: string; isFavorite: boolean }> => {
    const response = await apiClient.post(`/favorites/toggle/${productId}`);
    return response.data;
  }
};
