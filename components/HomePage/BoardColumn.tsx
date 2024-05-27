'use client';

import { BsPlusLg } from 'react-icons/bs';
import { GoTrophy } from 'react-icons/go';
import { BsThreeDots } from 'react-icons/bs';
import { SlBriefcase } from 'react-icons/sl';
import { RiInbox2Line } from 'react-icons/ri';
import { SlEnvolopeLetter } from 'react-icons/sl';
import { HiOutlineThumbDown } from 'react-icons/hi';

import boardColumns from '@/data/board-columns';

const returnProperIcon = (id: number) => {
  switch (id) {
    case 1:
      return <RiInbox2Line />;
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

const BoardColumn = () => {
  return (
    <div className="w-full flex h-full">
      {boardColumns.map((column) => (
        <section
          key={column.id}
          className="flex flex-col border-r border-slate-200 w-1/5"
        >
          <div className="flex items-center justify-between px-12 pt-8">
            {returnProperIcon(column.id)}
            <h2 className="text-lg font-bold hover:bg-slate-200 px-10 py-1 rounded-md cursor-text transition duration-300 delay-150">
              {column.name.toUpperCase()}
            </h2>
            <BsThreeDots className="cursor-pointer" />
          </div>
          <div className="w-full flex justify-center">
            <p className="mb-8 text-center">5 JOBS</p>
          </div>
          <div className="w-11/12 flex justify-center border py-3 mx-auto rounded-md hover:border-blue-500 transition duration-300 delay-150 cursor-pointer">
            <BsPlusLg />
          </div>
        </section>
      ))}
    </div>
  );
};

export default BoardColumn;
