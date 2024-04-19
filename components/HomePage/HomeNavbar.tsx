'use client';

import { RiMore2Fill } from 'react-icons/ri';

import { ComboBox } from './ComboBox';

const HomeNavbar = () => {
  return (
    <nav className="flex justify-between items-center w-full pt-2">
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 items-center mr-2">
          <RiMore2Fill />
          <ComboBox />
        </div>
        <div>Filter</div>
      </div>
      <div>Main three buttons</div>
      <div>Add new stuff</div>
    </nav>
  );
};

export default HomeNavbar;
