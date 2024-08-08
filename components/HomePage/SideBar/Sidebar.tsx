'use client';

import { RiContactsLine, RiFolder2Line } from 'react-icons/ri';

import JobBoard from './JobBoard';
import UserPanel from './UserPanel';
import JobTrackers from './JobTrackers';
import SideBarMenuItem from './SideBarMenuItem';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full justify-between border-r border-slate-200 text-[14px]">
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-2 border-b min-w-full border-slate-200 h-[120px] pt-6 pl-2">
          <SideBarMenuItem linkName="Contacts" icon={<RiContactsLine />} />
          <SideBarMenuItem linkName="Documents" icon={<RiFolder2Line />} />
        </div>
        <div className="border-b border-slate-200 h-auto pb-6">
          <JobTrackers />
          <JobBoard />
        </div>
      </div>
      <UserPanel />
    </div>
  );
};

export default Sidebar;
