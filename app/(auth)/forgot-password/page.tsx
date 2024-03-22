'use client';

import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { ForgotPasswordSchema, ResetPasswordSchema } from '@/schemas';
import { FormError } from '@/components/Forms/form-error';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RiQuestionMark } from 'react-icons/ri';

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>('');
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const newForm = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      code: '',
      newPassword: '',
    },
  });

  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    const { email } = values;
    console.log('Email: ', email);
    setButtonClicked(true);
  };

  const resetPassword = async (values: z.infer<typeof ResetPasswordSchema>) => {
    setError('');
    const { code, newPassword } = values;
    console.log('Code: ', code);
    console.log('Password: ', newPassword);

    if (code.length !== 6) {
      setError('Invalid code');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // TODO: Implement reset password

    setButtonClicked(false);
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-left justify-center h-full min-w-[330px] mx-4">
      <h1 className="text-4xl font-semibold">Forgot Password</h1>
      {buttonClicked && (
        <Form {...newForm}>
          <form
            onSubmit={newForm.handleSubmit(resetPassword)}
            className="space-y-6"
          >
            <div className="space-y-4 mt-6">
              <FormField
                control={newForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Reset Password Code</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <RiQuestionMark className="h-4 w-4 border rounded-md p-[1px] mr-1 dark:border-slate-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter the 6 digit code sent to your email.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input
                        // disabled={isPending}
                        type="text"
                        placeholder="Enter 6 digit code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        // disabled={isPending}
                        type="password"
                        placeholder="Your new password"
                        {...field}
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
            <Button
              // disabled={isPending}
              type="submit"
              className="w-full bg-blue-500 transition duration-300 delay-100 hover:bg-blue-600 dark:text-white"
            >
              Reset Password
            </Button>
          </form>
        </Form>
      )}
      {!buttonClicked && (
        <div>
          <p className="text-slate-500 mt-2 mb-6">Enter your email</p>
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
                          type="email"
                          placeholder="john.doe@domain.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 transition duration-300 delay-100 hover:bg-blue-600 dark:text-white"
              >
                Send Password Reset Code
              </Button>
            </form>
          </Form>
        </div>
      )}
      <div className="flex justify-center">
        <p className="text-slate-500 text-sm mt-6">
          Go back to{' '}
          <Link href="/login" className="text-blue-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
