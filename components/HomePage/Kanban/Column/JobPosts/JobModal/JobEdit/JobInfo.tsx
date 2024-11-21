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
    value: string
  ) => {
    if (fieldName === 'postUrl') {
      const urlValidation = validatePostUrl(value);
      if (!urlValidation.valid) {
        alert(urlValidation.message);
        return;
      }
    }

    setFirstVisit(false);

    // Check the payload if it is the same as the current job post data and if so, do not send the request
    if (currentJobPost) {
      if (currentJobPost[fieldName] === value) {
        return;
      }
    }

    // Prepare the payload dynamically
    const updatePayload = {
      accessToken: localStorage.getItem('accessToken'),
      company: {
        name: currentJobPost?.company.name,
      },
      jobPostId: job_id,
      [fieldName]: value, // Dynamic field
    };

    dispatch(updateJobPost(updatePayload));
  };

  useEffect(() => {
    if (!firstVisit) {
      setFirstVisit(true);
      return;
    }
  }, []);

  useEffect(() => {
    const jobPostsData = {
      accessToken: localStorage.getItem('accessToken') as string,
      columnId: localStorage.getItem('columnId'),
    };

    dispatch(getAllJobPostsPerColumn(jobPostsData));
  }, [dispatch, job_id]);

  const handleSelectDeadline = (date: Date | undefined) => {
    setDate(date!);
    const deadline = date!.toLocaleDateString();
    handleFieldChange('deadline', deadline);
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
                  initialText="Add a description"
                  value={currentJobPost?.description}
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
                    mode="single"
                    selected={date!}
                    onSelect={handleSelectDeadline}
                    initialFocus
                  />
                </PopoverContent>
                <PopoverAnchor />
              </Popover>
            </div>
          </div>
        </CardContent>
      ) : jobPostsStatus !== 'succeeded' && firstVisit ? (
        <div className="min-h-[524px] flex flex-col justify-center">
          <Loader title="Loading job post..." />
        </div>
      ) : null}
    </Card>
  );
};

export default JobInfo;
