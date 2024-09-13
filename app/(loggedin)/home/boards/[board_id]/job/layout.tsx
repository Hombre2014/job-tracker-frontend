'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Modal from '@/components/Misc/Modal';
import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import jobPostMenuItems from '@/data/job-post-menu-items';
import { getAllJobPostsPerColumn } from '@/redux/jobs/jobsThunk';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  returnJobPostMenuIcon,
  returnMenuComponent,
} from '@/utils/ReturnIcons';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const JobDetailsLayout = () => {
  const { push } = useRouter();
  const { board_id, job_id } = useParams();
  const dispatch = useAppDispatch();

  // TODO: Get the job details

  useEffect(() => {
    dispatch(getAllJobPostsPerColumn(job_id));
  }, [dispatch, job_id]);

  return (
    <Modal stylings="sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2">
      <Card className="w-full">
        <CardHeader>
          {/* TODO: Get dynamic company name and job title */}
          <CardTitle className="mt-8 mx-4 text-xl font-bold">
            Full Stack Web Developer
          </CardTitle>
          <CardDescription className="mx-4 mt-8 pb-12">Amazon</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Job Info" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {jobPostMenuItems.map((item) => (
                <TabsTrigger key={item.id} value={item.title}>
                  {returnJobPostMenuIcon(item.icon)}
                  {item.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {jobPostMenuItems.map((item) => (
              <TabsContent key={item.id} value={item.title} className="mt-8">
                {returnMenuComponent(item.title)}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 pb-8">
          <Button variant="outline">Close</Button>
          <Button>Move</Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};

export default JobDetailsLayout;
