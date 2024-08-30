import { SlBriefcase } from 'react-icons/sl';
import { PiBriefcaseLight } from 'react-icons/pi';
import { GoTrophy, GoInbox } from 'react-icons/go';
import { BoardIcons, MenuIcons, JobPostIcons } from '@/enums';
import { SlEnvolopeLetter, SlMagicWand } from 'react-icons/sl';
import { RiContactsLine, RiFolder2Line } from 'react-icons/ri';
import {
  HiOutlineThumbDown,
  HiOutlinePlusCircle,
  HiOutlineClock,
  HiOutlineFolder,
} from 'react-icons/hi';

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
      return <PiBriefcaseLight />;
    case JobPostIcons.HiOutlinePlusCircle:
      return <HiOutlinePlusCircle />;
    case JobPostIcons.HiOutlineClock:
      return <HiOutlineClock />;
    case JobPostIcons.HiOutlineFolder:
      return <HiOutlineFolder />;
    case JobPostIcons.GoInbox:
      return <GoInbox />;
    case JobPostIcons.GoTrophy:
      return <GoTrophy />;
    default:
      return null;
  }
};
