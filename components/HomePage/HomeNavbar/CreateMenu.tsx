import { useState } from 'react';
import { GoPersonAdd } from 'react-icons/go';
import { PiBriefcaseLight } from 'react-icons/pi';
import { useParams, useRouter, usePathname } from 'next/navigation';

import { useAppDispatch } from '@/redux/hooks';
import { createJobPost } from '@/redux/jobs/jobsThunk';
import { getBoards } from '@/redux/boards/boardsThunk';
import { cleanupAfterContact, cleanupAfterJobPost } from '@/utils/helpers';
import AddJobShortForm from '@/components/Forms/AddJobShort/AddJobShortForm';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import CreateContactForm from '@/components/Forms/AddContact/CreateContactForm';
import {
  createContact,
  assignContactToJobPost,
  getAllContactsPerBoard,
} from '@/redux/contacts/contactsThunk';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const CreateMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [, setIsMenuOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const createJobApplication = () => {
    if (!isFormValid) return;

    setShowJobModal(false);

    const jobPost = {
      jobPostStatus: 'Job Created',
      accessToken: accessToken as string,
      title: localStorage.getItem('jobTitle'),
      columnId: localStorage.getItem('columnId'),
      companyId: localStorage.getItem('companyId'),
    };

    dispatch(createJobPost(jobPost)).then((result) => {
      const newJobPostId = result.payload.id;
      router.push(`/home/boards/${board_id}/job/${newJobPostId}/job-details`);
    });
    dispatch(getBoards(accessToken as string));

    cleanupAfterJobPost();
  };

  const createNewContact = async () => {
    if (!isFormValid) return;

    setShowContactModal(false);

    const values = {
      accessToken,
      boardId: board_id,
      comment: localStorage.getItem('comment'),
      jobTitle: localStorage.getItem('jobTitle'),
      lastName: localStorage.getItem('lastName'),
      location: localStorage.getItem('location'),
      photoUrl: localStorage.getItem('photoUrl'),
      firstName: localStorage.getItem('firstName'),
      githubUrl: localStorage.getItem('githubUrl'),
      twitterUrl: localStorage.getItem('twitterUrl'),
      linkedinUrl: localStorage.getItem('linkedinUrl'),
      facebookUrl: localStorage.getItem('facebookUrl'),
      emails: JSON.parse(localStorage.getItem('emails') || '[]'),
      phones: JSON.parse(localStorage.getItem('phones') || '[]'),
      companyIds: JSON.parse(localStorage.getItem('companyIds') || '[]'),
    };

    try {
      const result = await dispatch(createContact(values)).unwrap();
      const newContactId = result.id;
      localStorage.setItem('contactId', newContactId);

      // Get job posts connected to contact from localStorage
      const jobsConnectedToContact = JSON.parse(
        localStorage.getItem('jobsConnectedToContact') || '[]'
      );

      // Assign contact to all connected jobs
      if (jobsConnectedToContact.length > 0) {
        await Promise.all(
          jobsConnectedToContact.map(async (jobPost: JobApplication) => {
            const assignData = {
              accessToken,
              contactId: newContactId,
              jobApplicationId: jobPost.id,
            };
            await dispatch(assignContactToJobPost(assignData)).unwrap();
          })
        );
      }

      // Fetch all contacts for the board
      await dispatch(
        getAllContactsPerBoard({ accessToken, boardId: board_id })
      ).unwrap();

      // If we're on the contacts page, force a refresh by navigating to the same route
      if (pathname.includes('/contacts')) {
        router.refresh();
      }

      // Clear local storage
      cleanupAfterContact();
    } catch (error) {
      console.error('Error creating/assigning contact:', error);
    }
  };

  return (
    <div id="close-dropdown" className="flex gap-4 mr-4 items-center">
      <NavigationMenu className="mr-4">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="!bg-blue-500 !text-white">
              + Create
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-blue-500 p-2">
              <ul>
                <li>
                  <div
                    className="flex items-center px-4 mt-1 py-2 cursor-pointer hover:bg-blue-400 rounded-md text-white"
                    onClick={() => {
                      setShowJobModal(true);
                      setIsFormValid(false);
                    }}
                  >
                    <PiBriefcaseLight />
                    <span className="ml-2 text-base">Job</span>
                  </div>
                </li>
                <li>
                  <div
                    className="flex items-center py-2 px-4 cursor-pointer hover:bg-blue-400 rounded-md mb-1 text-white"
                    onClick={() => {
                      setShowContactModal(true);
                      setIsFormValid(false);
                    }}
                  >
                    <GoPersonAdd />
                    <span className="ml-2 text-base">Contact</span>
                  </div>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {showJobModal && (
        <AlertDialogModal
          open={showJobModal}
          buttonVariant="none"
          dialogTitle="Add Job"
          buttonCancel="Discard"
          buttonConfirm="Save Job"
          isFormValid={isFormValid}
          actionFunction={createJobApplication}
          onOpenChange={(open) => {
            setShowJobModal(open);
            if (!open) setIsMenuOpen(false);
          }}
        >
          <AddJobShortForm
            columnOrder={0}
            onValidationChange={setIsFormValid}
          />
        </AlertDialogModal>
      )}

      {showContactModal && (
        <AlertDialogModal
          buttonVariant="none"
          buttonCancel="Discard"
          buttonConfirm="Create"
          open={showContactModal}
          isFormValid={isFormValid}
          contentWidth="!max-w-[900px]"
          dialogTitle="Save New Contact"
          actionFunction={createNewContact}
          onOpenChange={(open) => {
            setShowContactModal(open);
            if (!open) setIsMenuOpen(false);
          }}
        >
          <CreateContactForm
            defaultJobPost={false}
            onValidationChange={setIsFormValid}
          />
        </AlertDialogModal>
      )}
    </div>
  );
};

export default CreateMenu;
