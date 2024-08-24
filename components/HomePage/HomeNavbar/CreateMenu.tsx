import { RiContactsLine } from 'react-icons/ri';
import { PiBriefcaseLight } from 'react-icons/pi';

import AlertDialogModal from '../Boards/AlertDialogModal';
import AddJobShortForm from '@/components/Forms/AddJobShort/AddJobShortForm';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const createJobApplication = () => {
  document
    .querySelector('#close-the-mother')!
    .children[0].children[0].children[0].children[0].children[0].click();
};

const CreateMenu = () => {
  return (
    <div id="close-the-mother" className="flex gap-4 mr-4 items-center">
      <NavigationMenu className="mr-4">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="!bg-blue-500 !text-white">
              + Create
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-blue-500 p-2">
              <ul>
                <li>
                  <div className="flex items-center py-2 px-4 mt-1 cursor-pointer hover:bg-blue-400 rounded-md text-white">
                    <AlertDialogModal
                      buttonLabel={
                        <>
                          <PiBriefcaseLight />
                          <span className="ml-2">Job</span>
                        </>
                      }
                      buttonVariant="none"
                      dialogTitle="Add Job"
                      buttonCancel="Discard"
                      buttonConfirm="Save Job"
                      actionFunction={createJobApplication}
                      stylings="m-0 p-0 !items-left rounded-md hover:bg-blue-400 cursor-pointer inline-flex"
                    >
                      <AddJobShortForm columnOrder={0} />
                    </AlertDialogModal>
                  </div>
                </li>
                <li>
                  <NavigationMenuLink className="flex items-center py-2 px-4 cursor-pointer hover:bg-blue-400 rounded-md mb-1 text-white">
                    <RiContactsLine />
                    <span className="ml-2">Contact</span>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default CreateMenu;
