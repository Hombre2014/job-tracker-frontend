import * as z from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(8, {
    message: 'Minimum 8 characters required',
  }),
  role: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});

// TODO: This is always true from restriction on the input in verify-email component. It never triggers an error message! Refactor
export const VerifyEmailSchema = z.object({
  code: z.string().max(6, {
    message: 'Invalid code',
  }),
});
