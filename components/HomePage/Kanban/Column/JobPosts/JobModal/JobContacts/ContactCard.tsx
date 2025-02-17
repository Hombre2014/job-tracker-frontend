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
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import { getCompany } from '@/redux/companies/companiesThunk';
import { get } from 'lodash';

const ContactCard = ({ contact }: { contact: Contact }) => {
  // const { job_id } = useParams();
  const dispatch = useAppDispatch();
  // const jobs = useAppSelector((state) => state.jobs);
  const accessToken = localStorage.getItem('accessToken');
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const { firstName, lastName } = useAppSelector((state) => state.user);
  // const currentJobPost = jobs.jobPosts.find((job) => job.id === job_id);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

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
    setOpenDropdownId(null);
  };

  const handleDeleteContact = (contactId: string) => {
    console.log('Delete contact with id: ', contactId);
    setOpenDropdownId(null);
  };

  const handleCancel = () => {
    setOpenDropdownId(null);
  };

  const getCompanyNames = async (companyIds: CompanyIds[]) => {
    const accessToken = localStorage.getItem('accessToken');
    const companyNames: string[] = [];

    for (const companyId of companyIds) {
      const company = await dispatch(
        getCompany({
          companyId: companyId.id,
          accessToken,
        })
      ).unwrap();
      companyNames.push(company.name);
    }

    return companyNames;
  };

  useEffect(() => {
    const fetchCompanyNames = async () => {
      const names = await getCompanyNames(contact.companyIds);
      setCompanyNames(names);
    };
    fetchCompanyNames();
  }, [contact.companyIds]);

  return (
    <div className="min-w-[250px]">
      <div className="flex flex-col gap-1 basis-[calc(33.333%-16px)] border border-gray-200 rounded-md">
        <div className="flex justify-between px-2 mt-2 items-start">
          <div className="flex justify-start gap-4 items-center">
            <Image
              width={40}
              height={40}
              alt="Contact photo"
              src={contact.photoUrl || '/images/Yuriy.jpg'}
            />
            <div className="flex flex-col items-start justify-center text-sm">
              <p className="font-bold">
                {contact.firstName} {contact.lastName}
              </p>
              <p className="font-semibold text-muted-foreground">
                {contact.jobTitle}
              </p>
              <p className="text-sm text-muted-foreground">
                {companyNames.length > 0
                  ? companyNames.join(', ').slice(0, 24) +
                    (companyNames.join(', ').length > 24 ? '...' : '')
                  : 'none'}
              </p>
            </div>
          </div>
          <DropdownMenu
            open={openDropdownId === contact.id}
            onOpenChange={(isOpen) =>
              setOpenDropdownId(isOpen ? contact.id : null)
            }
          >
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
            <DropdownMenuContent className="!absolute !-right-4 !top-0 rsw-dropdown-menu">
              <DropdownMenuItem
                onClick={() => handleEditContact(contact.id)}
                className="rsw-dropdown-menu-item"
              >
                Edit Contact
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div
                onClick={(e) => e.stopPropagation()}
                className="rsw-dropdown-menu-item"
              >
                <AlertDialogModal
                  buttonCancel="Cancel"
                  buttonVariant="ghost"
                  buttonConfirm="Delete"
                  destructiveVariant={true}
                  dialogTitle="Delete Contact"
                  buttonLabel="Delete Contact"
                  dialogText="Are you sure you want to delete this contact?"
                  stylings="ml-0 pl-2 font-normal inline-flex justify-start w-full text-left"
                  actionFunction={() => handleDeleteContact(contact.id)}
                  onOpenChange={(isOpen) => {
                    if (!isOpen) handleCancel();
                  }}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <hr />
        <div className="p-2 flex flex-col gap-1">
          <div className="flex justify-start gap-2 items-center">
            <IoLocationOutline className="size-6" />
            <p className="text-sm text-muted-foreground">{contact.location}</p>
          </div>
          <div className="flex justify-start gap-2 items-center">
            <RxEnvelopeClosed className="size-6" />
            <p className="text-sm text-muted-foreground">
              {contact.emails && contact.emails.length > 0
                ? contact.emails
                    .map((e) => e.email)
                    .join(', ')
                    .slice(0, 24) +
                  (contact.emails.map((e) => e.email).join(', ').length > 24
                    ? '...'
                    : '')
                : 'none'}
            </p>
          </div>
          <div className="flex justify-start gap-2 items-center">
            <HiOutlinePhone className="size-6" />
            <p className="text-sm text-muted-foreground">
              {contact.phones && contact.phones.length > 0
                ? contact.phones
                    .map((p) => p.phone)
                    .join(', ')
                    .slice(0, 24) +
                  (contact.phones.map((p) => p.phone).join(', ').length > 24
                    ? '...'
                    : '')
                : 'none'}
            </p>
          </div>
        </div>
        <hr />
        <div className="flex justify-around my-2">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={contact.linkedinUrl || '#'}
            className={
              contact.linkedinUrl
                ? 'text-blue-500 hover:cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            }
          >
            <SlSocialLinkedin className="size-6" />
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={contact.githubUrl || '#'}
            className={
              contact.githubUrl
                ? 'text-blue-500 hover:cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            }
          >
            <SlSocialFacebook className="size-6" />
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={contact.twitterUrl || '#'}
            className={
              contact.twitterUrl
                ? 'text-blue-500 hover:cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            }
          >
            <SlSocialTwitter className="size-6" />
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={contact.githubUrl || '#'}
            className={
              contact.githubUrl
                ? 'text-blue-500 hover:cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            }
          >
            <SlSocialGithub className="size-6" />
          </Link>
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
        buttonConfirm="Update"
        buttonLabel="Edit Contact"
        dialogTitle="Edit Contact"
        isVisible={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
};

export default ContactCard;
