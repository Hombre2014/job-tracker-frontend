'use client';

import * as z from 'zod';
import Link from 'next/link';

import { RegisterSchema } from '@/schemas';
import AuthForm from '@/components/Forms/auth-form';

const SignUp = () => {
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    console.log(values);
  };

  return (
    <div>
      <h1 className="text-4xl font-semibold">Sign Up for Free</h1>
      <p className="text-slate-500 mt-2 mb-6">
        Track your job applications online!
      </p>
      <AuthForm
        schema={RegisterSchema}
        onSubmit={onSubmit}
        buttonText="Create Account"
        errorMessage=""
        successMessage=""
        noteTitle="*At least:"
        noteText="8 characters, 1 numbers, 1 upper, 1 lower"
      />
      <p className="text-slate-500 text-sm mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-500 font-semibold">
          Log in
        </Link>
      </p>
      <p className="text-slate-500 text-sm mt-6">
        By continuing, you agree to JobTracker&apos;s <br />
        <Link href="/terms" className="text-blue-500">
          Terms of Service{' '}
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
