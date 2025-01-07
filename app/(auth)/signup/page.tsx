'use client';

import * as z from 'zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';

import client from '@/api/client';
import { RegisterSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import Loader from '@/components/Misc/Loader';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/Forms/form-error';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      lastName: '',
      firstName: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setError('');
    const { email, password, firstName, lastName, role = 'user' } = values;
    setLoading(true);
    startTransition(async () => {
      try {
        const res = await client.post('/users', {
          role,
          email,
          password,
          lastName,
          firstName,
        });

        if (res.status === 201) {
          form.reset();
          localStorage.setItem('user', JSON.stringify(res.data));
          router.push('/verify-email');
        }
      } catch (error: any) {
        const err = error.response.data.details;
        setError(err);
        setLoading(false);
        form.reset();
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    if (isPending) setLoading(true);
  }, [isPending]);

  return (
    <div>
      <h1 className="text-4xl font-semibold">Sign Up for Free</h1>
      <p className="text-slate-500 mt-2 mb-6">
        Track your job applications online!
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-between gap-4">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="John"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Doe"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              name="email"
              control={form.control}
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
              name="password"
              control={form.control}
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
          <p className="text-slate-500 text-sm">
            <span className="font-semibold">*At least:</span> 8 characters, 1
            number, 1 upper, 1 lower.
          </p>
          <FormError message={error} />
          {loading && <Loader title="Creating Account" />}
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-blue-500 transition duration-300 delay-100 hover:bg-blue-600 dark:text-white"
          >
            Create Account
          </Button>
        </form>
      </Form>
      <p className="text-slate-500 text-sm mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-500 font-semibold">
          Log in
        </Link>
      </p>
      <p className="text-slate-500 text-sm mt-6">
        By continuing, you agree to JobTracker&apos;s <br />
        <Link href="/terms" className="text-blue-500">
          Terms of Service
        </Link>
        and{' '}
        <Link href="/privacy" className="text-blue-500">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export default SignUp;
