import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { RiAccountPinBoxLine, RiDeleteBinLine } from 'react-icons/ri';

import { getBoards } from '@/redux/boards/boardsThunk';

const JobBoard = () => {
  const dispatch = useAppDispatch();
  const [showTrash, setShowTrash] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const { boards } = useAppSelector((state) => state.boards);

  useEffect(() => {
    dispatch(getBoards(accessToken));
  }, [accessToken, dispatch]);

  const toggleTrashIcon = () => {
    setTimeout(() => {
      setShowTrash((prev) => !prev);
    }, 300);
  };

  return (
    <div
      className="flex justify-between items-center border border-slate-400 rounded-md bg-slate-200 p-2 mt-4 mx-2 cursor-pointer dark:bg-slate-700 dark:border-slate-500 dark:text-white"
      onMouseEnter={toggleTrashIcon}
      onMouseLeave={toggleTrashIcon}
    >
      <div className="flex items-center gap-1">
        <RiAccountPinBoxLine className="h-5 w-5" />
        <p>{boards[0].name}</p>
      </div>
      <div>{showTrash ? <RiDeleteBinLine className="h-5 w-5" /> : null}</div>
    </div>
  );
};

export default JobBoard;
