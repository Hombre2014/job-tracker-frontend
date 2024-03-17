'use client';

import * as z from 'zod';
import client from '@/api/client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoginSchema } from '@/schemas';
import { Input } from '@/components/ui/input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/Forms/form-error';
import { FormSuccess } from '@/components/Forms/form-success';
import Link from 'next/link';

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');

    const { email, password } = values;
    startTransition(async () => {
      const res = await client.post('/auth/login', {
        email,
        password,
      });
      if (res.status === 200) {
        form.reset();
        localStorage.setItem('userTokens', JSON.stringify(res.data));
        router.push('/home');
        setSuccess(res.data.message);
      } else {
        console.log('Error Response: ', res.statusText);
        form.reset();
        setError(res.data.message);
      }
    });
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
