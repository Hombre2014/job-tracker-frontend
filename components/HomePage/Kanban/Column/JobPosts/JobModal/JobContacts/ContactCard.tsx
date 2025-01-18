import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
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
import CreateContactModal from '@/components/Misc/CreateContactModal';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const ContactCard = (contactId: { contactId: string }) => {
  const { job_id } = useParams();
  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.jobs);
  const accessToken = localStorage.getItem('accessToken');
  const [showContactModal, setShowContactModal] = useState(false);
  const { firstName, lastName } = useAppSelector((state) => state.user);
  const currentJobPost = jobs.jobPosts.find((job) => job.id === job_id);

  useEffect(() => {
    const jobPostsData = {
      accessToken: accessToken as string,
      columnId: localStorage.getItem('columnId'),
    };

    dispatch(getAllJobPostsPerColumn(jobPostsData));
  }, [dispatch, accessToken]);

  const handleEditContact = (contactId: string) => {
    console.log('Edit contact with id: ', contactId);
    setShowContactModal(true);
  };

  const handleDeleteContact = (contactId: string) => {
    console.log('Delete contact with id: ', contactId);
  };

  return (
    <div className="flex gap-4 w-full flex-wrap max-h-[500px] overflow-y-auto">
      <div className="flex flex-col gap-1 basis-[calc(33.333%-16px)] border border-gray-200 rounded-md">
        <div className="flex justify-between px-2 mt-2 items-start">
          <div className="flex justify-start gap-4 items-center">
            <Image
              width={40}
              height={40}
              alt="Contact photo"
              src="/images/Yuriy.jpg"
            />
            <div className="flex flex-col items-start justify-center text-sm">
              <p className="font-bold">Benny Hill</p>
              <p className="font-semibold text-muted-foreground">
                {currentJobPost?.title}
              </p>
              <p className="text-muted-foreground">
                {currentJobPost?.company.name}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                title="Remove"
                className="text-left text-muted-foreground"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <BsThreeDots className="size-6 border rounded-md hover:cursor-pointer hover:border-gray-300" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="!absolute !-right-4 !top-0">
              <DropdownMenuItem
                onClick={() => handleEditContact(contactId.contactId)}
              >
                Edit Contact
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteContact(contactId.contactId)}
              >
                Delete Contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <hr />
        <div className="p-2 flex flex-col gap-1">
          <div className="flex justify-start gap-2 items-center">
            <IoLocationOutline className="size-6" />
            <p className="text-sm text-muted-foreground">
              {currentJobPost?.contacts[0].companyLocation}
            </p>
          </div>
          <div className="flex justify-start gap-2 items-center">
            <RxEnvelopeClosed className="size-6" />
            <p className="text-sm text-muted-foreground">
              Work: john.dow@nokia.com
            </p>
          </div>
          <div className="flex justify-start gap-2 items-center">
            <HiOutlinePhone className="size-6" />
            <p className="text-sm text-muted-foreground">
              Work: +(380) 213-456-7890
            </p>
          </div>
        </div>
        <hr />
        <div className="flex justify-around my-2">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://linkedin.com/in/${linkedinUrl}"
            className="text-blue-500 hover:cursor-pointer"
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
      <CreateContactModal
        showButton={false}
        buttonLabel="Edit Contact"
        isVisible={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
};

export default ContactCard;
