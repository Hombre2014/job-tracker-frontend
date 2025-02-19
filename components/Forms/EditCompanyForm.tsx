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
  initialData: any;
  buttonText: string;
  onClose: () => void;
  errorMessage?: string;
  successMessage?: string;
  updateCompanyInfo: (data: any) => void; // Add the callback prop
}

const EditCompanyForm = ({
  schema,
  onClose,
  buttonText,
  initialData,
  errorMessage,
  successMessage,
  updateCompanyInfo, // Destructure the callback prop
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

  const { handleSubmit, reset } = form;

  useEffect(() => {
    reset(initialData); // Reset the form values whenever initialData changes
  }, [initialData, reset]);

  const onSubmit = async (data: z.infer<typeof EditCompanySchema>) => {
    const accessToken = localStorage.getItem('accessToken');
    const formattedUrl = data.url?.trim()
      ? data.url.startsWith('http')
        ? data.url
        : `https://${data.url.replace(/^(https?:\/\/)/, '')}`
      : '';

    const formattedData = {
      ...data,
      url: formattedUrl,
    };

    await dispatch(
      updateCompany({
        ...formattedData,
        accessToken,
        companyId: currentJobPost?.company?.id,
      })
    ).unwrap();

    updateCompanyInfo(formattedData);
    onClose();
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="name"
            control={form.control}
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
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={8}
                    {...field}
                    placeholder="Company Description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="industry"
            control={form.control}
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
            name="url"
            control={form.control}
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

          <div className="flex gap-4 items-center mt-4 pt-4">
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

          {successMessage && <FormSuccess message={successMessage} />}
          {errorMessage && <FormError message={errorMessage} />}
        </form>
      </Form>
    </div>
  );
};

export default EditCompanyForm;
