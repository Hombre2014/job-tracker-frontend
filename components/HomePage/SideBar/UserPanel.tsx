import { useRouter } from 'next/navigation';
import { RiAccountPinBoxLine, RiSettings2Line } from 'react-icons/ri';

import { useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/user/userThunk';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserPanel = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const userLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex justify-between items-center border border-slate-400 rounded-md p-2 mb-6 mx-2 cursor-pointer dark:border-slate-500 dark:text-white">
          <div className="flex items-center gap-1">
            <RiAccountPinBoxLine className="h-5 w-5" />
            {/* TODO: Below line is about user's name. Resolve it! */}
            <p>John Doe</p>
          </div>
          <div>
            <RiSettings2Line className="h-5 w-5" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={userLogout}>Log out</DropdownMenuItem>
        <DropdownMenuItem>Personal Account Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserPanel;
