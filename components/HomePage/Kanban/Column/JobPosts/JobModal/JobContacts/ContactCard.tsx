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

import { getBoardsOnly } from '@/redux/boards/boardsThunk';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CreateContactModal from '@/components/Misc/CreateContactModal';
import { deleteContact, getContact } from '@/redux/contacts/contactsThunk';
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
  onUpdate,
}: {
  contact: Contact;
  onDelete: (id: string) => void;
  onUpdate?: (updatedContact: Contact) => void;
}) => {
  // Get a reliable board_id - first check URL params, then contact itself, then look for board object
  const params = useParams();
  const dispatch = useAppDispatch();
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const { firstName, lastName } = useAppSelector((state) => state.user);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [contactWithCompanies, setContactWithCompanies] = useState(contact);
  // Try to get board_id from multiple sources, prioritizing the most reliable
  const board_id = params.board_id
    ? Array.isArray(params.board_id)
      ? params.board_id[0]
      : params.board_id
    : undefined; // Don't set a default here - we'll prioritize the contact's own boardId

  // Ensure the contact has a boardId property (for when editing from main contacts page)
  useEffect(() => {
    if (contact && !contact.boardId) {
      // If the contact does not have a boardId, you may want to handle this case
      // For now, we just leave it as is, or you can set a default/fallback if needed
    }
  }, [contact]);

  // Helper to check if value is truly empty (handles undefined, null, empty string, and literal "undefined")
  const isEmptyValue = (value: any): boolean => {
    return !value || value === 'undefined' || value.toString().trim() === '';
  };

  // Memoized formatter functions for better performance
  const formatTextWithEllipsis = useCallback((text: string, maxLength = 22) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }, []);

  const formatList = useCallback(
    (items: any[] | undefined, propertyName: string) => {
      if (!items || items.length === 0) return 'none';
      const joinedText = items.map((item) => item[propertyName]).join(', ');
      return formatTextWithEllipsis(joinedText);
    },
    [formatTextWithEllipsis],
  );

  // Memoized company name display
  const displayedCompanyNames = useMemo(() => {
    if (companyNames.length === 0) return 'none';
    return formatTextWithEllipsis(companyNames.join(', '));
  }, [companyNames, formatTextWithEllipsis]);
  // Update local state when contact prop changes
  useEffect(() => {
    setContactWithCompanies(contact);
  }, [contact]);
  useEffect(() => {
    const getCurrentContact = async () => {
      try {
        // Initialize effectiveBoardId with the current board_id we have
        let effectiveBoardId = board_id;
        // Option 1: If companies data is already available in the contact, use it
        if (contact.companies && contact.companies.length > 0) {
          const names = contact.companies.map(
            (company: { name: string }) => company.name,
          );
          setCompanyNames(names);
          setContactWithCompanies(contact);
          return;
        }

        // Option 2: Try to get company names from job applications
        if (contact.jobApplications && contact.jobApplications.length > 0) {
          const companiesFromJobs = contact.jobApplications
            .filter((job) => job.company?.name)
            .map((job) => job.company.name);

          if (companiesFromJobs.length > 0) {
            setCompanyNames(Array.from(new Set(companiesFromJobs)));
            return;
          }
        } // Option 3: Try to get contact details with boardId
        // If we don't have a board_id yet, try to find one from the boards
        if (!effectiveBoardId) {
          try {
            // Try to fetch the first board as default
            const boards = await dispatch(getBoardsOnly()).unwrap();
            if (boards && boards.length > 0) {
              // Sort by creation date to get the first created board
              const sortedBoards = [...boards].sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime(),
              );
              // Use the first board (likely "Job Search YYYY")
              effectiveBoardId = sortedBoards[0].id;
            }
          } catch (boardError) {
            console.error('Error fetching default board:', boardError);
          }
        }

        // Only proceed with API call if we have a boardId
        if (effectiveBoardId) {
          const value = {
            contactId: contact.id,
            boardId: effectiveBoardId,
          };

          try {
            const contactData = await dispatch(getContact(value)).unwrap();
            if (contactData[0]?.companies?.length > 0) {
              const names = contactData[0].companies.map(
                (company: { name: string }) => company.name,
              );
              setCompanyNames(names);
              setContactWithCompanies(contactData[0]);
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
  }, [dispatch, board_id, contact]);
  const handleEditContact = () => {
    setShowContactModal(true);
    setOpenDropdownId(null);
  };

  const handleDeleteContact = () => {
    dispatch(
      deleteContact(contact.id),
    )
      .unwrap()
      .then(() => {
        onDelete(contact.id);
      })
      .catch((error) => {
        console.error('Failed to delete contact:', error);
        // Optionally show user-friendly error message
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
      rel="noopener noreferrer"
      href={url?.trim() ? url : '#'}
      className={
        url?.trim()
          ? 'text-blue-500 hover:cursor-pointer'
          : 'text-gray-400 cursor-not-allowed'
      }
    >
      <Icon className="size-6" />
    </Link>
  );

  return (
    <div className="w-[268px]">
      <div className="flex flex-col gap-1 border border-gray-200 rounded-md">
        <div className="flex justify-between px-2 mt-2 items-start">
          <div className="flex justify-start gap-4 items-center overflow-hidden">
            <Image
              width={50}
              height={50}
              alt="Contact photo"
              className="rounded-lg object-cover flex-shrink-0"
              src={contact.photoUrl || '/images/Yuriy.jpg'}
            />
            <div className="flex flex-col items-start justify-center text-sm overflow-hidden flex-1">
              <p
                className="font-bold truncate w-full"
                title={`${isEmptyValue(contact.firstName) ? '' : contact.firstName} ${isEmptyValue(contact.lastName) ? '' : contact.lastName}`.trim()}
              >
                {(() => {
                  const firstName = isEmptyValue(contact.firstName)
                    ? ''
                    : contact.firstName;
                  const lastName = isEmptyValue(contact.lastName)
                    ? ''
                    : contact.lastName;
                  const fullName = `${firstName} ${lastName}`.trim();
                  return fullName || 'Unknown';
                })()}
              </p>
              <p
                className="font-semibold text-muted-foreground truncate w-full"
                title={isEmptyValue(contact.jobTitle) ? '' : contact.jobTitle}
              >
                {isEmptyValue(contact.jobTitle) ? 'No title' : contact.jobTitle}
              </p>
              <p className="text-sm text-muted-foreground truncate w-full">
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
              {' '}
              <DropdownMenuItem
                className="rsw-dropdown-menu-item"
                onClick={() => handleEditContact()}
              >
                Edit Contact
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div
                onClick={(e) => e.stopPropagation()}
                className="rsw-dropdown-menu-item"
              >
                {' '}
                <AlertDialogModal
                  isFormValid={true}
                  cleanupType="contact"
                  buttonCancel="Cancel"
                  buttonVariant="ghost"
                  buttonConfirm="Delete"
                  destructiveVariant={true}
                  dialogTitle="Delete Contact"
                  buttonLabel="Delete Contact"
                  actionFunction={() => handleDeleteContact()}
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
      </div>{' '}
      <CreateContactModal
        showButton={false}
        buttonConfirm="Update"
        buttonLabel="Edit Contact"
        dialogTitle="Edit Contact"
        isVisible={showContactModal}
        userContactsPage={!board_id} // If no board_id in URL, we're on main contacts page
        contactToEdit={contactWithCompanies}
        onClose={() => setShowContactModal(false)}
        onContactUpdated={(updatedContact) => {
          // Call onUpdate if provided, otherwise remove and refetch
          if (onUpdate) {
            // Update local state first for immediate UI update
            setContactWithCompanies(updatedContact);
            // Then call parent component's update function
            onUpdate(updatedContact);
          } else {
            onDelete(contact.id);
          }
        }}
      />
    </div>
  );
};

export default ContactCard;
