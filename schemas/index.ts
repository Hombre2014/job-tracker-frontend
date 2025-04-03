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
  profilePic: z.string().optional(),
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

export const AddContactSchema = z.object({
  boardId: z.string().min(1),
  firstName: z.string().min(2, {
    message: 'First name is required',
  }),
  lastName: z.string().min(2, {
    message: 'Last name is required',
  }),
  comment: z.string().min(1),
  jobTitle: z.string().min(1),
  photoUrl: z.string().min(1),
  location: z.string().min(2),
  emails: z.array(
    z.string().email({
      message: 'Invalid email address',
    })
  ),
  githubUrl: z.string().min(1),
  twitterUrl: z.string().min(1),
  linkedinUrl: z.string().min(1),
  facebookUrl: z.string().min(1),
  phones: z.array(z.string().min(10)),
  companies: z.array(z.string().min(1)),
});

export const EditCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  description: z.string().or(z.literal('')).optional(),
  industry: z.string().or(z.literal('')).optional(),
  url: z
    .string()
    .regex(
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      'Please enter a valid URL (e.g., example.com or https://example.com)'
    )
    .or(z.literal(''))
    .optional(),
});
