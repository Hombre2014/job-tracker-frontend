import Image from 'next/image';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BsThreeDots } from 'react-icons/bs';
import { HiOutlinePhone } from 'react-icons/hi';
import { RxEnvelopeClosed } from 'react-icons/rx';
import { IoLocationOutline } from 'react-icons/io5';
import {
  SlSocialGithub,
  SlSocialTwitter,
  SlSocialFacebook,
  SlSocialLinkedin,
} from 'react-icons/sl';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllJobPostsPerColumn } from '@/redux/jobs/jobsThunk';
import Link from 'next/link';

const ContactCard = () => {
  const { job_id } = useParams();
  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.jobs);
  const accessToken = localStorage.getItem('accessToken');
  const { firstName, lastName } = useAppSelector((state) => state.user);
  const currentJobPost = jobs.jobPosts.find((job) => job.id === job_id);

  console.log('currentJobPost: ', currentJobPost);

  useEffect(() => {
    const jobPostsData = {
      accessToken: accessToken as string,
      columnId: localStorage.getItem('columnId'),
    };

    dispatch(getAllJobPostsPerColumn(jobPostsData));
  }, [dispatch, accessToken]);

  return (
    <div className="flex gap-4 w-full flex-wrap max-h-[500px] overflow-y-auto">
      <div className="flex flex-col gap-1 basis-[calc(33.333%-16px)] border border-gray-200 rounded-md">
        <div className="flex justify-between px-2 mt-2">
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
                {/* TODO: Add contact name */}
                Benny Hill
              </p>
              <p className="font-semibold text-muted-foreground">
                {currentJobPost?.title}
              </p>
              <p className="text-muted-foreground">
                {currentJobPost?.company.name}
              </p>
            </div>
          </div>
          <BsThreeDots className="size-6 border rounded-md hover:cursor-pointer hover:border-gray-300" />
        </div>
        <hr />
        <div className="p-2 flex flex-col gap-1">
          <div className="flex justify-start gap-2 items-center">
            <IoLocationOutline className="size-6" />
            <p className="text-sm text-muted-foreground">
              {/* TODO: Add contact location for the particular contact (index of the array) */}
              {currentJobPost?.contacts[0].companyLocation}
            </p>
          </div>
          <div className="flex justify-start gap-2 items-center">
            <RxEnvelopeClosed className="size-6" />
            <p className="text-sm text-muted-foreground">
              {/* TODO: Add contact emails */}
              Work: john.dow@nokia.com
            </p>
          </div>
          <div className="flex justify-start gap-2 items-center">
            <HiOutlinePhone className="size-6" />
            <p className="text-sm text-muted-foreground">
              {/* TODO: Add contact phone numbers */}
              Work: +(380) 213-456-7890
            </p>
          </div>
        </div>
        <hr />
        <div className="flex justify-around my-2">
          {/* TODO: Add contact's social media links if any. Shows only ones thhat have a handle */}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:cursor-pointer"
            href="https://linkedin.com/in/${linkedinUrl}"
          >
            <SlSocialLinkedin className="size-6" />
          </Link>
          <SlSocialFacebook className="size-6" />
          <SlSocialTwitter className="size-6" />
          <SlSocialGithub className="size-6" />
        </div>
        <hr />
        <div className="flex justify-start p-2 mb-1">
          <p className="text-xs text-muted-foreground">
            Created by {firstName} {lastName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
