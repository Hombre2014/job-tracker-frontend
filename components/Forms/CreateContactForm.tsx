import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AddContactSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Company from '../HomePage/Kanban/Column/JobPosts/JobModal/JobCompany/Company';

const CreateContactForm = ({
  onValidationChange,
}: {
  onValidationChange: (isValid: boolean) => void;
}) => {
  const form = useForm({
    resolver: zodResolver(AddContactSchema),
    defaultValues: {
      emails: [],
      phones: [],
      comment: '',
      boardId: '',
      company: '',
      lastName: '',
      firstName: '',
      twitterHandle: '',
      gitHubProfile: '',
      companyLocation: '',
      linkedinProfile: '',
      facebookProfile: '',
    },
  });

  return (
    <div className="flex gap-2">
      <div className="w-3/4 h-full">
        <Form {...form}>
          <form className="space-y-8"></form>
        </Form>
      </div>
      <div className="w-1/4 h-full"></div>
    </div>
  );
};

export default CreateContactForm;
