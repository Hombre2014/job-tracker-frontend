'use client';

import * as z from 'zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { LoginSchema } from '@/schemas';
import Loader from '@/components/Misc/Loader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cleanupAfterLogout } from '@/utils/helpers';
import { getBoards } from '@/redux/boards/boardsThunk';
import { login, logout } from '@/redux/user/userSlice';
import { FormError } from '@/components/Forms/form-error';
import { FormSuccess } from '@/components/Forms/form-success';
import { WeakPasswordModal } from '@/components/auth/ForcePasswordChangeModal';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const [userEmail, setUserEmail] = useState<string>('');
  const { status } = useAppSelector((state) => state.user);
  const [error, setError] = useState<string | undefined>('');
  const { accessToken } = useAppSelector((state) => state.user);
  const [success, setSuccess] = useState<string | undefined>('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    'strong' | 'weak' | null
  >(null);
  const { boards, boardsStatus } = useAppSelector((state) => state.boards);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    // Ensure clean state when visiting login page
    cleanupAfterLogout();
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'idle' || status === 'loading') {
      setError('');
      setSuccess('');
    }

    if (status === 'succeeded') {
      setSuccess('Logged in successfully');

      // Wait for passwordStrength to be determined before taking action
      // This prevents race condition where status updates before passwordStrength is set
      if (passwordStrength === null) {
        // Still waiting for password strength from onSubmit
        return;
      } else if (passwordStrength === 'weak') {
        // Password is weak, show modal
        setShowPasswordModal(true);
      } else if (passwordStrength === 'strong') {
        // Password is strong or already updated, continue normally
        dispatch(getBoards(accessToken as string));
      }
    }

    if (status === 'failed') {
      setError('Invalid email or password');
      const timeout = setTimeout(() => setError(''), 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [status, dispatch, accessToken, passwordStrength]);

  useEffect(() => {
    if (boardsStatus === 'succeeded') {
      if (boards.length === 0) {
        router.push('/home/boards');
      } else
        boards.length === 1
          ? router.push(`/home/boards/${boards[0].id}/board`)
          : router.push('/home/boards');
    }
  }, [boardsStatus, boards, router]);

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      setError('');
      setSuccess('');
    });

    const { email, password } = values;
    setUserEmail(email);

    // Dispatch login and get result with password strength from backend
    const result = await dispatch(login({ email, password }));

    // Extract password strength from backend response
    if (
      result.payload &&
      typeof result.payload === 'object' &&
      'data' in result.payload
    ) {
      const payload = result.payload as {
        data: { passwordStrength?: 'strong' | 'weak' };
      };
      if (payload.data?.passwordStrength) {
        setPasswordStrength(payload.data.passwordStrength);
      }
    }

    form.reset();
  };
  return (
    <>
      <WeakPasswordModal isOpen={showPasswordModal} email={userEmail} />
      <div className="flex flex-col items-start justify-center h-full min-w-[330px] mx-4">
        <h1 className="text-4xl font-semibold">Log in</h1>
        <p className="text-slate-500 mt-2 mb-6">Log into your account</p>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled={isPending}
                        placeholder="john.doe@domain.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        disabled={isPending}
                        placeholder="********"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            {success !== '' && <Loader title="Loading user's data..." />}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-500 transition duration-300 delay-100 hover:bg-blue-600 dark:text-white"
            >
              Log in
            </Button>
          </form>
        </Form>
        <p className="text-slate-500 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-500 font-semibold">
            Sign up
          </Link>
        </p>
        <p className="text-slate-500 text-sm mt-2">
          <Link href="/forgot-password" className="text-blue-500">
            Forgot your password?
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
