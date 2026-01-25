/**
 * Password strength validation utility
 * Checks if password meets strong password requirements
 */

export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
export const PASSWORD_STRENGTH_MESSAGE =
  'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number';

export const isStrongPassword = (password: string): boolean => {
  return STRONG_PASSWORD_REGEX.test(password);
};

export const getPasswordStrengthMessage = (): string => {
  return PASSWORD_STRENGTH_MESSAGE;
};
