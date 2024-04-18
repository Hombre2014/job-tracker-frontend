'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiContactsLine,
  RiFolder2Line,
  RiQuestionMark,
  RiAddBoxLine,
  RiAccountPinBoxLine,
  RiDeleteBinLine,
  RiSettings2Line,
} from 'react-icons/ri';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/user/userThunk';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const [showTrash, setShowTrash] = useState(false);
  const router = useRouter();
  const { status } = useAppSelector((state) => state.user);

  console.log('Status from Sidebar.tsx:', status);

  const toggleTrashIcon = () => {
    setTimeout(() => {
      setShowTrash((prev) => !prev);
    }, 300);
  };

  const userLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className="flex flex-col h-full justify-between border-r border-slate-200 text-[14px]">
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-2 border-b min-w-full border-slate-200 h-[120px] pt-6 pl-2">
          <div className="flex items-center gap-2 py-2 cursor-pointer hover:bg-slate-100 pl-2 mr-2 rounded-md hover:text-slate-700">
            <RiContactsLine className="h-5 w-5" />
            <p>Contacts</p>
          </div>
          <div className="flex items-center gap-2 py-2 cursor-pointer hover:bg-slate-100 pl-2 mr-2 rounded-md hover:text-slate-700">
            <RiFolder2Line className="h-5 w-5" />
            <p>Documents</p>
          </div>
        </div>
        <div className="border-b border-slate-200 h-[120px]">
          <div className="flex justify-between items-center pl-4 mt-4">
            <div className="flex items-center gap-1">
              <p className="hover:underline mr-1">
                <Link href="/boards">My Job Tracker</Link>
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <RiQuestionMark className="h-5 w-5 border rounded-md p-[1px] dark:border-slate-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Your personal job search tracking boards. Each board
                      represents a different search throughout your career.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mr-2 cursor-pointer">
              <RiAddBoxLine className="h-5 w-5 hover:transform hover:scale-110 transition duration-300 delay-100" />
            </div>
          </div>
          <div
            className="flex justify-between items-center border border-slate-400 rounded-md bg-slate-200 p-2 mt-4 mx-2 cursor-pointer dark:bg-slate-700 dark:border-slate-500 dark:text-white"
            onMouseEnter={toggleTrashIcon}
            onMouseLeave={toggleTrashIcon}
          >
            <div className="flex items-center gap-1">
              <RiAccountPinBoxLine className="h-5 w-5" />
              <p>Job Search 2024</p>
            </div>
            <div>
              {showTrash ? <RiDeleteBinLine className="h-5 w-5" /> : null}
            </div>
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex justify-between items-center border border-slate-400 rounded-md p-2 mb-6 mx-2 cursor-pointer dark:border-slate-500 dark:text-white">
            <div className="flex items-center gap-1">
              <RiAccountPinBoxLine className="h-5 w-5" />
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
    </div>
  );
};

export default Sidebar;
