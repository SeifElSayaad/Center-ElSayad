import { Request } from 'express';
import { UserType, Gender } from '@prisma/client';

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface RegisterB2CBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: Gender;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface SocialLoginBody {
  provider: 'google' | 'facebook';
  idToken: string;                    // Google id_token or Facebook access_token
}

export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  email: string;
  code: string;
  newPassword: string;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

// ─── JWT ─────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  email: string;
  userType: UserType;
}

// ─── Authenticated Request ────────────────────────────────────────────────────

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
