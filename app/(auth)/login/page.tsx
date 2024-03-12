'use client';

import * as z from 'zod';
import Link from 'next/link';

import { LoginSchema } from '@/schemas';
import AuthForm from '@/components/Forms/auth-form';

const Login = () => {
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log(values);
  };

  return (
    <div className="flex flex-col items-left justify-center h-full min-w-[330px] mx-4">
      <h1 className="text-4xl font-semibold">Log in</h1>
      <p className="text-slate-500 mt-2 mb-6">Log into your account</p>
      <AuthForm
        schema={LoginSchema}
        onSubmit={onSubmit}
        buttonText="Log in"
        errorMessage=""
        successMessage=""
      />
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
