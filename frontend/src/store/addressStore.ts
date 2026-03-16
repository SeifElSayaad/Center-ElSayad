import { create } from 'zustand';
import { Address, getAddresses, createAddress, CreateAddressPayload } from '../services/addressApi';

// ─── Store ────────────────────────────────────────────────────────────────────

interface AddressStore {
  addresses: Address[];
  selectedAddressId: string | null;
  isLoading: boolean;
  error: string | null;

  fetchAddresses: () => Promise<void>;
  selectAddress: (id: string) => void;
  addAddress: (data: CreateAddressPayload) => Promise<Address>;
  reset: () => void;
}

export const useAddressStore = create<AddressStore>((set) => ({
  addresses: [],
  selectedAddressId: null,
  isLoading: false,
  error: null,

  fetchAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const addresses = await getAddresses();
      // Auto-select default or first address if none selected
      const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;
      set({
        addresses,
        isLoading: false,
        selectedAddressId: defaultAddr?.id ?? null,
      });
    } catch (err: any) {
      set({ isLoading: false, error: err?.message ?? 'Failed to load addresses' });
    }
  },

  selectAddress: (id) => set({ selectedAddressId: id }),

  addAddress: async (data) => {
    const address = await createAddress(data);
    set((state) => ({
      addresses: [...state.addresses, address],
      selectedAddressId: state.selectedAddressId ?? address.id,
    }));
    return address;
  },

  reset: () => set({ addresses: [], selectedAddressId: null, error: null }),
}));
