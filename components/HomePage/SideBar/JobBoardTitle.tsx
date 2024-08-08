import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { RiAccountPinBoxLine, RiDeleteBinLine } from 'react-icons/ri';

import { cn } from '@/lib/utils';
import { archiveBoard, getBoards } from '@/redux/boards/boardsThunk';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Loader from '@/components/Misc/Loader';

const JobBoardTitle = (board: Board) => {
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');
  const [showTrash, setShowTrash] = useState(false);
  const { board_id } = useParams();
  const { boards } = useAppSelector((state) => state.boards);

  const toggleTrashIcon = () => {
    setTimeout(() => {
      setShowTrash((prev) => !prev);
    }, 300);
  };

  const handleArchiveBoard = (accessToken: string, boardId: string) => {
    if (pathName === `/home/boards`) {
      dispatch(archiveBoard({ accessToken, id: boardId }));
      setTimeout(() => {
        dispatch(getBoards(accessToken));
      }, 2000);
      router.push('/home/boards');
      return;
    }
    if (boards.length === 1 || board_id === boardId) {
      console.log('Deleting the last board or the current board');
      dispatch(archiveBoard({ accessToken, id: boardId }));
      setTimeout(() => {
        dispatch(getBoards(accessToken));
      }, 2000);
      router.push('/home/boards');
      return;
    } else {
      console.log('Deleting a different board, staying on the same page');
      dispatch(archiveBoard({ accessToken, id: boardId }));
      setTimeout(() => {
        dispatch(getBoards(accessToken));
      }, 2000);
      router.push(pathName);
    }
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
      <div className="">
        <Link
          href={`/home/boards/${board.id}/board`}
          className="flex items-center gap-1"
        >
          <RiAccountPinBoxLine className="h-5 w-5" />
          <p>{board.name}</p>
        </Link>
      </div>
      <div>
        {showTrash ? (
          <RiDeleteBinLine className="h-5 w-5 absolute m-2" />
        ) : null}
        <AlertDialogModal
          stylings={cn('opacity-0')}
          dialogTitle="Archive Board"
          dialogText="Are you sure you want to archive this board?"
          buttonConfirm="Archive"
          buttonCancel="Cancel"
          actionFunction={() =>
            handleArchiveBoard(accessToken as string, board.id)
          }
        />
      </div>
    </div>
  );
};

export default JobBoardTitle;
