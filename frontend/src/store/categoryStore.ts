import { create } from 'zustand';
import { categoryApi } from '../services/categoryApi';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,
  
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await categoryApi.getCategories();
      set({ categories: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch categories', isLoading: false });
    }
  }
}));
