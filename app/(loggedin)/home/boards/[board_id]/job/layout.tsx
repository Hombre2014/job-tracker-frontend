'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Modal from '@/components/Misc/Modal';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllJobPostsPerColumn } from '@/redux/jobs/jobsThunk';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

const JobDetailsLayout = ({ children }: { children: React.ReactNode }) => {
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const { board_id, job_id } = useParams();
  const accessToken = localStorage.getItem('accessToken');
  const { jobPosts } = useAppSelector((state) => state.jobs);

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
            <Button variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button>Move</Button>
          </div>
        </div>
        <CardContent>{children}</CardContent>
      </Card>
    </Modal>
  );
};

export default JobDetailsLayout;
