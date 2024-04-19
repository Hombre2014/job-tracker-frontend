'use client';

import { RiMore2Fill, RiSearchLine } from 'react-icons/ri';

import { ComboBox } from './ComboBox';

const HomeNavbar = () => {
  return (
    <nav className="flex justify-between items-center w-full pt-2">
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 items-center mr-2">
          <RiMore2Fill />
          <ComboBox />
        </div>
        <div className="flex items-center relative">
          <RiSearchLine className="absolute left-1" />
          <input
            type="text"
            placeholder="Filter"
            className="rounded-md border border-slate-500 pl-6 w-20 h-9 border-dashed transition-all duration-300 ease-in-out"
          />
        </div>
      </div>
      <div>Main three buttons</div>
      <div>Add new stuff</div>
    </nav>
  );
};

export default HomeNavbar;
