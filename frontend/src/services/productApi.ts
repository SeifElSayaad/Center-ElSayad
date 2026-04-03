import apiClient from './apiClient';

export interface ProductQueryFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}

export const productApi = {
  getProducts: async (filters?: ProductQueryFilters) => {
    const response = await apiClient.get('/products', { params: filters });
    return response.data;
  },
  getProductById: async (id: string) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
};
