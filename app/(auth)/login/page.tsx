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
import { login, logout } from '@/redux/user/userThunk';
import { getBoards } from '@/redux/boards/boardsThunk';
import { FormError } from '@/components/Forms/form-error';
import { FormSuccess } from '@/components/Forms/form-success';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const { status } = useAppSelector((state) => state.user);
  const [error, setError] = useState<string | undefined>('');
  const { accessToken } = useAppSelector((state) => state.user);
  const [success, setSuccess] = useState<string | undefined>('');
  const { boards, boardsStatus } = useAppSelector((state) => state.boards);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'idle' || status === 'loading') {
      setError('');
      setSuccess('');
    }

    if (status === 'succeeded') {
      setSuccess('Logged in successfully');
      dispatch(getBoards(accessToken as string));
    }

    if (status === 'failed') {
      setError('Invalid email or password');
      const timeout = setTimeout(() => setError(''), 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [status, dispatch, accessToken]);

  useEffect(() => {
    if (boardsStatus === 'succeeded') {
      if (boards.length === 0) {
        setError('No boards found. Something is wrong!');
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
    dispatch(login({ email, password }));
    form.reset();
  };

  return (
    <div className="flex flex-col items-left justify-center h-full min-w-[330px] mx-4">
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
                      disabled={isPending}
                      type="email"
                      placeholder="john.doe@domain.com"
                      {...field}
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
                      disabled={isPending}
                      type="password"
                      placeholder="********"
                      {...field}
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
            disabled={isPending}
            type="submit"
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
  );
};

export default Login;
