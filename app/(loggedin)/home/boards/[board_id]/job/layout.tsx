'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import Modal from '@/components/Misc/Modal';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllJobPostsPerColumn, updateJobPost } from '@/redux/jobs/jobsThunk';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

const JobDetailsLayout = ({ children }: { children: React.ReactNode }) => {
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const { board_id, job_id } = useParams();
  const accessToken = localStorage.getItem('accessToken');
  const { jobPosts } = useAppSelector((state) => state.jobs);
  const { boards } = useAppSelector((state) => state.boards);
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [triggerWidth, setTriggerWidth] = useState<number>(80);
  const [selectedListName, setSelectedListName] = useState('');
  const [temporaryMessage, setTemporaryMessage] = useState<string>('');
  const boardColumns = boards.find((board) => board.id === board_id)?.columns;

  const chosenColumn = localStorage.getItem('chosenColumn');

  useEffect(() => {
    const jobPostsData = {
      accessToken: accessToken as string,
      columnId: localStorage.getItem('columnId'),
    };

    dispatch(getAllJobPostsPerColumn(jobPostsData));
  }, [dispatch, accessToken, board_id, job_id]);

  const closeModal = () => {
    push(`/home/boards/${board_id}/board`);
  };

  const currentJobPost = jobPosts.find((jobPost) => jobPost.id === job_id);

  const handleSelectList = (value: string) => {
    setSelectedListName(value);
    setTemporaryMessage(`Moved to ${value}`);

    const updatePayload = {
      accessToken: localStorage.getItem('accessToken'),
      company: {
        name: currentJobPost?.company.name,
      },
      jobPostId: job_id,
      columnId: boardColumns?.find((column) => column.name === value)?.id,
    };

    dispatch(updateJobPost(updatePayload));

    setTimeout(() => {
      setTemporaryMessage(''); // Clear temporary message
      setSelectedListName(''); // Reset selected value to show placeholder
    }, 2000);
  };

  useEffect(() => {
    if (placeholderRef.current) {
      setTriggerWidth(placeholderRef.current.offsetWidth + 0); // Add some padding for aesthetics
      console.log('offsetWidth: ', placeholderRef.current.offsetWidth);
    }
  }, [temporaryMessage]);

  return (
    <Modal stylings="sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2">
      <Card className="w-full min-h-[840px]">
        <div className="flex justify-between items-center">
          <CardHeader>
            <CardTitle className="mt-8 mx-4 text-xl font-bold">
              {currentJobPost?.title}
            </CardTitle>
            <CardDescription className="mx-4 mt-8 pb-12">
              <div className="min-h-[20px]">{currentJobPost?.company.name}</div>
            </CardDescription>
          </CardHeader>
          <div className="flex mr-6 gap-4">
            <Select
              onValueChange={handleSelectList}
              value={temporaryMessage ? undefined : selectedListName} // Reset value when showing the temporary message
            >
              <SelectTrigger
                className={cn(
                  'bg-slate-900 text-white transition-all duration-300 delay-100 ease-in-out overflow-hidden pr-2',
                  {
                    'w-[`$triggerWidth`px]': triggerWidth,
                  }
                )}
              >
                <SelectValue
                  placeholder={temporaryMessage || 'Move'}
                  ref={placeholderRef}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select list</SelectLabel>
                  {boardColumns?.map((column) => (
                    <SelectItem
                      key={column.id}
                      value={column.name}
                      disabled={column.name === chosenColumn}
                    >
                      {column.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={closeModal}>
              Close
            </Button>
          </div>
        </div>
        <CardContent>{children}</CardContent>
      </Card>
    </Modal>
  );
};

export default JobDetailsLayout;
