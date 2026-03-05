import apiClient from './apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Gender = 'MALE' | 'FEMALE';

export interface RegisterB2CPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender?: Gender;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  userType: 'B2C' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ─── Functions ────────────────────────────────────────────────────────────────

export async function registerB2C(data: RegisterB2CPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
}

export async function login(data: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
}

// ─── Social Login ─────────────────────────────────────────────────────────────

export interface SocialLoginPayload {
  provider: 'google' | 'facebook';
  idToken: string;
}

export async function socialLogin(data: SocialLoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/social', data);
  return response.data;
}
