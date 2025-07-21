import { RxInfoCircled } from 'react-icons/rx';
import { RiFolder2Line } from 'react-icons/ri';
import { IoDocumentsOutline } from 'react-icons/io5';
import { PiBriefcaseLight, PiUsers } from 'react-icons/pi';
import { GoTrophy, GoInbox, GoPersonAdd } from 'react-icons/go';
import { SlEnvolopeLetter, SlMagicWand, SlBriefcase } from 'react-icons/sl';
import {
  HiOutlineThumbDown,
  HiOutlinePlusCircle,
  HiOutlineClock,
  HiOutlineFolder,
} from 'react-icons/hi';

import { BoardIcons, MenuIcons, JobPostIcons, JobPostMenuItems } from '@/enums';
import Notes from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobNotes/Notes';
import JobInfo from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobEdit/JobInfo';
import Company from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobCompany/Company';
import Contacts from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobContacts/Contacts';
import Documents from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobDocuments/Documents';

export const returnBoardIcon = (id: number) => {
  switch (id) {
    case BoardIcons.SlMagicWand:
      return <SlMagicWand className="w-8 h-8" />;
    case BoardIcons.SlEnvolopeLetter:
      return <SlEnvolopeLetter className="w-8 h-8" />;
    case BoardIcons.SlBriefcase:
      return <SlBriefcase className="w-8 h-8" />;
    case BoardIcons.GoTrophy:
      return <GoTrophy className="w-8 h-8" />;
    case BoardIcons.HiOutlineThumbDown:
      return <HiOutlineThumbDown className="w-8 h-8" />;
    default:
      return null;
  }
};

export const returnMenuIcon = (icon: string) => {
  switch (icon) {
    case MenuIcons.GoPersonAdd:
      return <GoPersonAdd />;
    case MenuIcons.RiFolder2Line:
      return <RiFolder2Line />;
    case MenuIcons.PiBriefcaseLight:
      return <PiBriefcaseLight />;
    default:
      return null;
  }
};

export const returnJobPostIcon = (icon: string) => {
  switch (icon) {
    case JobPostIcons.PiBriefcaseLight:
      return <PiBriefcaseLight className="h-5 w-5" />;
    case JobPostIcons.HiOutlinePlusCircle:
      return <HiOutlinePlusCircle className="h-5 w-5" />;
    case JobPostIcons.HiOutlineClock:
      return <HiOutlineClock className="h-5 w-5" />;
    case JobPostIcons.HiOutlineFolder:
      return <HiOutlineFolder className="h-5 w-5" />;
    case JobPostIcons.GoInbox:
      return <GoInbox className="h-5 w-5" />;
    case JobPostIcons.GoTrophy:
      return <GoTrophy className="h-5 w-5" />;
    default:
      return null;
  }
};

export const returnJobPostMenuIcon = (icon: string) => {
  switch (icon) {
    case JobPostMenuItems.JobInfo:
      return <RxInfoCircled className="h-5 w-5 mr-2" />;
    case JobPostMenuItems.Notes:
      return <IoDocumentsOutline className="h-5 w-5 mr-2" />;
    case JobPostMenuItems.Contacts:
      return <PiUsers className="h-5 w-5 mr-2" />;
    case JobPostMenuItems.Documents:
      return <IoDocumentsOutline className="h-5 w-5 mr-2" />;
    case JobPostMenuItems.Company:
      return <SlBriefcase className="h-5 w-5 mr-2" />;
    default:
      return null;
  }
};

export const returnMenuComponent = (title: string) => {
  switch (title) {
    case 'Job Info':
      return <JobInfo />;
    case 'Notes':
      return <Notes />;
    case 'Contacts':
      return <Contacts />;
    case 'Documents':
      return <Documents />;
    case 'Company':
      return <Company />;
    default:
      return null;
  }
};
