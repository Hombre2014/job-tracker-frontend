import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoMdContact } from 'react-icons/io';
import { BsThreeDots } from 'react-icons/bs';
import { zodResolver } from '@hookform/resolvers/zod';

import ComboJobsBox from './ComboJobsBox';
import { AddContactSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { getUser } from '@/redux/user/userThunk';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllJobPostsPerColumn } from '@/redux/jobs/jobsThunk';
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
  const { job_id } = useParams();
  const dispatch = useAppDispatch();
  const [comment, setComment] = useState('');
  const [boardId, setBoardId] = useState('');
  const [company, setCompany] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  const user = useAppSelector((state) => state.user);
  const jobs = useAppSelector((state) => state.jobs);
  const [twitterHandle, setTwitterHandle] = useState('');
  const [gitHubProfile, setGitHubProfile] = useState('');
  const accessToken = localStorage.getItem('accessToken');
  const [companyLocation, setCompanyLocation] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [facebookProfile, setFacebookProfile] = useState('');

  console.log('User:', user);

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

  console.log('Jobs in CreateContactForm:', jobs);

  const selectedJob = jobs.jobPosts.find((job) => job.id === job_id);
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
      twitterHandle: '',
      gitHubProfile: '',
      linkedinProfile: '',
      facebookProfile: '',
    },
  });

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

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
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

  const handleCompaniesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompany(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyLocation(e.target.value);
  };

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobTitle(e.target.value);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleEmailsChange = () => {
    setEmails([...emails, '']);
  };

  const handlePhonesChange = () => {
    setPhones([...phones, '']);
  };

  return (
    <div className="min-h-[660px]">
      <div className="flex gap-2">
        <div className="w-3/4 h-full">
          <Form {...form}>
            <form className="space-y-8">
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
                          onChange={(e) => handleLastNameChange(e)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                        onChange={(e) => handleJobTitleChange(e)}
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
                        <Input
                          {...field}
                          placeholder='i.e: "Google"'
                          value={selectedCompanyName ? selectedCompanyName : ''}
                          onChange={(e) => handleCompaniesChange(e)}
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
                          onChange={(e) => handleLocationChange(e)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center justify-between gap-8 my-8 mr-4">
                <FormField
                  name="emails"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="!text-left w-full">
                      <FormLabel className="text-gray-800 font-semibold">
                        Emails
                      </FormLabel>
                      <div className="flex border p-2 rounded-md">
                        <span
                          className="text-sm text-blue-500 hover:cursor-pointer"
                          onClick={handleEmailsChange}
                        >
                          + add email
                        </span>
                      </div>
                      {/* <Input
                        {...field}
                        onChange={(e) => handleEmailsChange(e)}
                      /> */}
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
                      <div className="flex border p-2 rounded-md">
                        <span
                          className="text-sm text-blue-500 hover:cursor-pointer"
                          onClick={handlePhonesChange}
                        >
                          + add phone
                        </span>
                      </div>
                      {/* <Input
                        {...field}
                        onChange={(e) => handlePhonesChange(e)}
                      /> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
        <div className="w-1/4 h-full flex-col">
          <p className="text-left mb-2 font-semibold text-muted-foreground">
            Linked to
          </p>
          <hr></hr>
          <p className="text-left font-semibold mt-6 mb-2">Jobs</p>
          {jobs.jobPosts.length > 0 ? (
            <div className="flex flex-col gap-2">
              {jobs.jobPosts.map(
                (jobPost) =>
                  jobPost.id === job_id && (
                    <div
                      key={jobPost.id}
                      className="flex flex-row justify-between items-center border border-gray-300 rounded-lg p-[5px]"
                    >
                      <p
                        className="text-left text-muted-foreground text-sm"
                        style={{ color: `${jobPost.color}` }}
                      >
                        {jobPost.title} @ {jobPost.company.name}
                      </p>
                      <div className="flex flex-row gap-2">
                        <button
                          type="button"
                          title="Remove"
                          className="text-left text-muted-foreground"
                          onClick={() => handleRemoveJob(jobPost.id)}
                        >
                          <BsThreeDots className="border border-gray-300 rounded-sm p-[2px] h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  )
              )}
            </div>
          ) : (
            <p className="text-left text-muted-foreground">No jobs</p>
          )}
          <div className="m-0 p-0 mt-2">
            <ComboJobsBox jobPosts={jobs.jobPosts} buttonWidth="w-full" />
          </div>
          <p className="text-left font-semibold mt-6 text-muted-foreground">
            Created by
          </p>
          <hr></hr>
          <div className="flex flex-col gap-2 border rounded-md p-2 mt-4">
            <div className="flex justify-start gap-2">
              <p className="text-left font-semibold">{user.firstName}</p>
              <p className="text-left font-semibold">{user.lastName}</p>
            </div>
            <p className="text-left text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContactForm;
