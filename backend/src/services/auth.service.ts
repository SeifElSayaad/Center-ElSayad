import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { signToken } from '../utils/jwt';
import { sendOtpEmail } from '../utils/email';
import { RegisterB2CBody, LoginBody, SocialLoginBody, ForgotPasswordBody, ResetPasswordBody, ChangePasswordBody } from '../types/auth.types';

const SALT_ROUNDS = 12;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function excludePassword<T extends { passwordHash: string | null }>(user: T) {
  const { passwordHash: _, ...safe } = user;
  return safe;
}

// ─── Register B2C ─────────────────────────────────────────────────────────────

export async function registerB2C(body: RegisterB2CBody) {
  const { email, password, firstName, lastName, phone, gender } = body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw Object.assign(new Error('Account with this email already exists'), { status: 409 });
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

  if (!user.passwordHash) {
    throw Object.assign(new Error('Invalid email or password. Please use social login if you registered with an external provider.'), { status: 401 });
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

// ─── Update Profile ───────────────────────────────────────────────────────────
//
// Lets a logged-in user update their own first name, last name, and phone.
// We deliberately do NOT allow changing the email here — that would require
// sending a verification link to the new email first (a separate feature).

export async function updateProfile(
  userId: string,
  data: { firstName?: string; lastName?: string; phone?: string | null }
) {
  const user = await prisma.user.update({
    where: { id: userId },
    // Only pass keys that were actually provided in the request body.
    // If firstName is undefined (not sent), Prisma ignores it — no accidental overwrites.
    data: {
      ...(data.firstName !== undefined && { firstName: data.firstName }),
      ...(data.lastName  !== undefined && { lastName:  data.lastName  }),
      ...(data.phone     !== undefined && { phone:     data.phone     }),
    },
  });

  return excludePassword(user);
}

// ─── Social Login ─────────────────────────────────────────────────────────────

interface SocialUserInfo {
  email: string;
  firstName: string;
  lastName: string;
}

async function verifyGoogleToken(idToken: string): Promise<SocialUserInfo> {
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
  if (!res.ok) throw Object.assign(new Error('Invalid Google token'), { status: 401 });
  const data: any = await res.json();
  if (!data.email) throw Object.assign(new Error('Google token missing email'), { status: 401 });
  return {
    email: data.email,
    firstName: data.given_name || data.email.split('@')[0],
    lastName: data.family_name || '',
  };
}

async function verifyFacebookToken(accessToken: string): Promise<SocialUserInfo> {
  const res = await fetch(
    `https://graph.facebook.com/me?fields=id,email,first_name,last_name&access_token=${accessToken}`
  );
  if (!res.ok) throw Object.assign(new Error('Invalid Facebook token'), { status: 401 });
  const data: any = await res.json();
  if (!data.email) throw Object.assign(new Error('Facebook token missing email'), { status: 401 });
  return {
    email: data.email,
    firstName: data.first_name || data.email.split('@')[0],
    lastName: data.last_name || '',
  };
}

export async function socialLogin(body: SocialLoginBody) {
  const { provider, idToken } = body;

  // 1. Verify with provider
  const info = provider === 'google'
    ? await verifyGoogleToken(idToken)
    : await verifyFacebookToken(idToken);

  // 2. Find or create user
  let user = await prisma.user.findUnique({ where: { email: info.email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: info.email,
        firstName: info.firstName,
        lastName: info.lastName,
        authProvider: provider,
        userType: 'B2C',
      },
    });
  }

  if (!user.isActive) {
    throw Object.assign(new Error('Account is deactivated'), { status: 403 });
  }

  // 3. Issue JWT
  const token = signToken({ userId: user.id, email: user.email, userType: user.userType });

  return { token, user: excludePassword(user) };
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

export async function forgotPassword(body: ForgotPasswordBody) {
  const { email } = body;

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration
  if (!user) {
    return { message: 'If that email exists, a reset code has been sent.' };
  }

  // Generate 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Expire in 15 minutes
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  // Invalidate any existing unused codes for this user
  await prisma.passwordReset.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  // Create new reset record
  await prisma.passwordReset.create({
    data: { userId: user.id, code, expiresAt },
  });

  // Send the OTP via email.
  // We use try/catch here so that if the email service is temporarily down,
  // the user still gets a 200 response (to prevent email enumeration)
  // but we log the error for debugging.
  try {
    await sendOtpEmail(email, code);
  } catch (emailError) {
    console.error('⚠️  Failed to send OTP email:', emailError);
    // In production you might want to alert your team via Sentry here,
    // but we don't crash the request — the user can try again.
  }

  return { message: 'If that email exists, a reset code has been sent.' };
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export async function resetPassword(body: ResetPasswordBody) {
  const { email, code, newPassword } = body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw Object.assign(new Error('Invalid email or reset code'), { status: 400 });
  }

  // Find valid, unused, non-expired code
  const resetRecord = await prisma.passwordReset.findFirst({
    where: {
      userId: user.id,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!resetRecord) {
    throw Object.assign(new Error('Invalid or expired reset code'), { status: 400 });
  }

  // Hash new password and update user
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    }),
    prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    }),
  ]);

  return { message: 'Password has been reset successfully.' };
}

// ─── Change Password ──────────────────────────────────────────────────────────

export async function changePassword(userId: string, body: ChangePasswordBody) {
  const { currentPassword, newPassword } = body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.passwordHash) {
    throw Object.assign(new Error('Invalid user or password not set'), { status: 400 });
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    throw Object.assign(new Error('Incorrect current password'), { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { message: 'Password has been updated successfully.' };
}
