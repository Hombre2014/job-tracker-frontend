import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoMdClose, IoMdContact } from 'react-icons/io';
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
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [comment, setComment] = useState('');
  const [boardId, setBoardId] = useState('');
  const [company, setCompany] = useState('');
  const [lastName, setLastName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [firstName, setFirstName] = useState('');
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

  const handleRemoveJob = (jobId: string) => {
    const updatedJobs = jobs.jobPosts.filter((job) => job.id !== jobId);
    dispatch(getAllJobPostsPerColumn({ accessToken, columnId: boardId }));
  };

  return (
    <div className="min-h-[660px]">
      <div className="flex gap-2">
        <div className="w-3/4 h-full">
          <Form {...form}>
            <form className="space-y-8">
              <div className="flex flex-row items-center justify-between gap-4 pr-8">
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
                      className="flex flex-row justify-between items-center"
                    >
                      <p className="text-left text-muted-foreground">
                        {jobPost.title} - {jobPost.company.name}
                      </p>
                      <div className="flex flex-row gap-2">
                        <button
                          title="Remove"
                          className="text-left text-muted-foreground"
                          onClick={() => handleRemoveJob(jobPost.id)}
                        >
                          <IoMdClose size={20} />
                        </button>
                      </div>
                    </div>
                  )
              )}
            </div>
          ) : (
            <p className="text-left text-muted-foreground">No jobs</p>
          )}
          <div>
            <ComboJobsBox jobPosts={jobs.jobPosts} />
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
