import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export const tokenSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
})

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  // token: z.string().min(1, 'Verification token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
})
