import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { RiAccountPinBoxLine, RiDeleteBinLine } from 'react-icons/ri';

import { cn } from '@/lib/utils';

const JobBoardTitle = (board: Board) => {
  const [showTrash, setShowTrash] = useState(false);
  const { board_id } = useParams();

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
      className={cn(
        board_id === board.id
          ? 'bg-blue-100 hover:bg-blue-100'
          : 'hover:bg-slate-100',
        'flex justify-between items-center p-2 mt-4 mx-2 rounded-md cursor-pointer'
      )}
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
