import Link from 'next/link';
import { useState } from 'react';
import { RiAccountPinBoxLine, RiDeleteBinLine } from 'react-icons/ri';

const JobBoardTitle = (board: Board) => {
  const [showTrash, setShowTrash] = useState(false);

  const toggleTrashIcon = () => {
    setTimeout(() => {
      setShowTrash((prev) => !prev);
    }, 300);
  };

  return (
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
      <div>{showTrash ? <RiDeleteBinLine className="h-5 w-5" /> : null}</div>
    </div>
  );
};

export default JobBoardTitle;
