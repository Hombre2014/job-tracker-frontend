import { GoTrophy } from 'react-icons/go';
import { SlBriefcase } from 'react-icons/sl';
import { PiBriefcaseLight } from 'react-icons/pi';
import { HiOutlineThumbDown } from 'react-icons/hi';
import { SlEnvolopeLetter, SlMagicWand } from 'react-icons/sl';
import { RiContactsLine, RiFolder2Line } from 'react-icons/ri';
import { BoardIcons, MenuIcons } from '@/enums';

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
