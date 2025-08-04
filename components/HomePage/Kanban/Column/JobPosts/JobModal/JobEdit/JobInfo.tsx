import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import TextEditor from './TextEditor';
import ColorPicker from './ColorPicker';
import InputElement from './InputElement';
import Loader from '@/components/Misc/Loader';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllJobPostsPerColumn, updateJobPost } from '@/redux/jobs/jobsThunk';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const JobInfo = () => {
  const { job_id } = useParams();
  const dispatch = useAppDispatch();
  const [date, setDate] = useState<Date | null>(null);
  const [firstVisit, setFirstVisit] = useState(false);
  const { jobPosts } = useAppSelector((state) => state.jobs);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { jobPostsStatus } = useAppSelector((state) => state.jobs);
  const currentJobPost = jobPosts.find((jobPost) => jobPost.id === job_id);

  const validatePostUrl = (url: string) => {
    const urlPattern =
      /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\S*)?$/;

    if (urlPattern.test(url) || url === '' || url === null) {
      return { valid: true, message: 'Valid URL format.' };
    } else {
      return {
        valid: false,
        message: 'Invalid URL format. Example: https://www.example.com',
      };
    }
  };

  const handleFieldChange = (
    fieldName: keyof JobApplication,
    value: string,
    status?: string
  ) => {
    // Check if the value is actually changing to avoid unnecessary requests
    if (currentJobPost && fieldName !== 'company') {
      if (currentJobPost[fieldName] === value) {
        return;
      }
    }

    // Special check for company name
    if (fieldName === 'company' && currentJobPost?.company.name === value) {
      return;
    }

    if (fieldName === 'postUrl') {
      const urlValidation = validatePostUrl(value);
      if (!urlValidation.valid) {
        alert(urlValidation.message);
        return;
      }
    }

    setFirstVisit(false);

    // Create base payload with current job data
    let updatePayload = {
      title: currentJobPost?.title || '',
      color: currentJobPost?.color || '',
      salary: currentJobPost?.salary || '',
      status: status || currentJobPost?.status || '',
      postUrl: currentJobPost?.postUrl || '',
      location: currentJobPost?.location || '',
      deadline: currentJobPost?.deadline || '',
      columnId: currentJobPost?.column_id || '', // Try both field names
      description: currentJobPost?.description || '',
      statusChangedAt: new Date().toISOString(),
      company: {
        name: currentJobPost?.company.name || '',
      },
    };

    // Remove empty columnId if it exists
    if (!updatePayload.columnId) {
      delete (updatePayload as any).columnId;
    }

    // Handle special cases for fields
    if (fieldName === 'company') {
      updatePayload.company.name = value;
    } else if (fieldName === 'deadline' && status === 'Deadline') {
      updatePayload.deadline = format(new Date(value), 'yyyy-MM-dd HH:mm a');
    } else {
      // For all other fields, update directly
      (updatePayload as any)[fieldName] = value;
    }

    // Add jobPostId for the thunk to use in URL construction
    const payloadWithId = {
      ...updatePayload,
      jobPostId: job_id as string,
    };

    console.log(
      'Update payload being sent:',
      JSON.stringify(payloadWithId, null, 2)
    );
    dispatch(updateJobPost(payloadWithId));
  };

  useEffect(() => {
    if (!firstVisit) {
      setFirstVisit(true);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const columnId = localStorage.getItem('columnId');
    if (columnId) {
      dispatch(getAllJobPostsPerColumn(columnId));
    }
  }, [dispatch, job_id]);

  const handleSelectDeadline = (date: Date | undefined) => {
    setDate(date!);
    const deadline = date!.toLocaleDateString();
    handleFieldChange('deadline', deadline, 'Deadline');

    setIsCalendarOpen(false);
  };

  const formattedDate = currentJobPost?.deadline
    ? format(currentJobPost?.deadline, 'MMMM do, yyyy')
    : '';

  return (
    <Card>
      {!firstVisit || (jobPostsStatus === 'succeeded' && firstVisit) ? (
        <CardContent className="space-y-2">
          <div className="flex gap-4 items-start">
            <div className="flex w-2/3 pt-8">
              <div className="flex flex-col w-full gap-4">
                <div className="flex gap-2">
                  <InputElement
                    id="company"
                    labelName="Company"
                    stylings="space-y-1 w-1/2"
                    sendData={handleFieldChange}
                    defaultValue={currentJobPost?.company.name}
                  />
                  <InputElement
                    id="title"
                    labelName="Job Title"
                    stylings="space-y-1 w-1/2"
                    sendData={handleFieldChange}
                    value={currentJobPost?.title}
                  />
                </div>
                <div className="flex gap-2">
                  <InputElement
                    id="postUrl"
                    labelName="Post URL"
                    stylings="space-y-1 w-2/3"
                    sendData={handleFieldChange}
                    value={currentJobPost?.postUrl}
                    placeholderName="+ add URL e.g. https://google.com"
                  />
                  <InputElement
                    id="salary"
                    labelName="Salary"
                    stylings="space-y-1 w-1/3"
                    sendData={handleFieldChange}
                    value={currentJobPost?.salary}
                    placeholderName="+ add Salary"
                  />
                </div>
                <div className="flex gap-2">
                  <InputElement
                    id="location"
                    labelName="Location"
                    stylings="space-y-1 w-2/3"
                    sendData={handleFieldChange}
                    value={currentJobPost?.location}
                    placeholderName="+ add location"
                  />
                  <ColorPicker id="color" sendData={handleFieldChange} />
                </div>
                <TextEditor
                  id="description"
                  title="Description"
                  buttonVisibility={false}
                  sendData={handleFieldChange}
                  value={currentJobPost?.description}
                  placeholder="Add a description here..."
                />
              </div>
            </div>
            <div className="mt-8 flex flex-col w-1/3">
              <span>Deadline</span>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'min-w-full justify-start text-left font-normal mt-1',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    {date ? (
                      format(date, 'PPP')
                    ) : (
                      <span>
                        {currentJobPost?.deadline
                          ? formattedDate
                          : 'Deadline + set date'}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    initialFocus
                    mode="single"
                    onSelect={handleSelectDeadline}
                    disabled={{ before: new Date() }}
                    selected={
                      currentJobPost?.deadline
                        ? new Date(currentJobPost?.deadline)
                        : date ?? undefined
                    }
                  />
                </PopoverContent>
                <PopoverAnchor />
              </Popover>
            </div>
          </div>
        </CardContent>
      ) : jobPostsStatus !== 'succeeded' && firstVisit ? (
        <div className="min-h-[524px] flex flex-col justify-center">
          <Loader title="Loading job post" />
        </div>
      ) : null}
    </Card>
  );
};

export default JobInfo;
