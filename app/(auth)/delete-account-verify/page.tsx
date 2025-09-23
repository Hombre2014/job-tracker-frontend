'use client';

import * as z from 'zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, startTransition } from 'react';

import { VerifyEmailSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/Forms/form-error';
import { FormSuccess } from '@/components/Forms/form-success';
import {
  deleteUserAccount,
  createDeleteVerificationCode,
} from '@/redux/user/userThunk';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';

const DeleteAccountVerify = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<any>({});
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingCode, setPendingCode] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof VerifyEmailSchema>>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      code: '',
    },
  });

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);

      // If no user data, redirect to login
      if (!userData.email) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to parse user data:', error);
      router.push('/login');
    }
  }, [router]);

  const onSubmit = async (values: z.infer<typeof VerifyEmailSchema>) => {
    setError('');
    const { code } = values;

    if (!code) {
      setError('Verification code is required');
      return;
    }

    // Store the code and show confirmation dialog
    setPendingCode(code);
    setShowConfirmDialog(true);
  };

  const handleConfirmDeletion = async () => {
    if (!pendingCode) {
      setError('Verification code is missing');
      return;
    }

    setIsDeleting(true);
    setShowConfirmDialog(false);

    startTransition(async () => {
      try {
        // Use Redux thunk to delete account
        await dispatch(deleteUserAccount({ code: pendingCode })).unwrap();

        setSuccess('Account deleted successfully. Redirecting...');

        // Redirect to home page after short delay
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (error: any) {
        setIsDeleting(false);
        const err =
          typeof error === 'string'
            ? error
            : 'Failed to delete account. Please try again.';
        setError(err);
        form.reset();
        setPendingCode('');
        setTimeout(() => setError(''), 5000);
      }
    });
  };

  const handleCancelDeletion = () => {
    setShowConfirmDialog(false);
    setPendingCode('');
  };

  const handleResendCode = async () => {
    if (!user.email) {
      setError('Email not found. Please log in again.');
      return;
    }

    try {
      // Use Redux thunk to resend verification code
      await dispatch(
        createDeleteVerificationCode({ email: user.email })
      ).unwrap();

      setSuccess('Verification code resent successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      const err =
        typeof error === 'string'
          ? error
          : 'Failed to resend code. Please try again.';
      setError(err);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCancel = () => {
    router.push('/home/settings');
  };

  if (isDeleting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] mx-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Deleting Account...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we process your account deletion.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-center gap-y-10 mx-4">
        <div className="flex flex-col items-left h-full md:min-w-[330px] mx-4">
          <h1 className="text-4xl font-semibold text-red-600 dark:text-red-400">
            Delete Account
          </h1>
          <p className="text-slate-500 mt-2 mb-6">
            Enter the verification code sent to {user.email}
          </p>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter 6 digits code"
                          className="border-red-300 focus:border-red-500 focus:ring-red-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white transition duration-300"
                >
                  Delete Account
                </Button>
              </div>
            </form>
          </Form>
          <div className="text-slate-500 text-sm mt-4 w-full flex justify-center">
            <button
              type="button"
              onClick={handleResendCode}
              className="text-blue-500 mx-auto text-sm underline hover:text-blue-600"
            >
              Resend verification code
            </button>
          </div>
        </div>

        <div className="flex flex-col items-left h-full w-[320px] mx-4 border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-4 rounded-md">
          <h3 className="font-semibold mt-2 text-red-800 dark:text-red-300">
            ⚠️ Account Deletion Warning
          </h3>
          <p className="mt-4 text-red-700 dark:text-red-300">
            This action is{' '}
            <span className="font-bold">permanent and irreversible</span>.
          </p>
          <p className="mt-3 text-red-700 dark:text-red-300">
            Deleting your account will:
          </p>
          <ul className="mt-2 list-disc list-inside text-sm text-red-600 dark:text-red-400">
            <li>Remove all your job applications</li>
            <li>Delete all uploaded documents</li>
            <li>Remove all contact information</li>
            <li>Delete all board and note data</li>
            <li>Cancel all notification subscriptions</li>
          </ul>
          <p className="mt-4 text-red-700 dark:text-red-300">
            Is <span className="font-semibold underline">{user.email}</span> the
            correct email address?
          </p>
          <p className="mt-3 text-red-700 dark:text-red-300">
            If you&apos;re having issues, consider{' '}
            <Link
              href="/contact"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              contacting support
            </Link>{' '}
            instead.
          </p>
          <hr className="mt-6 border-red-300 dark:border-red-700" />
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            If you didn&apos;t request account deletion,{' '}
            <Link
              className="text-blue-600 dark:text-blue-400 underline"
              href="/contact"
            >
              contact us immediately
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 dark:text-red-400">
              Final Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700 dark:text-gray-300">
              Are you absolutely sure you want to delete your account? This
              action cannot be undone.
              <br />
              <br />
              <span className="font-semibold text-red-600 dark:text-red-400">
                All your data will be permanently lost.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDeletion}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeletion}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, Delete My Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteAccountVerify;
