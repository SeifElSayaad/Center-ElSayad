import { create } from 'zustand';
import { cartApi } from '../services/cartApi';
import { authStorage } from '../auth/storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;          // product ID
  productId: string;
  name: string;
  price: number;       // unit price
  quantity: number;
  imageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { id?: string, quantity?: number }) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  subtotal: () => number;
  totalItems: () => number;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchCart: async () => {
    const token = await authStorage.getToken();
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const items = await cartApi.getCart();
      set({ items, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch cart', isLoading: false });
    }
  },

  addItem: async (item) => {
    const qtyToAdd = item.quantity || 1;
    // Optimistic update
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + qtyToAdd } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, id: item.id || Math.random().toString(), quantity: qtyToAdd }] };
    });

    // Background sync
    const token = await authStorage.getToken();
    if (token) {
      try {
        await cartApi.addItem(item.productId, qtyToAdd);
        // Re-fetch to guarantee correct IDs if it was newly created
        await get().fetchCart();
      } catch (err) {
        console.error('Failed to sync addItem to cart', err);
      }
    }
  },

  removeItem: async (productId) => {
    // Optimistic update
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));

    const token = await authStorage.getToken();
    if (token) {
      try {
        await cartApi.removeItem(productId);
      } catch (err) {
        console.error('Failed to sync removeItem from cart', err);
      }
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      return get().removeItem(productId);
    }
    // Optimistic update
    set((state) => ({
      items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    }));

    const token = await authStorage.getToken();
    if (token) {
      try {
        await cartApi.updateQuantity(productId, quantity);
      } catch (err) {
        console.error('Failed to sync updateQuantity', err);
      }
    }
  },

  clearCart: async () => {
    set({ items: [] });
    
    const token = await authStorage.getToken();
    if (token) {
      try {
        await cartApi.clearCart();
      } catch (err) {
        console.error('Failed to sync clearCart', err);
      }
    }
  },

  subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
