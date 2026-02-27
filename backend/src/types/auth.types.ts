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
