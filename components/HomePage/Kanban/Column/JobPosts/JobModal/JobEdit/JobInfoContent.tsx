import { CardContent } from '@/components/ui/card';
import InputElement from './InputElement';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { updateJobPost } from '@/redux/jobs/jobsThunk';
import TextEditor from './TextEditor';
import ColorPicker from './ColorPicker';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const JobInfoContent = (firstLoad: { firstLoad: boolean }) => {
  const { job_id } = useParams();
  const dispatch = useAppDispatch();
  const [date, setDate] = useState<Date | null>(null);
  const [firstVisit, setFirstVisit] = useState(false);
  const { jobPosts } = useAppSelector((state) => state.jobs);
  const currentJobPost = jobPosts.find((jobPost) => jobPost.id === job_id);

  const [editedJobPost, setEditedJobPost] = useState({
    title: currentJobPost?.title,
    company: {
      name: currentJobPost?.company.name,
    },
    jobPostsId: job_id,
    columnId: localStorage.getItem('columnId'),
    location: '',
    salary: '',
    description: '',
    deadline: '',
    postUrl: '',
    color: '#8b5cf6',
  });

  const handleSalaryChange = (data: string) => {
    if (data === '') return;

    setEditedJobPost({ ...editedJobPost, salary: data });
    setFirstVisit(false);

    dispatch(
      updateJobPost({
        accessToken: localStorage.getItem('accessToken'),
        title: currentJobPost?.title,
        company: {
          name: currentJobPost?.company.name,
        },
        columnId: localStorage.getItem('columnId'),
        jobPostId: job_id,
        postUrl: '',
        salary: data,
        location: '',
        color: '',
        deadline: '',
        description: '',
      })
    );
  };

  // useEffect(() => {
  //   if (!firstVisit) {
  //     setFirstVisit(true);
  //     return;
  //   }
  // }, []);

  const handleSelect = (date: Date) => {
    setDate(date);
  };

  return (
    <CardContent className="space-y-2">
      {firstLoad && (
        <div className="flex gap-4 items-start">
          <div className="flex w-2/3 pt-8">
            <div className="flex flex-col w-full gap-4">
              <div className="flex gap-2">
                <InputElement
                  stylings="space-y-1 w-1/2"
                  labelName="Company"
                  id="company"
                  defaultValue={currentJobPost?.company.name}
                />
                <InputElement
                  stylings="space-y-1 w-1/2"
                  labelName="Job Title"
                  id="job-title"
                  defaultValue={currentJobPost?.title}
                />
              </div>
              <div className="flex gap-2">
                <InputElement
                  stylings="space-y-1 w-2/3"
                  labelName="Post URL"
                  id="post-url"
                  defaultValue=""
                  placeholderName="+ add URL"
                />
                <InputElement
                  stylings="space-y-1 w-1/3"
                  labelName="Salary"
                  id="salary"
                  sendData={handleSalaryChange}
                  value={currentJobPost?.salary}
                  placeholderName="+ add Salary"
                />
              </div>
              <div className="flex gap-2">
                <InputElement
                  stylings="space-y-1 w-2/3"
                  labelName="Location"
                  id="location"
                  defaultValue=""
                  placeholderName="+ add location"
                />
                <ColorPicker />
              </div>
              <TextEditor
                initialText="Type your description here..."
                title="Description"
                buttonVisibility={false}
              />
            </div>
          </div>
          <div className="mt-8 flex flex-col w-1/3">
            <span>Deadline</span>
            <Popover>
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
                    <span>Deadline + set date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleSelect}
                  initialFocus
                />
              </PopoverContent>
              <PopoverAnchor />
            </Popover>
          </div>
        </div>
      )}
    </CardContent>
  );
};

export default JobInfoContent;
