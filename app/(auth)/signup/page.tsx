'use client';

import * as z from 'zod';
import Link from 'next/link';
// import axios from 'axios';

import { RegisterSchema } from '@/schemas';
import AuthForm from '@/components/Forms/auth-form';

const SignUp = () => {
  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    const { email, password, role = 'user' } = values;
    console.log({ email, password, role });

    // axios
    //   .post(
    //     'http://localhost:3000/users',
    //     { email, password, role },
    //     {
    //       headers: {
    //         'Access-Control-Allow-Origin': 'no-cors',
    //         'Content-Type': 'application/json',
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    const res = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'no-cors',
      },
      body: JSON.stringify({ email, password, role }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
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
