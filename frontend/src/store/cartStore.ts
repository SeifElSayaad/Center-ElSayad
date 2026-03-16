import { create } from 'zustand';

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
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  totalItems: () => number;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    });
  },

  removeItem: (productId) => {
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    }));
  },

  clearCart: () => set({ items: [] }),

  subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
