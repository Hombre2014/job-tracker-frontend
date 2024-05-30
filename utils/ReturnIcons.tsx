import { GoTrophy } from 'react-icons/go';
import { SlBriefcase } from 'react-icons/sl';
import { PiBriefcaseLight } from 'react-icons/pi';
import { HiOutlineThumbDown } from 'react-icons/hi';
import { SlEnvolopeLetter, SlMagicWand } from 'react-icons/sl';
import { RiContactsLine, RiFolder2Line } from 'react-icons/ri';

export const returnBoardIcon = (id: number) => {
  switch (id) {
    case 1:
      return <SlMagicWand />;
    case 2:
      return <SlEnvolopeLetter />;
    case 3:
      return <SlBriefcase />;
    case 4:
      return <GoTrophy />;
    case 5:
      return <HiOutlineThumbDown />;
    default:
      return null;
  }
};

export const returnMenuIcon = (icon: string) => {
  switch (icon) {
    case 'RiContactsLine':
      return <RiContactsLine />;
    case 'RiFolder2Line':
      return <RiFolder2Line />;
    case 'PiBriefcaseLight':
      return <PiBriefcaseLight />;
    default:
      return null;
  }
};
