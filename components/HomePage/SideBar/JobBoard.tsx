'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RiAccountPinBoxLine, RiDeleteBinLine } from 'react-icons/ri';

import { getBoards } from '@/redux/boards/boardsThunk';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';

const JobBoard = () => {
  const dispatch = useAppDispatch();
  const [showTrash, setShowTrash] = useState(false);
  const { boards } = useAppSelector((state) => state.boards);
  const { accessToken } = useAppSelector((state) => state.user);
  // const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    dispatch(getBoards(accessToken as string));
  }, [accessToken, dispatch]);

  const toggleTrashIcon = () => {
    setTimeout(() => {
      setShowTrash((prev) => !prev);
    }, 300);
  };

  return (
    <div className="flex flex-col">
      {boards.map((board) => (
        <div
          onMouseEnter={toggleTrashIcon}
          onMouseLeave={toggleTrashIcon}
          key={board.id}
          className="flex justify-between items-center border border-slate-400 rounded-md bg-slate-200 p-2 mt-4 mx-2 cursor-pointer
        dark:bg-slate-700 dark:border-slate-500 dark:text-white"
        >
          <div className="flex items-center gap-1">
            <RiAccountPinBoxLine className="h-5 w-5" />
            <Link href={`/home/boards/${board.id}/board`}>
              <p>{board.name}</p>
            </Link>
          </div>
          <div>
            {showTrash ? <RiDeleteBinLine className="h-5 w-5" /> : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobBoard;
