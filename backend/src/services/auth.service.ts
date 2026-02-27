import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { signToken } from '../utils/jwt';
import { RegisterB2CBody, LoginBody } from '../types/auth.types';

const SALT_ROUNDS = 12;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function excludePassword<T extends { passwordHash: string }>(user: T) {
  const { passwordHash: _, ...safe } = user;
  return safe;
}

// ─── Register B2C ─────────────────────────────────────────────────────────────

export async function registerB2C(body: RegisterB2CBody) {
  const { email, password, firstName, lastName, phone, gender } = body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw Object.assign(new Error('Email already in use'), { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, passwordHash, firstName, lastName, phone, gender, userType: 'B2C' },
  });

  const token = signToken({ userId: user.id, email: user.email, userType: user.userType });

  return { token, user: excludePassword(user) };
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(body: LoginBody) {
  const { email, password } = body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { adminProfile: true },
  });

  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }

  if (!user.isActive) {
    throw Object.assign(new Error('Account is deactivated'), { status: 403 });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }

  const token = signToken({ userId: user.id, email: user.email, userType: user.userType });

  return { token, user: excludePassword(user) };
}

// ─── Get Me ───────────────────────────────────────────────────────────────────

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { adminProfile: true, addresses: true },
  });

  if (!user) {
    throw Object.assign(new Error('User not found'), { status: 404 });
  }

  return excludePassword(user);
}
