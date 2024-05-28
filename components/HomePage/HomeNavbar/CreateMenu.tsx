import { RiContactsLine } from 'react-icons/ri';
import { PiBriefcaseLight } from 'react-icons/pi';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const CreateMenu = () => {
  return (
    <div className="flex gap-4 mr-4 items-center">
      <NavigationMenu className="mr-4">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="!bg-blue-500 !text-white">
              + Create
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-blue-500 p-2">
              <NavigationMenuLink className="flex items-center py-2 px-4 mt-1 cursor-pointer hover:bg-blue-400 rounded-md text-white">
                <PiBriefcaseLight />
                <span className="ml-2">Job</span>
              </NavigationMenuLink>
              <NavigationMenuLink className="flex items-center py-2 px-4 cursor-pointer hover:bg-blue-400 rounded-md mb-1 text-white">
                <RiContactsLine />
                <span className="ml-2">Contact</span>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default CreateMenu;
