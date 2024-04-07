'use client';

import * as z from 'zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { LoginSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { login } from '@/redux/user/userThunk';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/Forms/form-error';
import { FormSuccess } from '@/components/Forms/form-success';

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const { userId, status, accessToken } = useAppSelector((state) => state.user);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (status === 'idle') {
      setError('');
      setSuccess('');
    }

    if (status === 'loading') {
      setError('');
      setSuccess('');
    }

    if (status === 'succeeded') {
      setSuccess('Logged in successfully');
      accessToken && router.push('/home');
    }

    if (status === 'failed') {
      setSuccess('');
      setError('Invalid email or password');
      setTimeout(() => setError(''), 3000);
    }
  }, [status, accessToken, router, userId]);

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
