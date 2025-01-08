'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

import jobPostMenuItems from '@/data/job-post-menu-items';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllJobApplicationNotes } from '@/redux/notes/notesThunk';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  returnJobPostMenuIcon,
  returnMenuComponent,
} from '@/utils/ReturnIcons';

const JobDetails = () => {
  const { job_id } = useParams();
  const dispatch = useAppDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const { notes } = useAppSelector((state) => state.notes);

  useEffect(() => {
    const updatePayload = {
      accessToken,
      jobApplicationId: job_id,
    };
    dispatch(getAllJobApplicationNotes(updatePayload));
  }, [accessToken, dispatch, job_id]);

  const numberOfNotes = notes.length;

  return (
    <Tabs defaultValue="Job Info" className="w-full">
      <TabsList className="grid w-full grid-cols-5 !py-4 !h-auto !px-2">
        {jobPostMenuItems.map((item) => (
          <TabsTrigger key={item.id} value={item.title}>
            {returnJobPostMenuIcon(item.icon)}
            {item.title}
            {item.title === 'Notes' && (
              <div className="indicator">
                <span className="indicator-item badge badge-neutral absolute -top-2 -right-[14px] size-6 text-[12px]">
                  <div className="mx-auto text-center">{numberOfNotes}</div>
                </span>
              </div>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {jobPostMenuItems.map((item) => (
        <TabsContent key={item.id} value={item.title} className="mt-8">
          {returnMenuComponent(item.title)}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default JobDetails;
