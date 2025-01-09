import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoMdContact } from 'react-icons/io';
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

const CreateContactForm = ({
  onValidationChange,
}: {
  onValidationChange: (isValid: boolean) => void;
}) => {
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [comment, setComment] = useState('');
  const [boardId, setBoardId] = useState('');
  const [company, setCompany] = useState('');
  const [lastName, setLastName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [firstName, setFirstName] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [gitHubProfile, setGitHubProfile] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [facebookProfile, setFacebookProfile] = useState('');

  const form = useForm({
    resolver: zodResolver(AddContactSchema),
    defaultValues: {
      emails: [],
      phones: [],
      comment: '',
      boardId: '',
      company: '',
      lastName: '',
      photoUrl: '',
      firstName: '',
      twitterHandle: '',
      gitHubProfile: '',
      companyLocation: '',
      linkedinProfile: '',
      facebookProfile: '',
    },
  });

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompany(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTwitterHandleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTwitterHandle(e.target.value);
  };

  const handleGitHubProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGitHubProfile(e.target.value);
  };

  const handleCompanyLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCompanyLocation(e.target.value);
  };

  const handleLinkedInProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLinkedinProfile(e.target.value);
  };

  const handleFacebookProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFacebookProfile(e.target.value);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmails([...emails, e.target.value]);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhones([...phones, e.target.value]);
  };

  console.log('PhotoUrl: ', photoUrl);

  return (
    <div className="min-h-[660px]">
      <div className="flex gap-2">
        <div className="w-3/4 h-full">
          <Form {...form}>
            <form className="space-y-8">
              <div className="flex flex-row items-center gap-4">
                <FormField
                  name="photoUrl"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="file-input">
                        {photoUrl === '' ? (
                          <IoMdContact size={50} className="cursor-pointer" />
                        ) : (
                          <Image
                            width={50}
                            height={50}
                            src={photoUrl}
                            alt="User profile picture"
                            className="cursor-pointer rounded-lg"
                          />
                        )}
                        <input
                          {...field}
                          type="file"
                          id="file-input"
                          accept="image/*"
                          name="file-input"
                          title="file-input"
                          onChange={handleFileInput}
                          className="file-input file-input-ghost max-w-xs opacity-0 absolute top-[100px] h-[62px] w-[50px]"
                        />
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  name="firstName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="!text-left">
                      <span className="flex justify-between">
                        <FormLabel className="text-gray-800 font-semibold">
                          First Name
                        </FormLabel>
                        <FormLabel className="text-gray-400">
                          Required
                        </FormLabel>
                      </span>
                      <Input
                        {...field}
                        value={firstName}
                        placeholder="First Name"
                        onChange={(e) => handleFirstNameChange(e)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="lastName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="!text-left">
                      <span className="flex justify-between">
                        <FormLabel className="text-gray-800 font-semibold">
                          Last Name
                        </FormLabel>
                        <FormLabel className="text-gray-400">
                          Required
                        </FormLabel>
                      </span>
                      <Input
                        {...field}
                        value={lastName}
                        placeholder="Last Name"
                        onChange={(e) => handleLastNameChange(e)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
        <div className="w-1/4 h-full"></div>
      </div>
    </div>
  );
};

export default CreateContactForm;
