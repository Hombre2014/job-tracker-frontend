'use client';

import * as z from 'zod';
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
  errorMessage?: string;
  successMessage?: string;
}

const EditCompanyForm = ({
  schema,
  onClose,
  buttonText,
  errorMessage,
  successMessage,
}: EditCompanyFormProps) => {
  const dispatch = useAppDispatch();
  const { job_id } = useParams();

  const { jobPosts } = useAppSelector((state) => state.jobs);
  const currentJobPost = Array.isArray(jobPosts)
    ? jobPosts.find((jobPost) => jobPost.id === job_id)
    : null;

  const onSubmit = (data: z.infer<typeof EditCompanySchema>) => {
    const accessToken = localStorage.getItem('accessToken');
    dispatch(
      updateCompany({
        ...data,
        accessToken,
        companyId: currentJobPost?.company?.id,
      })
    );

    onClose();
  };

  const form = useForm<z.infer<typeof EditCompanySchema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: currentJobPost?.company?.url || '',
      name: currentJobPost?.company?.name || '',
      industry: currentJobPost?.company?.industry || '',
      description: currentJobPost?.company?.description || '',
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

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
              onClick={() => form.reset()}
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
