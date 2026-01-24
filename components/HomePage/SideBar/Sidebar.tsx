'use client';

import Link from 'next/link';
import { GoPersonAdd } from 'react-icons/go';
import { usePathname } from 'next/navigation';
import { RiFolder2Line } from 'react-icons/ri';
import {
  HiOutlineMail,
  HiOutlineInformationCircle,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi';

import JobBoard from './JobBoard';
import UserPanel from './UserPanel';
import JobTrackers from './JobTrackers';
import SideBarMenuItem from './SideBarMenuItem';
import { ModeToggle } from '@/components/Themes/mode-toggle';
import { cn } from '@/lib/utils';

// Custom component for Help menu items that link to root-level pages
const HelpMenuItem = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 pl-2 mr-2 rounded-md dark:text-white',
        isActive
          ? 'border border-blue-500 bg-blue-300/30 dark:bg-blue-600/40 hover:bg-blue-300/30 dark:hover:bg-blue-600/40'
          : '',
      )}
    >
      <div
        className={cn(
          'h-5 w-5 flex items-center dark:text-white text-[20px]',
          isActive ? 'text-blue-500 dark:text-blue-400' : '',
        )}
      >
        {icon}
      </div>
      <p>{label}</p>
    </Link>
  );
};

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
        <div className="border-b border-slate-200 dark:border-slate-700 h-auto py-6 pl-2">
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 pl-2">
              Help
            </div>
            <HelpMenuItem
              href="/about"
              icon={<HiOutlineInformationCircle />}
              label="About"
            />
            <HelpMenuItem
              href="/contact-us"
              icon={<HiOutlineMail />}
              label="Contact Us"
            />
            <HelpMenuItem
              href="/how-to"
              icon={<HiOutlineQuestionMarkCircle />}
              label="How to?"
            />
          </div>
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
