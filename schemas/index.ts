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

export const ResetPasswordSchema = z.object({
  // email: z.string().email({
  //   message: 'Email is required',
  // }),
  code: z.string().regex(/^\d{6}$/, {
    message: 'The code must be exactly 6 digits',
  }),
  newPassword: z.string().min(8, {
    message: 'Minimum 8 characters required',
  }),
});

export const VerifyEmailSchema = z.object({
  code: z.string().regex(/^\d{6}$/, {
    message: 'Invalid verification code',
  }),
});
