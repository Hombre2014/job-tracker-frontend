'use client';

import * as z from 'zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, startTransition } from 'react';

import client from '@/api/client';
import { VerifyEmailSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

const VerifyEmail = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const form = useForm<z.infer<typeof VerifyEmailSchema>>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      code: '',
    },
  });

  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(user);
  }, []);

  const onSubmit = async (values: z.infer<typeof VerifyEmailSchema>) => {
    setError('');
    const { code } = values;
    const email = user.email;

    if (!code || !email) {
      console.log('Code or email is missing');
      setError('Code or email is missing');
      return;
    }

    startTransition(async () => {
      try {
        const res = await client.post('/users/verification/verify-email-code', {
          code,
          email,
        });

        if (res.status === 201) {
          form.reset();
          setSuccess('Code verification successful');
          router.push('/login');
        }
      } catch (error: any) {
        const err = error.response.data.errorCode;
        setError(err);
        form.reset();
        setTimeout(() => setError(''), 2000);
        router.push('/verify-email');
      }
    });
  };

  const handleResend = async () => {
    try {
      const res = await client.post(
        '/users/verification/create-email-verification-code',
        {
          email: user.email,
        }
      );

      if (res.status === 201) {
        setSuccess('Code resent successfully');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (error: any) {
      const err = error.response.data.errorCode;
      setError(err);
      setTimeout(() => setError(''), 2000);
    }
    console.log('Resend');
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-y-10 mx-4">
      <div className="flex flex-col items-left h-full md:min-w-[330px] mx-4">
        <h1 className="text-4xl font-semibold">Verify Email</h1>
        <p className="text-slate-500 mt-2 mb-6">
          Enter the code sent to {user.email}
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
              type="submit"
              className="w-full bg-blue-500 transition duration-300 delay-100 hover:bg-blue-600 dark:text-white"
            >
              Verify Email
            </Button>
          </form>
        </Form>
        <div className="text-slate-500 text-sm mt-4 w-full flex justify-center">
          <Link
            onClick={handleResend}
            href="/verify-email"
            className="text-blue-500 mx-auto text-sm underline"
          >
            or create new and resend code
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-left h-full w-[280px] mx-4 border bg-slate-50 p-4 rounded-md dark:bg-slate-800 dark:border-slate-500">
        <p className="font-semibold mt-2">Didn&apos;t receive the email?</p>
        <p className="mt-4">
          Is <span className="font-semibold underline">{user.email}</span> the
          correct email address? If not,{' '}
          <Link href="/signup" className="text-blue-500 cursor-pointer">
            {' '}
            restart your signup
          </Link>
          .
        </p>
        <p className="mt-4">
          It may take up to 10 minutes to receive the email
        </p>
        <p className="mt-4">Check your spam</p>
        <p className="mt-4">
          Create new and resend code by clicking{' '}
          <span onClick={handleResend} className="text-blue-500 cursor-pointer">
            here
          </span>
        </p>
        <hr className="mt-6 dark:border-slate-500" />
        <p className="mt-4 text-sm">
          If you haven&apos;t received the verification email after multiple
          tries,{' '}
          <Link className="text-blue-500" href={'/contact'}>
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
