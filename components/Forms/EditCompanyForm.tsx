'use client';

import * as z from 'zod';
import { useEffect, useState } from 'react';
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
import { CompanyAutocomplete } from '@/components/CompanyAutocomplete';
import { CompanySuggestion } from '@/services/companyAutocompleteService';
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

  const getAccessToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof EditCompanySchema>) => {
    const accessToken = getAccessToken();
    setSubmitError(null); // Clear previous error at start
    
    const formattedUrl = data.url?.trim()
      ? data.url.startsWith('http')
        ? data.url
        : `https://${data.url.replace(/^(https?:\/\/)/, '')}`
      : '';

    const formattedData = {
      ...data,
      url: formattedUrl,
    };

    try {
      await dispatch(
        updateCompany({
          ...formattedData,
          accessToken,
          companyId: currentJobPost?.company?.id,
        }),
      ).unwrap();

      // Update succeeded - update local state and close
      updateCompanyInfo(formattedData);
      onClose();
    } catch (error: any) {
      console.error('Failed to update company:', error);
      // Show error to user - don't update local state or close modal
      setSubmitError(
        error?.message || 'Failed to update company. Please try again.',
      );
    }
  };

  const handleCompanySelect = (company: CompanySuggestion) => {
    form.setValue('name', company.name);
    form.setValue('url', company.domain);
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
                  <CompanyAutocomplete
                    value={field.value}
                    onChange={field.onChange}
                    onCompanySelect={handleCompanySelect}
                    placeholder="Search for a company..."
                  />
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
          {(errorMessage || submitError) && (
            <FormError message={submitError || errorMessage} />
          )}
        </form>
      </Form>
    </div>
  );
};

export default EditCompanyForm;
