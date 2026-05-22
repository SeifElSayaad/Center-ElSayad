import { z } from 'zod';

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password too long'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  phone: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').max(72),
});

export const socialLoginSchema = z.object({
  provider: z.enum(['google', 'facebook']),
  idToken: z.string().min(1, 'ID token is required'),
});

// We allow updating name and phone, but NOT email.
// Changing email requires a verification flow (send link to new email)
// which we haven't built yet. Keeping it simple for now.
export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50).optional(),
  lastName: z.string().min(1, 'Last name is required').max(50).optional(),
  phone: z.string().max(20).optional().nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters').max(72),
});

// ─── Product Schemas ──────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  retailPrice: z.number().positive('Price must be positive'),
  stockQuantity: z.number().int().min(0).default(0),
  categoryId: z.string().min(1, 'Category is required'),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

// ─── Order Schemas ────────────────────────────────────────────────────────────

export const placeOrderSchema = z.object({
  addressId: z.string().min(1, 'Address is required'),
  paymentMethod: z.enum(['CASH_ON_DELIVERY', 'MOCK_PAYMENT']),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive('Quantity must be at least 1'),
      })
    )
    .min(1, 'Order must have at least one item'),
});

// ─── Address Schemas ──────────────────────────────────────────────────────────

export const createAddressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(1),
  phone: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  country: z.string().default('Egypt'),
  isDefault: z.boolean().default(false),
});

// ─── Category Schemas ─────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  sortOrder: z.number().int().min(0).default(0),
});

export const updateCategorySchema = createCategorySchema.partial();
