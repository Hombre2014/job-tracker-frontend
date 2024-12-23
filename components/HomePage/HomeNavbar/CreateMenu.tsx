import { useState } from 'react';
import { RiContactsLine } from 'react-icons/ri';
import { PiBriefcaseLight } from 'react-icons/pi';

import { useAppDispatch } from '@/redux/hooks';
import { createJobPost } from '@/redux/jobs/jobsThunk';
import AlertDialogModal from '../Boards/AlertDialogModal';
import AddJobShortForm from '@/components/Forms/AddJobShort/AddJobShortForm';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const CreateMenu = () => {
  const dispatch = useAppDispatch();
  const [isFormValid, setIsFormValid] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const [showJobModal, setShowJobModal] = useState(false);
  const clearDropDown = () => {
    const element = document.querySelector('#close-dropdown')!.children[0]
      .children[0].children[0].children[0].children[0] as HTMLElement;

    element.click();
  };

  const createJobApplication = () => {
    if (!isFormValid) return;

    clearDropDown();

    const jobPost = {
      jobPostStatus: 'Job Created',
      accessToken: accessToken as string,
      title: localStorage.getItem('jobTitle'),
      columnId: localStorage.getItem('columnId'),
      companyName: localStorage.getItem('company'),
    };

    dispatch(createJobPost(jobPost));
  };

  const createContact = () => {
    clearDropDown();

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
                    className="flex items-center px-4 mt-1 pb-1 cursor-pointer hover:bg-blue-400 rounded-md text-white"
                    onClick={() => setShowJobModal(true)}
                  >
                    <PiBriefcaseLight />
                    <span className="ml-2 text-base">Job</span>
                  </div>
                </li>
                <li>
                  <NavigationMenuLink className="flex items-center py-2 px-4 cursor-pointer hover:bg-blue-400 rounded-md mb-1 text-white">
                    <RiContactsLine />
                    <span className="ml-2 text-base" onClick={createContact}>
                      Contact
                    </span>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {showJobModal && (
        <AlertDialogModal
          buttonLabel="" // Remove the buttonLabel since we don't need a trigger button
          buttonVariant="none"
          dialogTitle="Add Job"
          buttonCancel="Discard"
          buttonConfirm="Save Job"
          isFormValid={isFormValid}
          actionFunction={createJobApplication}
          open={showJobModal} // Add this prop
          onOpenChange={setShowJobModal} // Add this prop
        >
          <AddJobShortForm
            columnOrder={0}
            onValidationChange={setIsFormValid}
          />
        </AlertDialogModal>
      )}
    </div>
  );
};

export default CreateMenu;
