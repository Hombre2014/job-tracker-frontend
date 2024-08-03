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
      return <SlMagicWand />;
    case BoardIcons.SlEnvolopeLetter:
      return <SlEnvolopeLetter />;
    case BoardIcons.SlBriefcase:
      return <SlBriefcase />;
    case BoardIcons.GoTrophy:
      return <GoTrophy />;
    case BoardIcons.HiOutlineThumbDown:
      return <HiOutlineThumbDown />;
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
