/**
 * Password strength validation utility
 * Checks if password meets strong password requirements
 */

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const isStrongPassword = (password: string): boolean => {
  return strongPasswordRegex.test(password);
};

export const getPasswordStrengthMessage = (): string => {
  return 'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number';
};
