import Link from 'next/link';
import { useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { RiAccountPinBoxLine, RiDeleteBinLine } from 'react-icons/ri';

import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { archiveBoard, getBoards } from '@/redux/boards/boardsThunk';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';

const JobBoardTitle = (board: Board) => {
  const router = useRouter();
  const pathName = usePathname();
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [showTrash, setShowTrash] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const { boards } = useAppSelector((state) => state.boards);

  const toggleTrashIcon = () => {
    setTimeout(() => {
      setShowTrash((prev) => !prev);
    }, 300);
  };

  const handleArchiveBoard = (accessToken: string, boardId: string) => {
    if (
      pathName === `/home/boards` ||
      boards.length === 1 ||
      board_id === boardId
    ) {
      dispatch(archiveBoard({ accessToken, id: boardId }));
      setTimeout(() => {
        dispatch(getBoards(accessToken));
        console.log('JobBoard Title HandleArchievBoard getBoards dispatched');
      }, 2000);
      router.push('/home/boards');
      return;
    } else {
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
          ? 'bg-blue-100 hover:bg-blue-100 font-semibold'
          : 'hover:bg-slate-100',
        'flex justify-between items-center mx-2 my-1 rounded-md cursor-pointer'
      )}
    >
      <Link
        href={`/home/boards/${board.id}/board`}
        className="flex items-center gap-1 p-2 w-full"
      >
        <RiAccountPinBoxLine className="h-5 w-5" />
        <p className="pr-20px">{board.name}</p>
      </Link>
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
