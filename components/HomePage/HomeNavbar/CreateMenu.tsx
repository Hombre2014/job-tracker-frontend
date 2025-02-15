import { useState } from 'react';
import { GoPersonAdd } from 'react-icons/go';
import { PiBriefcaseLight } from 'react-icons/pi';
import { useParams, useRouter } from 'next/navigation';

import { useAppDispatch } from '@/redux/hooks';
import { createJobPost } from '@/redux/jobs/jobsThunk';
import { getBoards } from '@/redux/boards/boardsThunk';
import AlertDialogModal from '../Boards/AlertDialogModal';
import AddJobShortForm from '@/components/Forms/AddJobShort/AddJobShortForm';
import CreateContactForm from '@/components/Forms/AddContact/CreateContactForm';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const CreateMenu = () => {
  const router = useRouter();
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
    localStorage.setItem('boardValueChanged', 'false');
    localStorage.removeItem('jobTitle');
    localStorage.removeItem('company');
  };

  const createContact = () => {
    if (!isFormValid) return;

    setShowContactModal(false);

    // TODO: Implement contact creation
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
          actionFunction={createContact}
          onOpenChange={(open) => {
            setShowContactModal(open);
            if (!open) setIsMenuOpen(false);
          }}
        >
          <CreateContactForm onValidationChange={setIsFormValid} />
        </AlertDialogModal>
      )}
    </div>
  );
};

export default CreateMenu;
