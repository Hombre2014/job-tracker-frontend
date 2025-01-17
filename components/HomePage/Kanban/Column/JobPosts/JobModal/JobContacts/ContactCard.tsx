import Image from 'next/image';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BsThreeDots } from 'react-icons/bs';
import { IoLocationOutline } from 'react-icons/io5';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllJobPostsPerColumn } from '@/redux/jobs/jobsThunk';

const ContactCard = () => {
  const { job_id } = useParams();
  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.jobs);
  const accessToken = localStorage.getItem('accessToken');
  const { firstName, lastName } = useAppSelector((state) => state.user);
  const currentJobPost = jobs.jobPosts.find((job) => job.id === job_id);

  useEffect(() => {
    const jobPostsData = {
      accessToken: accessToken as string,
      columnId: localStorage.getItem('columnId'),
    };

    dispatch(getAllJobPostsPerColumn(jobPostsData));
  }, [dispatch, accessToken]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-4 w-1/3 border border-gray-200 rounded-md p-2">
        <div className="flex justify-between">
          <div className="flex justify-start gap-4 items-center">
            <Image
              width={40}
              height={40}
              alt="Contact photo"
              // TODO: Add contact photo
              src="/images/Yuriy.jpg"
            />
            <div className="flex flex-col items-start justify-center text-sm">
              <p className="font-bold">
                {firstName} {lastName}
              </p>
              <p className="font-semibold text-muted-foreground">
                {currentJobPost?.title}
              </p>
              <p className="text-muted-foreground">
                {currentJobPost?.company.name}
              </p>
            </div>
          </div>
          <BsThreeDots className="h-6 w-6 border rounded-md hover:cursor-pointer hover:border-gray-300" />
        </div>
        <hr />
        <div className="flex justify-start gap-2 items-center">
          <IoLocationOutline className="h-6 w-6" />
          <p className="text-sm text-muted-foreground">
            {currentJobPost?.contacts[0].companyLocation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
