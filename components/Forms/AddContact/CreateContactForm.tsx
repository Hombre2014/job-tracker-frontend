import Image from 'next/image';
import { debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { IoMdContact } from 'react-icons/io';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';

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
import { getBoardsOnly, getBoardWithColumns } from '@/redux/boards/boardsThunk';
import {
  createCompany,
  getCompanyThatStartsWith,
} from '@/redux/companies/companiesThunk';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';

interface CreateContactFormProps {
  isEditMode?: boolean;
  defaultJobPost: boolean;
  isUserContactsPage?: boolean;
  onValidationChange: (isValid: boolean) => void;
}

const CreateContactForm = ({
  isEditMode,
  defaultJobPost,
  onValidationChange,
  isUserContactsPage,
}: CreateContactFormProps) => {
  const dispatch = useAppDispatch();
  const [comment, setComment] = useState('');
  const [location, setLocation] = useState('');
  const [lastName, setLastName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const { job_id } = useParams<{ job_id: string }>();
  const user = useAppSelector((state) => state.user);
  const jobs = useAppSelector((state) => state.jobs);
  const [facebookUrl, setFacebookUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const { board_id } = useParams<{ board_id: string }>();
  const accessToken = localStorage.getItem('accessToken');
  const [showDropdown, setShowDropdown] = useState(false);
  const [companies, setCompanies] = useState<string[]>([]);
  const [companyIds, setCompanyIds] = useState<string[]>([]);
  const [currentCompanyInput, setCurrentCompanyInput] = useState('');
  const selectedJob = jobs.jobPosts.find((job) => job.id === job_id);
  const [allJobPosts, setAllJobPosts] = useState<JobApplication[]>([]);
  const [matchingCompanies, setMatchingCompanies] = useState<string[]>([]);
  const [emails, setEmails] = useState<
    { id: string; value: string; type: string }[]
  >([]);
  const [phones, setPhones] = useState<
    { id: string; value: string; type: string }[]
  >([]);
  const selectedCompanyName = selectedJob?.company.name;

  useEffect(() => {
    // If in edit mode and we have firstName and lastName values, consider the form valid
    if (isEditMode && firstName.length > 1 && lastName.length > 1) {
      onValidationChange(true);
      console.log('Form set to valid in edit mode');
    }
  }, [isEditMode, firstName, lastName, onValidationChange]);

  useEffect(() => {
    // Check if we're in edit mode (contactId exists in localStorage)
    const contactId = localStorage.getItem('contactId');
    if (contactId) {
      console.log('In edit mode, loading data from localStorage');

      // Load companies and companyIds from localStorage
      const storedCompanies = localStorage.getItem('companies');
      const storedCompanyIds = localStorage.getItem('companyIds');

      console.log('Stored companies:', storedCompanies);
      console.log('Stored companyIds:', storedCompanyIds);

      if (storedCompanies) {
        try {
          const parsedCompanies = JSON.parse(storedCompanies);
          console.log('Parsed companies:', parsedCompanies);
          setCompanies(parsedCompanies);
        } catch (e) {
          console.error('Error parsing companies from localStorage:', e);
        }
      }

      if (storedCompanyIds) {
        try {
          const parsedCompanyIds = JSON.parse(storedCompanyIds);
          console.log('Parsed companyIds:', parsedCompanyIds);
          setCompanyIds(parsedCompanyIds);
        } catch (e) {
          console.error('Error parsing companyIds from localStorage:', e);
        }
      }

      // Load other fields as needed
      setComment(localStorage.getItem('comment') || '');
      setJobTitle(localStorage.getItem('jobTitle') || '');
      setLocation(localStorage.getItem('location') || '');

      // Load firstName and lastName both for form control AND state variables
      const storedFirstName = localStorage.getItem('firstName') || '';
      const storedLastName = localStorage.getItem('lastName') || '';

      // Set state variables
      setFirstName(storedFirstName);
      setLastName(storedLastName);

      // Set form control values
      form.setValue('firstName', storedFirstName);
      form.setValue('lastName', storedLastName);

      // Manually trigger validation if values are valid
      if (storedFirstName.length > 1 && storedLastName.length > 1) {
        onValidationChange(true);
      }

      // Load photo URL if available
      const storedPhotoUrl = localStorage.getItem('photoUrl');
      if (storedPhotoUrl && storedPhotoUrl !== 'null') {
        setPhotoUrl(storedPhotoUrl);
      }

      // Load social media links
      setGithubUrl(localStorage.getItem('githubUrl') || '');
      setTwitterUrl(localStorage.getItem('twitterUrl') || '');
      setLinkedinUrl(localStorage.getItem('linkedinUrl') || '');
      setFacebookUrl(localStorage.getItem('facebookUrl') || '');

      // Load emails and phones if needed
      // Load emails
      const storedEmails = localStorage.getItem('emails');
      if (storedEmails) {
        try {
          const parsedEmails = JSON.parse(storedEmails);
          console.log('Parsed emails:', parsedEmails);

          // Convert the format from API format to component format
          // API format: [{email: "example@example.com", type: "WORK"}]
          // Component format: [{id: "uuid", value: "example@example.com", type: "WORK"}]
          if (parsedEmails.length > 0) {
            const formattedEmails = parsedEmails.map((emailObj: any) => ({
              id: uuidv4(),
              value: emailObj.email || '',
              type: emailObj.type || 'WORK',
            }));

            console.log('Formatted emails for component:', formattedEmails);
            setEmails(formattedEmails);
          }
        } catch (e) {
          console.error('Error parsing emails from localStorage:', e);
        }
      }

      // Load phones
      const storedPhones = localStorage.getItem('phones');
      if (storedPhones) {
        try {
          const parsedPhones = JSON.parse(storedPhones);
          console.log('Parsed phones:', parsedPhones);

          // Convert the format from API format to component format
          // API format: [{phone: "1234567890", type: "WORK"}]
          // Component format: [{id: "uuid", value: "1234567890", type: "WORK"}]
          if (parsedPhones.length > 0) {
            const formattedPhones = parsedPhones.map((phoneObj: any) => ({
              id: uuidv4(),
              value: phoneObj.phone || '',
              type: phoneObj.type || 'WORK',
            }));

            console.log('Formatted phones for component:', formattedPhones);
            setPhones(formattedPhones);
          }
        } catch (e) {
          console.error('Error parsing phones from localStorage:', e);
        }
      }
    }
  }, []);

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
      githubUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
      facebookUrl: '',
    },
  });

  useEffect(() => {
    if (accessToken) {
      dispatch(getUser(accessToken));
    }
  }, [dispatch, accessToken]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (defaultJobPost) {
          // Case 1: From Job Post Modal - fetch jobs for specific column
          const jobPostsData = {
            accessToken: accessToken as string,
            columnId: localStorage.getItem('columnId'),
          };
          const result = await dispatch(
            getAllJobPostsPerColumn(jobPostsData)
          ).unwrap();
          setAllJobPosts(result);
        } else if (isUserContactsPage) {
          // Case 3: From User's Contacts page - fetch jobs from all boards
          const boardsResponse = await dispatch(
            getBoardsOnly(accessToken as string)
          ).unwrap();

          const jobsPromises = boardsResponse.flatMap(async (board: Board) => {
            const boardData = await dispatch(
              getBoardWithColumns({
                accessToken,
                boardId: board.id,
              })
            ).unwrap();

            const columnPromises = boardData.columns.map((column: Column) =>
              dispatch(
                getAllJobPostsPerColumn({
                  accessToken,
                  columnId: column.id,
                })
              ).unwrap()
            );

            const columnJobs = await Promise.all(columnPromises);
            return columnJobs.flat();
          });

          const allJobsArrays = await Promise.all(jobsPromises);
          const uniqueJobs = Array.from(
            new Map(allJobsArrays.flat().map((job) => [job.id, job])).values()
          );

          setAllJobPosts(uniqueJobs);
        } else {
          // Case 2: From Board's Contacts page - fetch jobs from current board
          const boardData = await dispatch(
            getBoardWithColumns({
              accessToken,
              boardId: board_id,
            })
          ).unwrap();

          const jobsPromises = boardData.columns.map((column: Column) =>
            dispatch(
              getAllJobPostsPerColumn({
                accessToken,
                columnId: column.id,
              })
            ).unwrap()
          );

          const jobsArrays = await Promise.all(jobsPromises);
          const uniqueJobs = Array.from(
            new Map(jobsArrays.flat().map((job) => [job.id, job])).values()
          );

          setAllJobPosts(uniqueJobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, [dispatch, accessToken, defaultJobPost, board_id, isUserContactsPage]);

  useEffect(() => {
    // Only set companies from selectedCompanyName if we're not in edit mode
    const contactId = localStorage.getItem('contactId');
    if (selectedCompanyName && !contactId) {
      setCompanies([selectedCompanyName]);
      localStorage.setItem('companies', JSON.stringify([selectedCompanyName]));
    }
  }, [selectedCompanyName]);

  useEffect(() => {
    if (selectedCompanyName && selectedJob?.company.id) {
      setCompanyIds([selectedJob.company.id]);
      localStorage.setItem(
        'companyIds',
        JSON.stringify([selectedJob.company.id])
      );
    }
  }, [selectedCompanyName, selectedJob]);

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
        // TODO: Implement image upload to the server and save the URL to the local storage
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveContactType = (type: 'email' | 'phone', id: string) => {
    if (type === 'email') {
      setEmails(emails.filter((email) => email.id !== id));
      localStorage.setItem(
        'emails',
        JSON.stringify(emails.filter((email) => email.id !== id))
      );
    } else if (type === 'phone') {
      setPhones(phones.filter((phone) => phone.id !== id));
      localStorage.setItem(
        'phones',
        JSON.stringify(phones.filter((phone) => phone.id !== id))
      );
    }
  };

  const handleFieldChange = (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    switch (fieldName) {
      case 'twitterUrl':
        setTwitterUrl(value);
        localStorage.setItem('twitterUrl', `https://twitter.com/${value}`);
        break;
      case 'githubUrl':
        setGithubUrl(value);
        localStorage.setItem('githubUrl', `https://github.com/${value}`);
        break;
      case 'linkedinUrl':
        setLinkedinUrl(value);
        localStorage.setItem('linkedinUrl', `https://linkedin.com/in/${value}`);
        break;
      case 'facebookUrl':
        setFacebookUrl(value);
        localStorage.setItem('facebookUrl', `https://facebook.com/${value}`);
        break;
      case 'lastName':
        setLastName(value as string);
        form.setValue('lastName', value, { shouldValidate: true });
        localStorage.setItem('lastName', value);
        break;
      case 'firstName':
        setFirstName(value as string);
        form.setValue('firstName', value, { shouldValidate: true });
        localStorage.setItem('firstName', value);
        break;
      case 'location':
        setLocation(value);
        localStorage.setItem('location', value);
        break;
      case 'jobTitle':
        setJobTitle(value);
        localStorage.setItem('jobTitle', value);
        break;
      case 'comment':
        setComment(value);
        localStorage.setItem('comment', value);
        break;
      default:
        break;
    }
  };

  const handleAddEmail = () => {
    setEmails([...emails, { id: uuidv4(), value: '', type: 'WORK' }]);
  };

  const handleAddPhone = () => {
    setPhones([...phones, { id: uuidv4(), value: '', type: 'WORK' }]);
  };

  const handleEmailChange = (id: string, value: string, type: string) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, value, type } : email
      )
    );

    // Format emails for localStorage and API
    const emailsToSave = emails
      .map(({ value, type }) => {
        if (value === '') return null; // Skip empty emails
        return { email: value, type };
      })
      .filter(Boolean); // Remove null entries

    localStorage.setItem('emails', JSON.stringify(emailsToSave));
  };

  const handlePhoneChange = (id: string, value: string, type: string) => {
    setPhones((prevPhones) =>
      prevPhones.map((phone) =>
        phone.id === id ? { ...phone, value, type } : phone
      )
    );

    // Format phones for localStorage and API
    const phonesToSave = phones
      .map(({ value, type }) => {
        if (value === '') return null; // Skip empty phones
        return { phone: value, type };
      })
      .filter(Boolean); // Remove null entries

    localStorage.setItem('phones', JSON.stringify(phonesToSave));
  };

  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      const debounced = debounce((searchTerm: string) => {
        if (searchTerm.length >= 2) {
          const values = {
            accessToken,
            companyName: searchTerm,
          };
          dispatch(getCompanyThatStartsWith(values))
            .unwrap()
            .then((result) => {
              const companyNames: string[] = result.map(
                (company: { name: string }) => company.name
              );
              setMatchingCompanies(companyNames);
              setShowDropdown(true);
            })
            .catch((error) => {
              console.error('Search error:', error);
              setMatchingCompanies([]);
              setShowDropdown(false);
            });
        } else {
          setMatchingCompanies([]);
          setShowDropdown(false);
        }
      }, 300);
      return debounced(searchTerm);
    },
    [dispatch, accessToken, setMatchingCompanies, setShowDropdown]
  );

  const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentCompanyInput(value);
    debouncedSearch(value);
  };

  const handleCompanySelect = async (selectedCompany: string) => {
    const values = {
      accessToken,
      companyName: selectedCompany,
    };

    const result = await dispatch(getCompanyThatStartsWith(values)).unwrap();
    const existingCompany = result.find(
      (comp: any) => comp.name === selectedCompany
    );

    if (existingCompany) {
      const newCompanies = [...companies, selectedCompany];
      const newCompanyIds = [...companyIds, existingCompany.id];
      setCompanies(newCompanies);
      setCompanyIds(newCompanyIds);
      localStorage.setItem('companies', JSON.stringify(newCompanies));
      localStorage.setItem('companyIds', JSON.stringify(newCompanyIds));
    }

    setCurrentCompanyInput('');
    setShowDropdown(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentCompanyInput.trim()) {
      e.preventDefault();

      if (matchingCompanies.includes(currentCompanyInput)) {
        handleCompanySelect(currentCompanyInput);
      } else {
        const result = await dispatch(
          createCompany({
            accessToken,
            name: currentCompanyInput,
          })
        ).unwrap();

        const newCompanies = [...companies, currentCompanyInput];
        const newCompanyIds = [...companyIds, result.id];
        setCompanies(newCompanies);
        setCompanyIds(newCompanyIds);
        localStorage.setItem('companies', JSON.stringify(newCompanies));
        localStorage.setItem('companyIds', JSON.stringify(newCompanyIds));
      }

      setCurrentCompanyInput('');
    }
  };

  return (
    <div className="min-h-[660px]">
      <div className="flex gap-2">
        <div className="w-3/4">
          <Form {...form}>
            <form className="space-y-8 max-h-[665px] overflow-y-auto">
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
                  <div className="flex items-start justify-between my-8 gap-8">
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
                            companyIds={companyIds}
                            onKeyDown={handleKeyDown}
                            setCompanies={setCompanies}
                            showDropdown={showDropdown}
                            setCompanyIds={setCompanyIds}
                            currentInput={currentCompanyInput}
                            matchingCompanies={matchingCompanies}
                            onCompanySelect={handleCompanySelect}
                            setCurrentInput={setCurrentCompanyInput}
                            onInputChange={handleCompanyInputChange}
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
                            value={comment}
                            placeholder="Any comment about the contact"
                            className="resize-none focus:border-blue-500"
                            onChange={(e) => handleFieldChange('comment', e)}
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
                                initialType={email.type}
                                initialValue={email.value}
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
                                initialType={phone.type}
                                initialValue={phone.value}
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
                  githubUrl={githubUrl}
                  twitterUrl={twitterUrl}
                  linkedinUrl={linkedinUrl}
                  facebookUrl={facebookUrl}
                  handleFieldChange={handleFieldChange}
                />
              </div>
            </form>
          </Form>
        </div>
        <ContactSideBar
          user={user}
          jobs={{ jobPosts: allJobPosts }}
          job_id={defaultJobPost ? job_id : undefined}
        />
      </div>
    </div>
  );
};

export default CreateContactForm;
