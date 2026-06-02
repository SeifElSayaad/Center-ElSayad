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

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiClient.get<AuthUser>('/auth/me');
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

// ─── Forgot / Reset Password ──────────────────────────────────────────────────

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
  return response.data;
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>('/auth/reset-password', {
    email,
    code,
    newPassword,
  });
  return response.data;
}

// ─── Update Profile ───────────────────────────────────────────────────────────

// Only firstName, lastName, phone can be changed.
// Email changes are not supported yet (require email verification flow).
export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
}

export async function updateProfile(data: UpdateProfilePayload): Promise<AuthUser> {
  // PATCH sends only the fields you want to change — the backend merges them.
  const response = await apiClient.patch<AuthUser>('/auth/me', data);
  return response.data;
}

// ─── Change Password ──────────────────────────────────────────────────────────

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(data: ChangePasswordPayload): Promise<{ message: string }> {
  const response = await apiClient.patch<{ message: string }>('/auth/me/password', data);
  return response.data;
}
