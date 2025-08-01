'use client';

import { GoPersonAdd } from 'react-icons/go';
import { RiFolder2Line } from 'react-icons/ri';

import JobBoard from './JobBoard';
import UserPanel from './UserPanel';
import JobTrackers from './JobTrackers';
import SideBarMenuItem from './SideBarMenuItem';
import { ModeToggle } from '@/components/Themes/mode-toggle';



const Sidebar = () => {
  return (
    <div className="flex flex-col h-full justify-between border-r border-slate-200 dark:border-slate-700 text-[14px] dark:bg-slate-900">
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-2 border-b min-w-full border-slate-200 dark:border-slate-700 h-[120px] pt-6 pl-2">
          <SideBarMenuItem linkName="Contacts" icon={<GoPersonAdd />} />
          <SideBarMenuItem linkName="Documents" icon={<RiFolder2Line />} />
        </div>
        <div className="border-b border-slate-200 dark:border-slate-700 h-auto pb-6">
          <JobTrackers />
          <JobBoard />
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-700 p-2">
        <div className="flex items-center gap-3">
          <ModeToggle />
          <span className="text-sm dark:text-white">Theme</span>
        </div>
      </div>
      <UserPanel />
    </div>
  );
};

export default Sidebar;
