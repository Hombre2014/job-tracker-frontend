import { SlBriefcase, SlNotebook } from 'react-icons/sl';
import { PiBriefcaseLight, PiUsers } from 'react-icons/pi';
import { GoTrophy, GoInbox } from 'react-icons/go';
import { BoardIcons, MenuIcons, JobPostIcons, JobPostMenuItems } from '@/enums';
import { SlEnvolopeLetter, SlMagicWand } from 'react-icons/sl';
import { RiContactsLine, RiFolder2Line } from 'react-icons/ri';
import {
  HiOutlineThumbDown,
  HiOutlinePlusCircle,
  HiOutlineClock,
  HiOutlineFolder,
} from 'react-icons/hi';
import { RxInfoCircled } from 'react-icons/rx';
import { IoDocumentsOutline } from 'react-icons/io5';

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
    case MenuIcons.RiContactsLine:
      return <RiContactsLine />;
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
      return <PiBriefcaseLight className="h-6 w-6" />;
    case JobPostIcons.HiOutlinePlusCircle:
      return <HiOutlinePlusCircle className="h-6 w-6" />;
    case JobPostIcons.HiOutlineClock:
      return <HiOutlineClock className="h-6 w-6" />;
    case JobPostIcons.HiOutlineFolder:
      return <HiOutlineFolder className="h-6 w-6" />;
    case JobPostIcons.GoInbox:
      return <GoInbox className="h-6 w-6" />;
    case JobPostIcons.GoTrophy:
      return <GoTrophy className="h-6 w-6" />;
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
