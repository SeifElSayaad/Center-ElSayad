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

interface ProductMetadata {
  totalPages: number;
  currentPage: number;
}

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  metadata: ProductMetadata | null;
  error: string | null;
  fetchProducts: (filters?: ProductQueryFilters) => Promise<void>;
  fetchNextPage: (filters?: ProductQueryFilters) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  featuredProducts: [],
  isLoading: false,
  isFetchingNextPage: false,
  metadata: null,
  error: null,
  
  fetchProducts: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productApi.getProducts(filters);
      set({ 
        products: response.data || response, 
        metadata: response.metadata || null,
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch products', isLoading: false });
    }
  },

  fetchNextPage: async (filters) => {
    const state = get();
    if (state.isFetchingNextPage || !state.metadata) return;
    if (state.metadata.currentPage >= state.metadata.totalPages) return;

    set({ isFetchingNextPage: true, error: null });
    try {
      const nextPage = state.metadata.currentPage + 1;
      const response = await productApi.getProducts({ ...filters, page: nextPage });
      
      set({ 
        products: [...state.products, ...(response.data || [])],
        metadata: response.metadata || null,
        isFetchingNextPage: false 
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch next page', isFetchingNextPage: false });
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      const response = await productApi.getProducts({ featured: true });
      set({ featuredProducts: response.data || response });
    } catch (err: any) {
      console.error('Failed to fetch featured products', err);
    }
  }
}));
