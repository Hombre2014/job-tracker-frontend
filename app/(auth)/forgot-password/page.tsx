'use client';

import * as z from 'zod';
import Link from 'next/link';

import { ForgotPasswordSchema } from '@/schemas';
import AuthForm from '@/components/Forms/auth-form';

const ForgotPassword: React.FC = () => {
  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    console.log(values);
  };

  return (
    <div className="flex flex-col items-left justify-center h-full min-w-[330px] mx-4">
      <h1 className="text-4xl font-semibold">Forgot Password</h1>
      <p className="text-slate-500 mt-2 mb-6">Enter your email</p>
      <AuthForm
        schema={ForgotPasswordSchema}
        onSubmit={onSubmit}
        buttonText="Send Password Reset Code"
        errorMessage=""
        successMessage=""
        passwordVisibility={false}
      />
      <p className="text-slate-500 text-sm mt-6">
        Go back to{' '}
        <Link href="/login" className="text-blue-500">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
