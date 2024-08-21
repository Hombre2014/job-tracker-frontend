'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoginSchema } from '@/schemas';
import { RegisterSchema } from '@/schemas';
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

interface AuthFormProps {
  schema: z.Schema;
  onSubmit: (
    data: z.infer<typeof LoginSchema> | z.infer<typeof RegisterSchema>
  ) => void;
  buttonText: string;
  errorMessage?: string;
  successMessage?: string;
  noteTitle?: string;
  noteText?: string;
  passwordVisibility?: boolean;
  label: string;
  placeholder: string;
  type: string;
}

const AuthForm = ({
  schema,
  onSubmit,
  buttonText,
  errorMessage,
  successMessage,
  noteTitle,
  noteText,
  passwordVisibility = true,
  label,
  placeholder,
  type,
}: AuthFormProps) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input type={type} placeholder={placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {passwordVisibility && (
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
          )}
        </div>
        <p className="text-slate-500 text-sm">
          <span className="font-semibold">{noteTitle}</span> {noteText}
        </p>
        <FormError message={errorMessage} />
        <FormSuccess message={successMessage} />
        <Button
          type="submit"
          className="w-full bg-blue-500 transition duration-300 delay-100 hover:bg-blue-600"
        >
          {buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;
