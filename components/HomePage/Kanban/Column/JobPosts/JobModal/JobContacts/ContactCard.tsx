import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { BsThreeDots } from 'react-icons/bs';
import { HiOutlinePhone } from 'react-icons/hi';
import { RxEnvelopeClosed } from 'react-icons/rx';
import { IoLocationOutline } from 'react-icons/io5';
import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  SlSocialGithub,
  SlSocialTwitter,
  SlSocialFacebook,
  SlSocialLinkedin,
} from 'react-icons/sl';

import { deleteContact, getContact } from '@/redux/contacts/contactsThunk';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CreateContactModal from '@/components/Misc/CreateContactModal';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const ContactCard = ({
  contact,
  onDelete,
}: {
  contact: Contact;
  onDelete: (id: string) => void;
}) => {
  const params = useParams();
  const contactId = contact.id;
  const dispatch = useAppDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const { firstName, lastName } = useAppSelector((state) => state.user);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const board_id = params.board_id
    ? Array.isArray(params.board_id)
      ? params.board_id[0]
      : params.board_id
    : undefined;

  // Memoized formatter functions for better performance
  const formatTextWithEllipsis = useCallback((text: string, maxLength = 24) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }, []);

  const formatList = useCallback(
    (items: any[] | undefined, propertyName: string) => {
      if (!items || items.length === 0) return 'none';
      const joinedText = items.map((item) => item[propertyName]).join(', ');
      return formatTextWithEllipsis(joinedText);
    },
    [formatTextWithEllipsis]
  );

  // Memoized company name display
  const displayedCompanyNames = useMemo(() => {
    if (companyNames.length === 0) return 'none';
    return formatTextWithEllipsis(companyNames.join(', '));
  }, [companyNames, formatTextWithEllipsis]);

  useEffect(() => {
    const getCurrentContact = async () => {
      try {
        // Option 1: If companies data is already available in the contact, use it
        if (contact.companies && contact.companies.length > 0) {
          const names = contact.companies.map(
            (company: { name: string }) => company.name
          );
          setCompanyNames(names);
          return;
        }

        // Option 2: Try to get company names from job applications
        if (contact.jobApplications && contact.jobApplications.length > 0) {
          const companiesFromJobs = contact.jobApplications
            .filter((job) => job.company && job.company.name)
            .map((job) => job.company.name);

          if (companiesFromJobs.length > 0) {
            setCompanyNames(Array.from(new Set(companiesFromJobs)));
            return;
          }
        }

        // Option 3: Use board_id if available
        // Find a valid board ID from any available source
        const effectiveBoardId =
          board_id || contact.boardId || (contact as any).board?.id;

        // Only proceed with API call if we have a boardId
        if (effectiveBoardId) {
          const value = {
            boardId: effectiveBoardId,
            contactId: contactId,
            accessToken: accessToken as string,
          };

          try {
            const contactData = await dispatch(getContact(value)).unwrap();
            if (contactData[0]?.companies?.length > 0) {
              const names = contactData[0].companies.map(
                (company: { name: string }) => company.name
              );
              setCompanyNames(names);
              return;
            }
          } catch (apiError) {
            console.error('API error fetching contact data:', apiError);
            // Continue to fallback
          }
        }

        // Fallback if nothing else worked
        setCompanyNames(['No company']);
      } catch (error) {
        console.error('Error fetching contact data:', error);
        setCompanyNames(['Error loading company data']);
      }
    };

    getCurrentContact();
  }, [dispatch, accessToken, contactId, board_id, contact]);

  const handleEditContact = (contactId: string) => {
    setShowContactModal(true);
    setOpenDropdownId(null);
  };

  const handleDeleteContact = (contactId: string) => {
    dispatch(
      deleteContact({ id: contactId, accessToken: accessToken as string })
    ).then(() => {
      onDelete(contactId);
    });
    setOpenDropdownId(null);
  };

  const handleCancel = () => {
    setOpenDropdownId(null);
  };

  const SocialLink = ({
    url,
    Icon,
  }: {
    url: string | null;
    Icon: React.ComponentType<any>;
  }) => (
    <Link
      target="_blank"
      href={url || '#'}
      rel="noopener noreferrer"
      className={
        url
          ? 'text-blue-500 hover:cursor-pointer'
          : 'text-gray-400 cursor-not-allowed'
      }
    >
      <Icon className="size-6" />
    </Link>
  );

  return (
    <div className="min-w-[268px]">
      <div className="flex flex-col gap-1 border border-gray-200 rounded-md">
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
                {displayedCompanyNames}
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
                className="rsw-dropdown-menu-item"
                onClick={() => handleEditContact(contact.id)}
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
                  actionFunction={() => handleDeleteContact(contact.id)}
                  dialogText="Are you sure you want to delete this contact?"
                  stylings="ml-0 pl-2 font-normal inline-flex justify-start w-full text-left"
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
              {formatList(contact.emails, 'email')}
            </p>
          </div>
          <div className="flex justify-start gap-2 items-center">
            <HiOutlinePhone className="size-6" />
            <p className="text-sm text-muted-foreground">
              {formatList(contact.phones, 'phone')}
            </p>
          </div>
        </div>
        <hr />
        <div className="flex justify-around my-2">
          <SocialLink url={contact.linkedinUrl} Icon={SlSocialLinkedin} />
          <SocialLink url={contact.facebookUrl} Icon={SlSocialFacebook} />
          <SocialLink url={contact.twitterUrl} Icon={SlSocialTwitter} />
          <SocialLink url={contact.githubUrl} Icon={SlSocialGithub} />
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
        userContactsPage={false}
        buttonLabel="Edit Contact"
        dialogTitle="Edit Contact"
        isVisible={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
};

export default ContactCard;
