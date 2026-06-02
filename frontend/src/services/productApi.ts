import apiClient from './apiClient';

export interface ProductQueryFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
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
  getReviews: async (productId: string, page: number = 1, limit: number = 10) => {
    const response = await apiClient.get(`/products/${productId}/reviews`, { params: { page, limit } });
    return response.data;
  },
  submitReview: async (productId: string, rating: number, comment?: string) => {
    const response = await apiClient.post(`/products/${productId}/reviews`, { rating, comment });
    return response.data;
  },
  deleteReview: async (productId: string) => {
    const response = await apiClient.delete(`/products/${productId}/reviews`);
    return response.data;
  },
};
