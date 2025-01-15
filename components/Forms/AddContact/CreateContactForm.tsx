import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoMdContact } from 'react-icons/io';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import EmailAndPhone from './EmailAndPhone';
import { AddContactSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import ContactSideBar from './ContactSideBar';
import CompaniesInput from './CompaniesInput';
import { getUser } from '@/redux/user/userThunk';
import SocialMediaLinks from './SocialMediaLinks';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllJobPostsPerColumn } from '@/redux/jobs/jobsThunk';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';

const CreateContactForm = ({
  onValidationChange,
}: {
  onValidationChange: (isValid: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const [comment, setComment] = useState('');
  const [boardId, setBoardId] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companies, setCompanies] = useState<string[]>([]);
  const [firstName, setFirstName] = useState('');
  const { job_id } = useParams<{ job_id: string }>();
  const user = useAppSelector((state) => state.user);
  const jobs = useAppSelector((state) => state.jobs);
  const [twitterHandle, setTwitterHandle] = useState('');
  const [gitHubProfile, setGitHubProfile] = useState('');
  const accessToken = localStorage.getItem('accessToken');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [facebookProfile, setFacebookProfile] = useState('');
  const selectedJob = jobs.jobPosts.find((job) => job.id === job_id);
  const [emails, setEmails] = useState<{ id: string; value: string }[]>([]);
  const [phones, setPhones] = useState<{ id: string; value: string }[]>([]);
  const selectedCompanyName = selectedJob?.company.name;

  const form = useForm({
    resolver: zodResolver(AddContactSchema),
    defaultValues: {
      emails: [],
      phones: [],
      comment: '',
      boardId: '',
      lastName: '',
      photoUrl: '',
      jobTitle: '',
      location: '',
      companies: [],
      firstName: '',
      socialMedia: [],
      twitterHandle: '',
      gitHubProfile: '',
      linkedinProfile: '',
      facebookProfile: '',
    },
  });

  useEffect(() => {
    if (accessToken) {
      dispatch(getUser(accessToken));
    }
  }, [dispatch, accessToken]);

  useEffect(() => {
    const jobPostsData = {
      accessToken: accessToken as string,
      columnId: localStorage.getItem('columnId'),
    };

    dispatch(getAllJobPostsPerColumn(jobPostsData));
  }, [dispatch, accessToken]);

  useEffect(() => {
    if (selectedCompanyName) {
      setCompanies([selectedCompanyName]);
    }
  }, [selectedCompanyName]);

  const watchLastName = form.watch('lastName');
  const watchFirstName = form.watch('firstName');

  useEffect(() => {
    const isValid = watchFirstName.length > 1 && watchLastName.length > 1;
    onValidationChange(isValid);
  }, [watchFirstName, watchLastName, onValidationChange]);

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

  const handleRemoveJob = (jobId: string) => {
    const updatedJobs = jobs.jobPosts.filter((job) => job.id !== jobId);
    dispatch(getAllJobPostsPerColumn({ accessToken, columnId: boardId }));
  };

  const handleRemoveContactType = (type: 'email' | 'phone', id: string) => {
    if (type === 'email') {
      setEmails(emails.filter((email) => email.id !== id));
    } else if (type === 'phone') {
      setPhones(phones.filter((phone) => phone.id !== id));
    }
  };

  const handleFieldChange = (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    switch (fieldName) {
      case 'twitterHandle':
        setTwitterHandle(value);
        break;
      case 'gitHubProfile':
        setGitHubProfile(value);
        break;
      case 'linkedinProfile':
        setLinkedinProfile(value);
        break;
      case 'facebookProfile':
        setFacebookProfile(value);
        break;
      case 'lastName':
        setLastName(value);
        form.setValue('lastName', value);
        break;
      case 'firstName':
        setFirstName(value);
        form.setValue('firstName', value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'jobTitle':
        setJobTitle(value);
        break;
      default:
        break;
    }
  };

  const handleAddEmail = () => {
    setEmails([...emails, { id: uuidv4(), value: '' }]);
  };

  const handleAddPhone = () => {
    setPhones([...phones, { id: uuidv4(), value: '' }]);
  };

  const handleEmailChange = (id: string, value: string) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) => (email.id === id ? { ...email, value } : email))
    );
  };

  const handlePhoneChange = (id: string, value: string) => {
    setPhones((prevPhones) =>
      prevPhones.map((phone) => (phone.id === id ? { ...phone, value } : phone))
    );
  };

  console.log('Emails: ', emails);
  console.log('Phones: ', phones);

  return (
    <div className="min-h-[660px]">
      <div className="flex gap-2">
        <div className="w-3/4">
          <Form {...form}>
            <form className="space-y-8 max-h-[660px] overflow-y-auto">
              <div className="pr-4">
                <div className="flex flex-row items-center justify-between gap-8 mb-8">
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
                      <FormItem className="!text-left w-full">
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
                          className="focus:border-blue-500"
                          onChange={(e) => handleFieldChange('firstName', e)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="lastName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="!text-left w-full">
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
                          className="focus:border-blue-500"
                          onChange={(e) => handleFieldChange('lastName', e)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="ml-2">
                  <FormField
                    name="jobTitle"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="!text-left">
                        <FormLabel className="text-gray-800 font-semibold">
                          Job Title
                        </FormLabel>
                        <Input
                          {...field}
                          value={jobTitle}
                          placeholder="i.e: CEO"
                          className="focus:border-blue-500"
                          onChange={(e) => handleFieldChange('jobTitle', e)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-between my-8 gap-8">
                    <FormField
                      name="companies"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="!text-left w-full">
                          <FormLabel className="text-gray-800 font-semibold">
                            Companies
                          </FormLabel>
                          <CompaniesInput
                            companies={companies}
                            setCompanies={setCompanies}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="location"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="!text-left w-full">
                          <FormLabel className="text-gray-800 font-semibold">
                            Location
                          </FormLabel>
                          <Input
                            {...field}
                            value={location}
                            placeholder="New York, NY, USA"
                            className="focus:border-blue-500"
                            onChange={(e) => handleFieldChange('location', e)}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    name="comment"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="!text-left">
                        <FormLabel className="text-gray-800 font-semibold">
                          Comment
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Any comment about the contact"
                            className="resize-none focus:border-blue-500"
                            onChange={(e) => {
                              field.onChange(e);
                              setComment(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center justify-between gap-8 my-8 mr-4 ml-2">
                <FormField
                  name="emails"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="!text-left w-full">
                      <FormLabel className="text-gray-800 font-semibold">
                        Emails
                      </FormLabel>
                      <div className="border rounded-md">
                        <div
                          className={cn(
                            'w-full first-of-type:mt-2',
                            emails.length === 0 && 'hidden'
                          )}
                        >
                          {emails.map((email) => (
                            <div key={email.id} className="mb-2">
                              <EmailAndPhone
                                id={email.id}
                                contact="email"
                                handleChange={handleEmailChange}
                                returnData={handleRemoveContactType}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex p-2">
                          <span
                            onClick={handleAddEmail}
                            className="text-sm text-blue-500 hover:cursor-pointer"
                          >
                            + add email
                          </span>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="phones"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="!text-left w-full">
                      <FormLabel className="text-gray-800 font-semibold">
                        Phones
                      </FormLabel>
                      <div className="border rounded-md">
                        <div
                          className={cn(
                            'w-full first-of-type:mt-2',
                            phones.length === 0 && 'hidden'
                          )}
                        >
                          {phones.map((phone) => (
                            <div key={phone.id} className="mb-2">
                              <EmailAndPhone
                                id={phone.id}
                                contact="phone"
                                handleChange={handlePhoneChange}
                                returnData={handleRemoveContactType}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex p-2">
                          <span
                            onClick={handleAddPhone}
                            className="text-sm text-blue-500 hover:cursor-pointer"
                          >
                            + add phone
                          </span>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SocialMediaLinks
                  twitterHandle={twitterHandle}
                  gitHubProfile={gitHubProfile}
                  linkedinProfile={linkedinProfile}
                  facebookProfile={facebookProfile}
                  handleFieldChange={handleFieldChange}
                />
              </div>
            </form>
          </Form>
        </div>
        <ContactSideBar
          user={user}
          jobs={jobs}
          job_id={job_id}
          handleRemoveJob={handleRemoveJob}
        />
      </div>
    </div>
  );
};

export default CreateContactForm;
