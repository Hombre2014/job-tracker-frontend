'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { RegisterSchema } from '@/schemas';
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

const SignUp = () => {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    const { email, password, role = 'user' } = values;

    const res = await axios
      .post(
        'http://localhost:3000/users',
        { email, password, role },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        return res;
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
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
                    <Input type="password" placeholder="********" {...field} />
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
          <FormError message="" />
          <FormSuccess message="" />
          <Button
            type="submit"
            className="w-full bg-blue-500 transition duration-300 delay-100 hover:bg-blue-600"
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
