import { create } from 'zustand';
import { productApi, ProductQueryFilters } from '../services/productApi';

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  retailPrice: number;
  stockQuantity: number;
  isFeatured: boolean;
  isActive: boolean;
  images: { id: string; url: string; altText: string | null; sortOrder: number }[];
}

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: (filters?: ProductQueryFilters) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  featuredProducts: [],
  isLoading: false,
  error: null,
  
  fetchProducts: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const data = await productApi.getProducts(filters);
      set({ products: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch products', isLoading: false });
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      const data = await productApi.getProducts({ featured: true });
      set({ featuredProducts: data });
    } catch (err: any) {
      console.error('Failed to fetch featured products', err);
    }
  }
}));
