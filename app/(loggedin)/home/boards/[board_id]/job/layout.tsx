'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import Modal from '@/components/Misc/Modal';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllJobApplicationNotes } from '@/redux/notes/notesThunk';
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
  // Access token handled by HTTP-only cookies
  const chosenColumn = localStorage.getItem('chosenColumn');
  const { jobPosts } = useAppSelector((state) => state.jobs);
  const { boards } = useAppSelector((state) => state.boards);
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [triggerWidth, setTriggerWidth] = useState<number>(80);
  const [selectedListName, setSelectedListName] = useState('');
  const [temporaryMessage, setTemporaryMessage] = useState<string>('');
  const boardColumns = boards.find((board) => board.id === board_id)?.columns;

  useEffect(() => {
    const columnId = localStorage.getItem('columnId');
    if (columnId) {
      dispatch(getAllJobPostsPerColumn(columnId));
    }
  }, [dispatch, board_id, job_id]);

  const closeModal = () => {
    push(`/home/boards/${board_id}/board`);
  };

  // Defensive programming: Ensure jobPosts is always an array
  const safeJobPosts = Array.isArray(jobPosts) ? jobPosts : [];
  const currentJobPost = safeJobPosts.find((jobPost) => jobPost.id === job_id);
  if (currentJobPost) {
    // Set localStorage for authenticated users
    localStorage.setItem('currentJobPost', JSON.stringify(currentJobPost));
  }

  const handleSelectList = (value: string) => {
    setSelectedListName(value);
    setTemporaryMessage(`Moved to ${value}`);
    // Set localStorage for authenticated users
    localStorage.setItem('chosenColumn', value);

    const currentColumnOrder = boardColumns?.find(
      (column) => column.name === chosenColumn
    )?.order;

    const newColumnOrder = boardColumns?.find(
      (column) => column.name === value
    )?.order;

    const newColumnId = boardColumns?.find(
      (column) => column.name === value
    )?.id;

    if (
      (currentJobPost &&
        newColumnOrder !== undefined &&
        currentColumnOrder !== undefined) ||
      currentColumnOrder === 0
    ) {
      let newStatus: jobPostStatus = currentJobPost!.status;

      if (newColumnOrder === 4 || newColumnOrder! < currentColumnOrder) {
        newStatus = 'Job Moved';
      } else {
        switch (newColumnOrder) {
          case 0:
            newStatus = 'Job Created';
            break;
          case 1:
            newStatus = 'Applied';
            break;
          case 2:
            newStatus = 'Interview';
            break;
          case 3:
            newStatus = 'Offer Received';
            break;
          default:
            newStatus = currentJobPost!.status;
        }
      }

      const updatePayload = {
        title: currentJobPost!.title,
        color: currentJobPost!.color,
        salary: currentJobPost!.salary,
        status: newStatus,
        postUrl: currentJobPost!.postUrl,
        location: currentJobPost!.location,
        deadline: currentJobPost!.deadline,
        columnId: newColumnId || '',
        jobPostId: job_id as string,
        description: currentJobPost!.description,
        statusChangedAt: new Date().toISOString(),
        company: {
          name: currentJobPost!.company.name,
        },
      };

      dispatch(updateJobPost(updatePayload)).then(() => {
        dispatch(getAllJobApplicationNotes(job_id as string));
      });

      setTimeout(() => {
        setTemporaryMessage(''); // Clear temporary message
        setSelectedListName(''); // Reset selected value to show placeholder
      }, 2000);
    }
  };

  useEffect(() => {
    if (placeholderRef.current) {
      setTriggerWidth(placeholderRef.current.offsetWidth);
    }
  }, [temporaryMessage]);

  return (
    <Modal
      stylings="sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-[960px]"
      onDismiss={closeModal}
    >
      <Card className="w-full min-h-[840px]">
        <div className="flex justify-between items-center">
          <CardHeader>
            <CardTitle className="mt-8 mx-4 text-xl font-bold">
              {currentJobPost?.title}
            </CardTitle>
            <CardDescription className="mx-4 mt-8 pb-12 min-h-[20px]">
              {currentJobPost?.company.name}
            </CardDescription>
          </CardHeader>
          <div className="flex mr-6 gap-4">
            <Select
              onValueChange={handleSelectList}
              value={temporaryMessage ? undefined : selectedListName}
            >
              <SelectTrigger
                className={cn(
                  'bg-blue-500 text-white transition-all duration-300 delay-100 ease-in-out overflow-hidden pr-2',
                  {
                    'w-[`$triggerWidth`px]': triggerWidth,
                  }
                )}
              >
                <SelectValue
                  ref={placeholderRef}
                  placeholder={temporaryMessage || 'Move'}
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
