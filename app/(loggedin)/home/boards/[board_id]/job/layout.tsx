'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import Modal from '@/components/Misc/Modal';
import { Button } from '@/components/ui/button';
import { CompanyLogo } from '@/components/CompanyLogo';
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
  const { jobPosts } = useAppSelector((state) => state.jobs);
  const { boards } = useAppSelector((state) => state.boards);
  const [selectedListName, setSelectedListName] = useState('');
  const [temporaryMessage, setTemporaryMessage] = useState<string>('');
  const boardColumns = boards.find((board) => board.id === board_id)?.columns;

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const columnId = localStorage.getItem('columnId');
    if (!columnId || columnId === 'null' || !accessToken) return;

    const jobPostsData = {
      accessToken,
      columnId,
    };

    dispatch(getAllJobPostsPerColumn(jobPostsData));
  }, [dispatch, board_id, job_id]);

  const closeModal = () => {
    push(`/home/boards/${board_id}/board`);
  };

  // Defensive programming: Ensure jobPosts is always an array
  const safeJobPosts = Array.isArray(jobPosts) ? jobPosts : [];
  const currentJobPost = safeJobPosts.find((jobPost) => jobPost.id === job_id);
  
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (currentJobPost && accessToken) {
      // Only set localStorage if user is authenticated
      localStorage.setItem('currentJobPost', JSON.stringify(currentJobPost));
    }
  }, [currentJobPost]);

  const handleSelectList = (value: string) => {
    const accessToken = localStorage.getItem('accessToken');
    const chosenColumn = localStorage.getItem('chosenColumn');
    
    setSelectedListName(value);
    setTemporaryMessage(`Moved to ${value}`);
    // Only set localStorage if user is authenticated
    if (accessToken) {
      localStorage.setItem('chosenColumn', value);
    }

    const currentColumnOrder = boardColumns?.find(
      (column) => column.name === chosenColumn,
    )?.order;

    const newColumnOrder = boardColumns?.find(
      (column) => column.name === value,
    )?.order;

    const newColumnId = boardColumns?.find(
      (column) => column.name === value,
    )?.id;

    if (
      currentJobPost &&
      newColumnOrder !== undefined &&
      currentColumnOrder !== undefined
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
        status: newStatus,
        jobPostId: job_id,
        columnId: newColumnId,
        statusChangedTime: new Date().toISOString(), // Set the current date and time
        accessToken: localStorage.getItem('accessToken'),
        company: {
          name: currentJobPost!.company.name,
        },
      };

      dispatch(updateJobPost(updatePayload)).then(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          dispatch(
            getAllJobApplicationNotes({
              accessToken,
              jobApplicationId: job_id,
            }),
          );
        }
      });

      setTimeout(() => {
        setTemporaryMessage(''); // Clear temporary message
        setSelectedListName(''); // Reset selected value to show placeholder
      }, 2000);
    }
  };

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
            <CardDescription className="flex items-center gap-2 mx-4 mt-8 pb-12 min-h-[20px]">
              <CompanyLogo
                domain={currentJobPost?.company.url || ''}
                companyName={currentJobPost?.company.name || ''}
                size="sm"
              />
              <span>{currentJobPost?.company.name}</span>
            </CardDescription>
          </CardHeader>
          <div className="flex mr-6 gap-4">
            <Select
              onValueChange={handleSelectList}
              value={temporaryMessage ? undefined : selectedListName}
            >
              <SelectTrigger className="bg-blue-500 text-white w-24 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-between">
                <SelectValue placeholder={temporaryMessage || 'Move'} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select list</SelectLabel>
                  {boardColumns?.map((column) => {
                    const chosenColumn = typeof window !== 'undefined' ? localStorage.getItem('chosenColumn') : null;
                    return (
                      <SelectItem
                        key={column.id}
                        value={column.name}
                        disabled={column.name === chosenColumn}
                      >
                        {column.name}
                      </SelectItem>
                    );
                  })}
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
