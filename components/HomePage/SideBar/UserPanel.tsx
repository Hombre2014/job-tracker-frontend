import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { RiAccountPinBoxLine, RiSettings2Line } from 'react-icons/ri';

import { useAuth } from '@/components/auth/AuthProvider';
import { useAppSelector } from '@/redux/hooks';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserPanel = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { firstName, lastName, profilePicUrl } = useAppSelector(
    (state) => state.user
  );

  const userLogout = async () => {
    await logout(); // AuthProvider handles cleanup and redirect
  };

  const userSettings = () => {
    router.push('/home/settings');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex justify-between items-center border border-slate-400 rounded-md p-2 mb-6 mx-2 cursor-pointer dark:border-slate-500 dark:text-white">
          <div className="flex items-center gap-2">
            {profilePicUrl ? (
              <Image
                src={profilePicUrl}
                alt="User profile"
                width={20}
                height={20}
                className="h-5 w-5 rounded-full object-cover"
              />
            ) : (
              <RiAccountPinBoxLine className="h-5 w-5" />
            )}
            <p>
              {firstName} {lastName}
            </p>
          </div>
          <div>
            <RiSettings2Line className="h-5 w-5" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={userLogout}>Log out</DropdownMenuItem>
        <DropdownMenuItem onClick={userSettings}>
          Personal Account Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserPanel;
