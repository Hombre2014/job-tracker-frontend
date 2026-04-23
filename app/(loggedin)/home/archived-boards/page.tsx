'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiInbox2Line } from 'react-icons/ri';

import { getTimeAgo } from '@/utils/helpers';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import {
  getBoards,
  unarchiveBoard,
  getArchivedBoards,
} from '@/redux/boards/boardsThunk';

const ArchivedBoards = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { archivedBoards } = useAppSelector((state) => state.boards);

  const handleUnarchiveBoard = (boardId: string) => {
    dispatch(unarchiveBoard({ id: boardId }));
    dispatch(getBoards());
    dispatch(getArchivedBoards());
    router.push('/home/boards');
  };

  useEffect(() => {
    dispatch(getArchivedBoards());
  }, [dispatch]);

  return (
    <div className="w-full md:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto">
      <div className="flex items-center mx-auto border-b gap-4 pt-32 pb-4">
        <RiInbox2Line />
        <p className="font-semibold">Archived Boards</p>
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {archivedBoards.length === 0 && (
          <p className="text-slate-400 text-lg">No archived boards found...</p>
        )}
        {archivedBoards.map((board) => (
          <div className="min-h-[188px]" key={board.name}>
            <div className="bg-slate-100 rounded-md p-6 h-full flex flex-col justify-between">
              <div>
                <p className="text-slate-700 text-sm">{board.name}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs pt-8">
                  Last updated: {getTimeAgo(board)}
                </p>
                <AlertDialogModal
                  cleanupType="none"
                  buttonCancel="Cancel"
                  buttonLabel="Unarchive"
                  buttonConfirm="Unarchive"
                  dialogTitle="Unarchive Board"
                  stylings="mt-4 bg-blue-500 text-white"
                  dialogText="Are you sure you want to unarchive this board?"
                  actionFunction={() =>
                    handleUnarchiveBoard(board.id)
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchivedBoards;
