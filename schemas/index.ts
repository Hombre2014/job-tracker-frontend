import * as z from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(8, {
    message: 'Minimum 8 characters required',
  }),
  role: z.string().optional(),
  firstName: z.string().min(2, {
    message: 'Name is required',
  }),
  lastName: z.string().min(2, {
    message: 'Name is required',
  }),
});

// export const AccountSettingsSchema = z.object({
//   firstName: z.string().min(2, {
//     message: 'Name is required',
//   }),
//   lastName: z.string().min(2, {
//     message: 'Name is required',
//   }),
// });

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

export const AddJobSchemaShort = z.object({
  jobTitle: z.string().min(1, {
    message: 'Job title is required',
  }),
  company: z.string().min(1, {
    message: 'Company name is required',
  }),
  board: z.string().min(1, {
    message: 'Board is required',
  }),
  list: z.string().min(1, {
    message: 'List is required',
  }),
});
