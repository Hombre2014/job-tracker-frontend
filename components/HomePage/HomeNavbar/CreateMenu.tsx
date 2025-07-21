import { useState } from 'react';
import { GoPersonAdd } from 'react-icons/go';
import { PiBriefcaseLight } from 'react-icons/pi';
import { useParams, useRouter, usePathname } from 'next/navigation';

import { useAppDispatch } from '@/redux/hooks';
import { createJobPost } from '@/redux/jobs/jobsThunk';
import { getBoards, getBoardsOnly } from '@/redux/boards/boardsThunk';
import { cleanupAfterContact, cleanupAfterJobPost } from '@/utils/helpers';
import AddJobShortForm from '@/components/Forms/AddJobShort/AddJobShortForm';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import CreateContactForm from '@/components/Forms/AddContact/CreateContactForm';
import {
  createContact,
  updateContact,
  uploadContactImage,
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
  const isContactsPage = pathname?.includes('/home/contacts');
  const [showContactModal, setShowContactModal] = useState(false);
  const [pendingImage, setPendingImage] = useState<File | null>(null);

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

    // Get raw emails/phones from localStorage
    const rawEmails = JSON.parse(localStorage.getItem('emails') || '[]');
    const rawPhones = JSON.parse(localStorage.getItem('phones') || '[]');

    // Transform to backend format for create
    const emails = rawEmails
      .filter((e: any) => e.value || e.email)
      .map((e: any) => ({
        id: e.id,
        type: e.type,
        email: e.email ?? e.value,
      }));
    const phones = rawPhones
      .filter((p: any) => p.value || p.phone)
      .map((p: any) => ({
        id: p.id,
        type: p.type,
        phone: p.phone ?? p.value,
      })); // Convert empty social media links to null
    const githubUrl = localStorage.getItem('githubUrl') || null;
    const twitterUrl = localStorage.getItem('twitterUrl') || null;
    const linkedinUrl = localStorage.getItem('linkedinUrl') || null;
    const facebookUrl = localStorage.getItem('facebookUrl') || null;

    // Get the boardId - if no board_id is available, fetch default board
    let effectiveBoardId = board_id;
    if (!effectiveBoardId) {
      try {
        // Get all boards and use the first one (default "Job Search" board)
        const boards = await dispatch(
          getBoardsOnly(accessToken as string)
        ).unwrap();
        if (boards && boards.length > 0) {
          // Sort by creation date to get the first created board
          const sortedBoards = [...boards].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          // Use the first board (likely "Job Search YYYY")
          effectiveBoardId = sortedBoards[0].id;
        }
      } catch (error) {
        console.error('Error fetching default board:', error);
      }
    }

    const values = {
      emails,
      phones,
      accessToken,
      boardId: effectiveBoardId,
      comment: localStorage.getItem('comment'),
      jobTitle: localStorage.getItem('jobTitle'),
      lastName: localStorage.getItem('lastName'),
      location: localStorage.getItem('location'),
      photoUrl: localStorage.getItem('photoUrl'),
      firstName: localStorage.getItem('firstName'),
      githubUrl: githubUrl === '' ? null : githubUrl,
      twitterUrl: twitterUrl === '' ? null : twitterUrl,
      linkedinUrl: linkedinUrl === '' ? null : linkedinUrl,
      facebookUrl: facebookUrl === '' ? null : facebookUrl,
      companyIds: JSON.parse(localStorage.getItem('companyIds') || '[]'),
    };
    try {
      const result = await dispatch(createContact(values)).unwrap();
      const newContactId = result.id;
      localStorage.setItem('contactId', newContactId);

      // If user uploaded a photo, upload it and update the contact
      if (pendingImage) {
        const uploadImageResult = await dispatch(
          uploadContactImage({
            file: pendingImage,
            contactId: newContactId,
            accessToken: accessToken as string,
          })
        ).unwrap();

        await dispatch(
          updateContact({
            id: newContactId,
            boardId: board_id,
            photoUrl: uploadImageResult.imageUrl,
            accessToken: accessToken as string,
          })
        ).unwrap();
      }

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
      } // Fetch all contacts for the board
      await dispatch(
        getAllContactsPerBoard({ accessToken, boardId: board_id })
      ).unwrap();

      // Redirect to the contacts page to show the newly created contact
      router.push(`/home/boards/${board_id}/contacts`);

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
            setPendingImage={setPendingImage}
            isUserContactsPage={isContactsPage}
            onValidationChange={setIsFormValid}
            jobsConnectedToContact={JSON.parse(
              localStorage.getItem('jobsConnectedToContact') || '[]'
            )}
            setJobsConnectedToContact={(jobs: any) =>
              localStorage.setItem(
                'jobsConnectedToContact',
                JSON.stringify(jobs)
              )
            }
          />
        </AlertDialogModal>
      )}
    </div>
  );
};

export default CreateMenu;
