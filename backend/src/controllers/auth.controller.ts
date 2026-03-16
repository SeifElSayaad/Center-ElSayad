import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { AuthenticatedRequest } from '../types/auth.types';

// ─── POST /auth/register ──────────────────────────────────────────────────────

export async function registerB2C(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.registerB2C(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// ─── POST /auth/login ─────────────────────────────────────────────────────────

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// ─── POST /auth/logout ────────────────────────────────────────────────────────

export async function logout(_req: Request, res: Response) {
  // Stateless JWT — client discards the token.
  res.status(200).json({ message: 'Logged out successfully' });
}

// ─── GET /auth/me ─────────────────────────────────────────────────────────────

export async function me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.userId);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

// ─── POST /auth/social ───────────────────────────────────────────────────────

export async function socialLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.socialLogin(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// ─── POST /auth/forgot-password ──────────────────────────────────────────────

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.forgotPassword(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// ─── POST /auth/reset-password ───────────────────────────────────────────────

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.resetPassword(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
