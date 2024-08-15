'use client';

import { BsPlusLg } from 'react-icons/bs';

import ThreeDotsMenu from './ThreeDotsMenu';
import { useAppSelector } from '@/redux/hooks';
import { returnBoardIcon } from '@/utils/ReturnIcons';

const BoardColumns = () => {
  const { boards } = useAppSelector((state) => state.boards);
  const boardColumns = boards[0].columns;

  return (
    <div className="w-full flex h-full">
      {boardColumns.map((column) => (
        <section
          key={column.order + 1}
          className="flex flex-col border-r border-slate-200 w-1/5"
        >
          <div className="flex items-center justify-between px-4 pt-8">
            {returnBoardIcon(column.order + 1)}
            <h2 className="text-lg font-bold hover:bg-slate-200 px-2 py-1 rounded-md cursor-text transition duration-300 delay-150">
              {column.name.toUpperCase()}
            </h2>
            <ThreeDotsMenu />
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

export default BoardColumns;
