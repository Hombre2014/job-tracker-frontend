'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';

interface WeakPasswordModalProps {
  isOpen: boolean;
  email: string;
}

export const WeakPasswordModal = ({
  isOpen,
  email,
}: WeakPasswordModalProps) => {
  const router = useRouter();

  const handleUpdatePassword = () => {
    // Logout user first
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } catch (error) {
      // Continue with redirect even if localStorage clearing fails
      console.error('Failed to clear auth tokens:', error);
    }

    // Redirect to forgot-password with context
    router.push(
      `/forgot-password?email=${encodeURIComponent(email)}&reason=weak`,
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            🔒 Password Security Update Required
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Your current password doesn&apos;t meet our updated security
            standards.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 my-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
            For your account security, passwords must now contain:
          </p>
          <ul className="text-sm text-yellow-800 dark:text-yellow-200 list-disc list-inside space-y-1">
            <li>At least 8 characters</li>
            <li>At least 1 uppercase letter (A-Z)</li>
            <li>At least 1 lowercase letter (a-z)</li>
            <li>At least 1 number (0-9)</li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>What happens next:</strong>
          </p>
          <ol className="text-sm text-blue-800 dark:text-blue-200 list-decimal list-inside mt-2 space-y-1">
            <li>Click the button below to reset your password</li>
            <li>
              We&apos;ll send a verification code to: <strong>{email}</strong>
            </li>
            <li>Create a new strong password</li>
            <li>Log in with your new password</li>
          </ol>
        </div>

        <Button
          onClick={handleUpdatePassword}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Reset My Password
        </Button>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          This is a one-time security update to protect your account.
        </p>
      </DialogContent>
    </Dialog>
  );
};
