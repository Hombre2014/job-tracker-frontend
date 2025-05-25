import Image from 'next/image';
import { debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
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
import { cleanupAfterContact } from '@/utils/helpers';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllJobPostsPerColumn } from '@/redux/jobs/jobsThunk';
import { getBoardsOnly, getBoardWithColumns } from '@/redux/boards/boardsThunk';
import {
  createCompany,
  getCompanyThatStartsWith,
} from '@/redux/companies/companiesThunk';
import {
  updateContactEmail,
  updateContactPhone,
  deleteContactEmail,
  deleteContactPhone,
} from '@/redux/contacts/contactsThunk';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';

const CreateContactForm = ({
  contactToEdit,
  defaultJobPost,
  setPendingImage,
  onValidationChange,
  isUserContactsPage,
}: CreateContactFormProps) => {
  const dispatch = useAppDispatch();
  // Replace individual state variables with a single formData state
  const [formData, setFormData] = useState({
    comment: '',
    location: '',
    lastName: '',
    jobTitle: '',
    firstName: '',
    githubUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    linkedinUrl: '',
    photoUrl: '/images/Yuriy.jpg',
  });

  const { job_id } = useParams<{ job_id: string }>();
  const user = useAppSelector((state) => state.user);
  const jobs = useAppSelector((state) => state.jobs);
  const { board_id } = useParams<{ board_id: string }>();
  const accessToken = localStorage.getItem('accessToken');
  const [showDropdown, setShowDropdown] = useState(false);
  const [companies, setCompanies] = useState<string[]>([]);
  const [companyIds, setCompanyIds] = useState<string[]>([]);
  const [currentCompanyInput, setCurrentCompanyInput] = useState('');
  const selectedJob = jobs.jobPosts.find((job) => job.id === job_id);
  const [allJobPosts, setAllJobPosts] = useState<JobApplication[]>([]);
  const [matchingCompanies, setMatchingCompanies] = useState<string[]>([]);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [emails, setEmails] = useState<
    { id: string; value: string; type: string }[]
  >([]);
  const [phones, setPhones] = useState<
    { id: string; value: string; type: string }[]
  >([]);

  const [hasChanges, setHasChanges] = useState({
    basicInfo: false,
    emails: new Set<string>(),
    phones: new Set<string>(),
    companies: false,
    socialMedia: false,
  });

  const selectedCompanyName = selectedJob?.company.name;

  const markFieldChanged = (
    field: 'basicInfo' | 'companies' | 'socialMedia'
  ) => {
    setHasChanges((prev) => ({ ...prev, [field]: true }));
  };

  const markContactMethodChanged = (type: 'emails' | 'phones', id: string) => {
    setHasChanges((prev) => {
      const updatedSet = new Set(prev[type]);
      updatedSet.add(id);
      return { ...prev, [type]: updatedSet };
    });
  };

  const handleFieldChange = (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;

    // Update formData state for all fields
    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    // Mark the field as changed
    if (
      ['firstName', 'lastName', 'jobTitle', 'location', 'comment'].includes(
        fieldName
      )
    ) {
      markFieldChanged('basicInfo');
    } else if (
      ['githubUrl', 'twitterUrl', 'facebookUrl', 'linkedinUrl'].includes(
        fieldName
      )
    ) {
      markFieldChanged('socialMedia');
    }

    // Update localStorage as needed
    switch (fieldName) {
      case 'githubUrl':
        localStorage.setItem(
          'githubUrl',
          value ? `https://github.com/${value}` : ''
        );
        break;
      case 'twitterUrl':
        localStorage.setItem(
          'twitterUrl',
          value ? `https://twitter.com/${value}` : ''
        );
        break;
      case 'facebookUrl':
        localStorage.setItem(
          'facebookUrl',
          value ? `https://facebook.com/${value}` : ''
        );
        break;
      case 'linkedinUrl':
        localStorage.setItem(
          'linkedinUrl',
          value ? `https://linkedin.com/in/${value}` : ''
        );
        break;
      default:
        localStorage.setItem(fieldName, value);
        break;
    }

    // Set form values for required fields
    if (fieldName === 'firstName' || fieldName === 'lastName') {
      form.setValue(fieldName, value);
    }
  };

  // Load contact data or reset form
  useEffect(() => {
    if (contactToEdit) {
      // Extract data from contactToEdit
      const twitterHandle = contactToEdit.twitterUrl
        ? contactToEdit.twitterUrl.split('/').pop()
        : '';
      const facebookHandle = contactToEdit.facebookUrl
        ? contactToEdit.facebookUrl.split('/').pop()
        : '';
      const githubHandle = contactToEdit.githubUrl
        ? contactToEdit.githubUrl.split('/').pop()
        : '';
      const linkedinHandle = contactToEdit.linkedinUrl
        ? contactToEdit.linkedinUrl.split('/').pop()
        : '';

      // Update formData state with all contact info
      setFormData({
        githubUrl: githubHandle || '',
        twitterUrl: twitterHandle || '',
        facebookUrl: facebookHandle || '',
        linkedinUrl: linkedinHandle || '',
        comment: contactToEdit.comment || '',
        lastName: contactToEdit.lastName || '',
        jobTitle: contactToEdit.jobTitle || '',
        location: contactToEdit.location || '',
        firstName: contactToEdit.firstName || '',
        photoUrl: contactToEdit.photoUrl || '/images/Yuriy.jpg',
      });

      // Populate localStorage with contact data
      localStorage.setItem('githubUrl', githubHandle || '');
      localStorage.setItem('twitterUrl', twitterHandle || '');
      localStorage.setItem('facebookUrl', facebookHandle || '');
      localStorage.setItem('linkedinUrl', linkedinHandle || '');
      localStorage.setItem('comment', contactToEdit.comment || '');
      localStorage.setItem('lastName', contactToEdit.lastName || '');
      localStorage.setItem('jobTitle', contactToEdit.jobTitle || '');
      localStorage.setItem('location', contactToEdit.location || '');
      localStorage.setItem('photoUrl', contactToEdit.photoUrl || '');
      localStorage.setItem('firstName', contactToEdit.firstName || '');

      // Transform and handle emails
      const transformedEmails = (contactToEdit.emails || []).map((email) => ({
        id: email.id,
        type: email.type,
        value: email.email,
      }));

      // Transform and handle phones
      const transformedPhones = (contactToEdit.phones || []).map((phone) => ({
        id: phone.id,
        type: phone.type,
        value: phone.phone,
      }));

      localStorage.setItem('emails', JSON.stringify(transformedEmails));
      localStorage.setItem('phones', JSON.stringify(transformedPhones));

      // Handle companies
      const companies = contactToEdit.companies || [];
      const companyIds = companies.map((company) => company.id);
      const companyNames = companies.map((company) => company.name);
      localStorage.setItem('companies', JSON.stringify(companyNames));
      localStorage.setItem('companyIds', JSON.stringify(companyIds));

      // Update state variables
      setCompanyIds(companyIds);
      setCompanies(companyNames);
      setEmails(transformedEmails);
      setPhones(transformedPhones);
    } else {
      // New contact: reset form
      cleanupAfterContact();
      setFormData({
        comment: '',
        lastName: '',
        jobTitle: '',
        location: '',
        firstName: '',
        githubUrl: '',
        twitterUrl: '',
        facebookUrl: '',
        linkedinUrl: '',
        photoUrl: '/images/Yuriy.jpg',
      });
      setEmails([]);
      setPhones([]);
      setCompanies([]);
      setCompanyIds([]);
      setPreviewImageUrl(null);
    }
  }, [contactToEdit]);

  const form = useForm({
    resolver: zodResolver(AddContactSchema),
    defaultValues: {
      emails: [],
      phones: [],
      boardId: '',
      photoUrl: '',
      companies: [],
      githubUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
      facebookUrl: '',
      comment: contactToEdit?.comment || '',
      lastName: contactToEdit?.lastName || '',
      jobTitle: contactToEdit?.jobTitle || '',
      location: contactToEdit?.location || '',
      firstName: contactToEdit?.firstName || '',
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
          setAllJobPosts(result);        } else if (isUserContactsPage) {
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

          setAllJobPosts(uniqueJobs);        } else {
          // Case 2: From Board's Contacts page - fetch jobs from current board
          // If board_id is undefined (editing from main contacts page), use the first board
          let effectiveBoardId = board_id;
          if (!effectiveBoardId) {
            try {
              // Get all boards and use the first one (default "Job Search" board)
              const boards = await dispatch(getBoardsOnly(accessToken as string)).unwrap();
              if (boards && boards.length > 0) {
                // Sort by creation date to get the first created board
                const sortedBoards = [...boards].sort((a, b) => 
                  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
                // Use the first board (likely "Job Search YYYY")
                effectiveBoardId = sortedBoards[0].id;
                console.log('Using default board for jobs fetch:', sortedBoards[0].name, 'with ID:', effectiveBoardId);
              }
            } catch (error) {
              console.error('Error fetching default board for jobs:', error);
              // Return early if we can't get a default board
              return;
            }
          }
          
          const boardData = await dispatch(
            getBoardWithColumns({
              accessToken,
              boardId: effectiveBoardId,
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
    if (selectedCompanyName) {
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

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingImage(file); // Call the setter function passed from CreateContactModal
      setPreviewImageUrl(URL.createObjectURL(file)); // Generate a temporary URL for the image
    }
  };

  const handleRemoveContactType = (type: 'email' | 'phone', id: string) => {
    if (type === 'email') {
      // If editing an existing contact and the email exists in backend, delete from backend
      if (
        contactToEdit &&
        contactToEdit.emails &&
        contactToEdit.emails.some((email) => email.id === id)
      ) {
        dispatch(
          deleteContactEmail({
            id,
            accessToken: accessToken as string,
          })
        );
      }
      // Remove from local state and localStorage
      setEmails((prev) => prev.filter((email) => email.id !== id));
      localStorage.setItem(
        'emails',
        JSON.stringify(emails.filter((email) => email.id !== id))
      );
    } else if (type === 'phone') {
      if (
        contactToEdit &&
        contactToEdit.phones &&
        contactToEdit.phones.some((phone) => phone.id === id)
      ) {
        dispatch(
          deleteContactPhone({
            id,
            accessToken: accessToken as string,
          })
        );
      }
      setPhones((prev) => prev.filter((phone) => phone.id !== id));
      localStorage.setItem(
        'phones',
        JSON.stringify(phones.filter((phone) => phone.id !== id))
      );
    }
  };

  const handleAddEmail = () => {
    setEmails([...emails, { id: uuidv4(), value: '', type: 'WORK' }]);
  };

  const handleAddPhone = () => {
    setPhones([...phones, { id: uuidv4(), value: '', type: 'WORK' }]);
  };

  // const isValidEmail = (email: string) =>
  //   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // const isValidPhone = (phone: string) =>
  //   /^\+?\d{10,}$/.test(phone.replace(/\D/g, '')); // simple check: 10+ digits

  const handleEmailChange = (id: string, value: string, type: string) => {
    setEmails((prev) => {
      const updated = prev.map((email) =>
        email.id === id ? { ...email, value, type } : email
      );
      localStorage.setItem('emails', JSON.stringify(updated));
      return updated;
    });

    if (!contactToEdit) return;

    const wasExisting = !!(contactToEdit.emails || []).find(
      (email) => email.id === id
    );

    if (wasExisting) {
      dispatch(
        updateContactEmail({
          id,
          type,
          email: value,
          accessToken: accessToken as string,
        })
      );
      markContactMethodChanged('emails', id);
    }
  };

  const handlePhoneChange = (id: string, value: string, type: string) => {
    setPhones((prev) => {
      const updated = prev.map((phone) =>
        phone.id === id ? { ...phone, value, type } : phone
      );
      localStorage.setItem('phones', JSON.stringify(updated));
      return updated;
    });

    if (!contactToEdit) return;

    const wasExisting = !!(contactToEdit.phones || []).find(
      (phone) => phone.id === id
    );

    if (wasExisting) {
      dispatch(
        updateContactPhone({
          id,
          type,
          phone: value,
          accessToken: accessToken as string,
        })
      );
      markContactMethodChanged('phones', id);
    }
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

  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl); // Clean up the URL
      }
    };
  }, [previewImageUrl]);

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
                          {previewImageUrl ? (
                            <Image
                              width={50}
                              height={50}
                              src={previewImageUrl}
                              alt="User profile picture"
                              className="cursor-pointer rounded-lg"
                            />
                          ) : (
                            <Image
                              width={50}
                              height={50}
                              alt="User profile picture"
                              className="cursor-pointer rounded-lg"
                              src={formData.photoUrl || '/images/Yuriy.jpg'}
                            />
                          )}
                          <input
                            {...field}
                            type="file"
                            id="file-input"
                            accept="image/*"
                            name="file-input"
                            title="file-input"
                            onChange={(e) => {
                              handleFileInput(e);
                            }}
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
                          placeholder="First Name"
                          value={formData.firstName}
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
                          placeholder="Last Name"
                          value={formData.lastName}
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
                          placeholder="i.e: CEO"
                          value={formData.jobTitle}
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
                            value={formData.location}
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
                            value={formData.comment}
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
                                value={email.value}
                                initialType={email.type}
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
                                value={phone.value}
                                initialType={phone.type}
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
                  githubUrl={formData.githubUrl}
                  twitterUrl={formData.twitterUrl}
                  linkedinUrl={formData.linkedinUrl}
                  facebookUrl={formData.facebookUrl}
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
