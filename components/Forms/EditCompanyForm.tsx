'use client';

import * as z from 'zod';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
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
import { validateDomain } from '@/services/brandfetchValidationService';
import { CompanySuggestion } from '@/services/companyAutocompleteService';
import { DomainValidationDialog } from '@/components/Dialogs/DomainValidationDialog';
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

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showDomainDialog, setShowDomainDialog] = useState(false);
  const [domainValidationData, setDomainValidationData] = useState<{
    domain: string;
    registeredName: string;
    logo?: string;
    type: 'name-mismatch' | 'domain-change';
    attemptedName?: string;
    formData: any;
  } | null>(null);

  const onSubmit = async (data: z.infer<typeof EditCompanySchema>) => {
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

    const originalDomain = normalizeUrl(initialData.url);
    const newDomain = normalizeUrl(formattedUrl);
    const nameChanged = data.name !== initialData.name;
    const domainChanged = newDomain !== originalDomain;
    // Hoisted utility: Normalize URLs for comparison to avoid false positives due to formatting
    function normalizeUrl(url?: string | null): string {
      if (!url) return '';
      try {
        return new URL(url.startsWith('http') ? url : `https://${url}`)
          .hostname;
      } catch {
        return url;
      }
    }

    // Validate domain changes
    if (domainChanged && newDomain) {
      try {
        const validation = await validateDomain(newDomain);
        if (!validation.exists) {
          toast.error(
            'Could not validate domain. Please try again or check your connection.',
          );
          return;
        }
        if (validation.name && validation.name !== data.name) {
          // Domain is registered to a different company
          setDomainValidationData({
            domain: newDomain,
            registeredName: validation.name,
            logo: validation.logo,
            type: 'domain-change',
            formData: formattedData,
          });
          setShowDomainDialog(true);
          return; // Stop submission, wait for user confirmation
        }
      } catch {
        toast.error(
          'Could not validate domain. Please try again or check your connection.',
        );
        return;
      }
    }

    // Check if name changed but domain stayed the same
    if (nameChanged && !domainChanged && originalDomain) {
      try {
        const validation = await validateDomain(originalDomain);
        if (!validation.exists) {
          toast.error(
            'Could not validate domain. Please try again or check your connection.',
          );
          return;
        }
        if (validation.name && validation.name !== data.name) {
          // Domain belongs to a different company name
          setDomainValidationData({
            domain: originalDomain,
            registeredName: validation.name,
            logo: validation.logo,
            type: 'name-mismatch',
            attemptedName: data.name,
            formData: formattedData,
          });
          setShowDomainDialog(true);
          return; // Stop submission, show warning
        }
      } catch {
        toast.error(
          'Could not validate domain. Please try again or check your connection.',
        );
        return;
      }
    }

    // Proceed with update
    await performUpdate(formattedData);
  };

  const performUpdate = async (formattedData: any) => {
    try {
      const result = await dispatch(
        updateCompany({
          ...formattedData,
          companyId: currentJobPost?.company?.id,
        }),
      ).unwrap();

      // Update localStorage to keep it in sync
      if (currentJobPost) {
        const updatedJobPost = {
          ...currentJobPost,
          company: {
            ...currentJobPost.company,
            ...result,
          },
        };
        localStorage.setItem('currentJobPost', JSON.stringify(updatedJobPost));
      }

      // Update succeeded - update local state and close
      updateCompanyInfo(result);
      onClose();
    } catch (error: any) {
      console.error('Failed to update company:', error);
      // Show error to user - don't update local state or close modal
      setSubmitError(
        error?.message || 'Failed to update company. Please try again.',
      );
    }
  };

  const handleDomainDialogAccept = async () => {
    if (domainValidationData) {
      // User accepted the dialog (domain-change or name-mismatch): revert name to registered
      const updatedData = {
        ...domainValidationData.formData,
        name: domainValidationData.registeredName,
      };
      await performUpdate(updatedData);
    }
    setShowDomainDialog(false);
    setDomainValidationData(null);
  };

  const handleDomainDialogCancel = () => {
    setShowDomainDialog(false);
    setDomainValidationData(null);
  };

  const handleCompanySelect = (company: CompanySuggestion) => {
    form.setValue('name', company.name);
    form.setValue('url', company.domain);
    // Reset logo to undefined so the dynamic high-quality version is used by default
    form.setValue('logo', undefined);
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
                    rows={5}
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

          <FormField
            name="logo"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Logo URL</FormLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-blue-500 hover:text-blue-600 p-0"
                    onClick={() => field.onChange(null)}
                  >
                    Reset to Automatic
                  </Button>
                </div>
                <div className="flex gap-4 items-start">
                  <FormControl>
                    <Input
                      placeholder="Custom Logo URL (Override)"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  {field.value && (
                    <div className="flex-shrink-0 w-10 h-10 border rounded overflow-hidden bg-white flex items-center justify-center">
                      <img
                        src={field.value}
                        alt="Logo preview"
                        className="max-w-full max-h-full object-contain"
                        onLoad={(e) =>
                          (e.currentTarget.style.display = 'block')
                        }
                        onError={(e) =>
                          (e.currentTarget.style.display = 'none')
                        }
                      />
                    </div>
                  )}
                </div>
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

      {domainValidationData && (
        <DomainValidationDialog
          open={showDomainDialog}
          onOpenChange={setShowDomainDialog}
          onAccept={handleDomainDialogAccept}
          onCancel={handleDomainDialogCancel}
          domain={domainValidationData.domain}
          registeredName={domainValidationData.registeredName}
          logo={domainValidationData.logo}
          type={domainValidationData.type}
          attemptedName={domainValidationData.attemptedName}
        />
      )}
    </div>
  );
};

export default EditCompanyForm;
