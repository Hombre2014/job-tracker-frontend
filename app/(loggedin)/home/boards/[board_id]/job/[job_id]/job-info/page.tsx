'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

import Modal from '@/components/Misc/Modal';
import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import jobPostMenuItems from '@/data/job-post-menu-items';
import { returnJobPostMenuIcon } from '@/utils/ReturnIcons';
import { getAllJobPostsPerColumn } from '@/redux/jobs/jobsThunk';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Notes from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobNotes/Notes';
import JobInfo from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobEdit/JobInfo';
import Company from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobCompany/Company';
import Contacts from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobContacts/Contacts';
import Documents from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobDocuments/Documents';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const JobDetails = () => {
  const { job_id } = useParams();
  const dispatch = useAppDispatch();

  // TODO: Get the job details

  useEffect(() => {
    dispatch(getAllJobPostsPerColumn(job_id));
  }, [dispatch, job_id]);

  return (
    <Modal stylings="sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2">
      <Card className="w-full">
        <CardHeader>
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
            <TabsContent value="Job Info" className="mt-8">
              <JobInfo />
            </TabsContent>
            <TabsContent value="Notes">
              <Notes />
            </TabsContent>
            <TabsContent value="Contacts">
              <Contacts />
            </TabsContent>
            <TabsContent value="Documents">
              <Documents />
            </TabsContent>
            <TabsContent value="Company">
              <Company />
            </TabsContent>
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

export default JobDetails;
