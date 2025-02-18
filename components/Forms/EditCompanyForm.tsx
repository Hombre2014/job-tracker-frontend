'use client';

import * as z from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { EditCompanySchema } from '@/schemas';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormError } from '@/components/Forms/form-error';
import { FormSuccess } from '@/components/Forms/form-success';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateCompany } from '@/redux/companies/companiesThunk';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

interface EditCompanyFormProps {
  schema: z.Schema;
  buttonText: string;
  onClose: () => void;
  updateCompanyInfo: (data: any) => void; // Add the callback prop
  initialData: any; // Add the initialData prop
  errorMessage?: string;
  successMessage?: string;
}

const EditCompanyForm = ({
  schema,
  onClose,
  buttonText,
  updateCompanyInfo, // Destructure the callback prop
  initialData, // Destructure the initialData prop
  errorMessage,
  successMessage,
}: EditCompanyFormProps) => {
  const dispatch = useAppDispatch();
  const { job_id } = useParams();

  const { jobPosts } = useAppSelector((state) => state.jobs);
  const currentJobPost = Array.isArray(jobPosts)
    ? jobPosts.find((jobPost) => jobPost.id === job_id)
    : null;

  const form = useForm<z.infer<typeof EditCompanySchema>>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    reset(initialData); // Reset the form values whenever initialData changes
  }, [initialData, reset]);

  const onSubmit = async (data: z.infer<typeof EditCompanySchema>) => {
    const accessToken = localStorage.getItem('accessToken');
    await dispatch(
      updateCompany({
        ...data,
        accessToken,
        companyId: currentJobPost?.company?.id,
      })
    ).unwrap();

    onClose();
    updateCompanyInfo(data); // Call the callback to update the company information in the parent component
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Company Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Company Description"
                    {...field}
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input placeholder="Company Industry" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="Company URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 items-center mt-4">
            <Button type="submit" variant="normal">
              {buttonText}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                form.reset(); // Reset the form first
                onClose(); // Then close the modal
              }}
            >
              Discard
            </Button>
          </div>

          {Object.keys(errors).length > 0 && (
            <FormError
              message={Object.values(errors)
                .map((error) => error?.message)
                .join(', ')}
            />
          )}
          {successMessage && <FormSuccess message={successMessage} />}
          {errorMessage && <FormError message={errorMessage} />}
        </form>
      </Form>
    </div>
  );
};

export default EditCompanyForm;
