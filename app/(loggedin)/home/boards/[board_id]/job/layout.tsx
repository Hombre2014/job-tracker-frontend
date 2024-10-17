'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Modal from '@/components/Misc/Modal';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllJobPostsPerColumn } from '@/redux/jobs/jobsThunk';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const JobDetailsLayout = ({ children }: { children: React.ReactNode }) => {
  const { push } = useRouter();
  const { board_id, job_id } = useParams();
  const dispatch = useAppDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const { jobPosts } = useAppSelector((state) => state.jobs);
  const selectJobPosts = useAppSelector((state) => state.jobs.jobPosts);

  console.log('selectJobPosts: ', selectJobPosts);
  console.log('jobPosts: ', jobPosts);
  // TODO: Get the job details

  console.log('jobId: ', job_id);

  // find the column_id of the job_id

  const columnId = jobPosts.find((jobPost) => jobPost.id === job_id)?.columnId;

  console.log('columnId: ', columnId);

  useEffect(() => {
    const jobPostsData = {
      accessToken: accessToken as string,

      // columnId: localStorage.getItem('columnId'),
    };
    dispatch(getAllJobPostsPerColumn(jobPostsData));
  }, [dispatch, accessToken, board_id, job_id]);

  const closeModal = () => {
    push(`/home/boards/${board_id}/board`);
  };

  // Modify the code below to ger the current job post only for the current board_id!

  const currentBoardId = board_id;
  console.log('currentBoardId: ', currentBoardId);

  const currentJobPost = jobPosts.find((jobPost) => jobPost.id === job_id);
  console.log('currentJobPost', currentJobPost);

  return (
    <Modal stylings="sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2">
      <Card className="w-full min-h-[840px]">
        <CardHeader>
          <CardTitle className="mt-8 mx-4 text-xl font-bold">
            {currentJobPost?.title}
          </CardTitle>
          <CardDescription className="mx-4 mt-8 pb-12">
            {currentJobPost?.company.name}
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="flex justify-end gap-4 pb-8">
          <Button variant="outline" onClick={closeModal}>
            Close
          </Button>
          <Button>Move</Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};

export default JobDetailsLayout;
