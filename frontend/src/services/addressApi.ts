import apiClient from './apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Address {
  id: string;
  userId: string;
  label?: string | null;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state?: string | null;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressPayload {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  label?: string;
  state?: string;
  isDefault?: boolean;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export async function getAddresses(): Promise<Address[]> {
  const response = await apiClient.get<{ addresses: Address[] }>('/addresses');
  return response.data.addresses;
}

export async function createAddress(data: CreateAddressPayload): Promise<Address> {
  const response = await apiClient.post<{ address: Address }>('/addresses', data);
  return response.data.address;
}

export async function updateAddress(id: string, data: Partial<CreateAddressPayload>): Promise<Address> {
  const response = await apiClient.put<{ address: Address }>(`/addresses/${id}`, data);
  return response.data.address;
}

export async function deleteAddress(id: string): Promise<void> {
  await apiClient.delete(`/addresses/${id}`);
}

export async function setDefaultAddress(id: string): Promise<Address> {
  const response = await apiClient.put<{ address: Address }>(`/addresses/${id}/default`, {});
  return response.data.address;
}
