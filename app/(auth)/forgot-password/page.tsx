'use client';

import * as z from 'zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { RiQuestionMark } from 'react-icons/ri';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, startTransition, useRef } from 'react';

import client from '@/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/Forms/form-error';
import { FormSuccess } from '@/components/Forms/form-success';
import { ForgotPasswordSchema, ResetPasswordSchema } from '@/schemas';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userEmail, setUserEmail] = useState<string>('');
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if user came from weak password detection
  const isWeakPasswordReset = searchParams.get('reason') === 'weak';
  const prefilledEmail = searchParams.get('email') || '';

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: prefilledEmail,
    },
  });

  const newForm = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    const { email } = values;
    setUserEmail(email);

    startTransition(async () => {
      try {
        const res = await client.post(
          '/users/reset-password/create-verification-code',
          { email },
        );

        if (res.status === 200 || res.status === 201 || res.status === 204) {
          newForm.reset();
          setButtonClicked(true);
          setSuccess('Verification code sent to your email');
        }
      } catch (error: any) {
        console.error('Error in forgot password request:', error);
        console.error('Error response:', error?.response?.data);
        const err =
          error?.response?.data?.userFriendlyMessage ||
          error?.response?.data?.message ||
          'User not found. Email field is invalid.';
        setError(err);
        form.reset();
        setTimeout(() => setError(''), 3000);
        setButtonClicked(false);
        router.push('/forgot-password');
      }
    });
  };

  const resetPassword = (values: z.infer<typeof ResetPasswordSchema>) => {
    const { code, newPassword } = values;

    setError('');
    setSuccess('');

    if (!code || !newPassword) {
      setError('Code or password is missing');
      return;
    }

    if (code.length !== 6) {
      setError('Invalid code');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    startTransition(async () => {
      try {
        const res = await client.post('/users/reset-password', {
          email: userEmail,
          code,
          newPassword,
        });

        if (res.status === 200 || res.status === 201 || res.status === 204) {
          setSuccess('Password reset successful');
          newForm.reset();
          timeoutRef.current = setTimeout(() => {
            router.push('/login');
          }, 1500);
        }
      } catch (error: any) {
        const err =
          error?.response?.data?.userFriendlyMessage ||
          'Failed to reset password. Please try again.';
        setError(err);
        setTimeout(() => setError(''), 3000);
      }
    });
  };

  useEffect(() => {
    // Clear messages when component mounts
    setError('');
    setSuccess('');

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-start justify-center h-full min-w-[330px] mx-4">
      {isWeakPasswordReset ? (
        <>
          <h1 className="text-4xl font-semibold">
            🔒 Strengthen Your Password
          </h1>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mt-4 mb-2">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold">
              Security Update Required
            </p>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-2">
              Your current password doesn&apos;t meet our updated security
              standards. Please reset it to a stronger one to continue.
            </p>
          </div>
        </>
      ) : (
        <h1 className="text-4xl font-semibold">Forgot Password</h1>
      )}
      {buttonClicked && (
        <Form {...newForm}>
          <form
            onSubmit={newForm.handleSubmit(resetPassword)}
            className="space-y-6"
          >
            <div className="space-y-4 mt-6">
              <FormField
                control={newForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Reset Password Code</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <RiQuestionMark className="h-4 w-4 border rounded-md p-[1px] mr-1 dark:border-slate-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter the 6 digit code sent to your email.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter the reset code here"
                        maxLength={6}
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your new password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeat New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Re-enter your new password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="text-slate-500 text-sm">
              <span className="font-semibold">*At least:</span> 8 characters, 1
              number, 1 upper, 1 lower.
            </p>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              type="submit"
              className="w-full bg-blue-500 transition duration-300 delay-100 hover:bg-blue-600 dark:text-white"
            >
              Reset Password
            </Button>
          </form>
        </Form>
      )}
      {!buttonClicked && (
        <div>
          <p className="text-slate-500 mt-2 mb-6">
            {isWeakPasswordReset
              ? "We'll send a verification code to your email"
              : 'Enter your email'}
          </p>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.error('❌ Form validation failed:', errors);
                setError('Please enter a valid email address');
              })}
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@domain.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <Button
                type="submit"
                className="w-full bg-blue-500 transition duration-300 delay-100 hover:bg-blue-600 dark:text-white"
              >
                Send Password Reset Code
              </Button>
            </form>
          </Form>
        </div>
      )}
      <div className="flex justify-center">
        <p className="text-slate-500 text-sm mt-6">
          Go back to{' '}
          <Link href="/login" className="text-blue-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
