import { create } from 'zustand';
import { favoritesApi } from '../services/favoritesApi';
import { Product } from '../components/ProductCard';

interface FavoritesStore {
  items: Product[];
  isLoading: boolean;
  error: string | null;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (product: Product) => Promise<void>;
  clearFavorites: () => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await favoritesApi.getFavorites();
      set({ items, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch favorites', isLoading: false });
    }
  },

  toggleFavorite: async (product) => {
    const isCurrentlyFavorite = get().items.some(i => i.id === product.id);

    // Optimistic UI update
    set((state) => {
      if (isCurrentlyFavorite) {
        return { items: state.items.filter(i => i.id !== product.id) };
      } else {
        return { items: [product, ...state.items] };
      }
    });

    // Background sync
    try {
      await favoritesApi.toggleFavorite(product.id);
    } catch (err) {
      console.error('Failed to sync toggleFavorite', err);
      // Revert optimism on failure
      get().fetchFavorites();
    }
  },

  clearFavorites: () => {
    set({ items: [], error: null });
  },

  isFavorite: (productId) => {
    return get().items.some(i => i.id === productId);
  }
}));
