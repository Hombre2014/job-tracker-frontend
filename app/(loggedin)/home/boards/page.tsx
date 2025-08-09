'use client';

import Link from 'next/link';
import { SlUser } from 'react-icons/sl';
import { BsPencil } from 'react-icons/bs';
import { ChangeEvent, useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { getBoards, renameBoard } from '@/redux/boards/boardsThunk';
import CreateNewBoard from '@/components/HomePage/Boards/CreateNewBoard';

const UserBoards = () => {
  const dispatch = useAppDispatch();
  const user = localStorage.getItem('user');
  const email = user ? JSON.parse(user).email : '';
  const [isEditing, setIsEditing] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const [currentBoardId, setCurrentBoardId] = useState('');
  const { lastName } = useAppSelector((state) => state.user);
  const { boards } = useAppSelector((state) => state.boards);
  const { firstName } = useAppSelector((state) => state.user);
  const [renamedBoardName, setRenamedBoardName] = useState('');

  useEffect(() => {
    // Only fetch boards on initial load, not on every status change
    dispatch(getBoards(accessToken as string));
  }, [dispatch, accessToken]);

  useEffect(() => {
    if (isEditing) {
      // Use setTimeout to ensure DOM is updated before focusing
      setTimeout(() => {
        const currentInputElement = document.getElementById(
          currentBoardId
        ) as HTMLInputElement | null;
        if (currentInputElement && currentBoardId === currentInputElement.id) {
          currentInputElement.focus();
          currentInputElement.select();
        }
      }, 0);
    }
    // Removed the automatic getBoards() call to prevent timing issues
  }, [isEditing, currentBoardId]);

  const handleBoardNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setRenamedBoardName(e.target.value);
  };

  const confirmBoardNameChange = async () => {
    setIsEditing(false);
    // Wait for the rename to complete, then refresh
    await dispatch(
      renameBoard({ name: renamedBoardName, accessToken, id: currentBoardId })
    );
    dispatch(getBoards(accessToken as string));
    setCurrentBoardId('');
  };

  const checkForEnter = (e: any) => {
    if (e.key === 'Enter') {
      confirmBoardNameChange();
    }
  };

  return (
    <div className="w-full md:w-3/4 lg:w-2/3 2xl:w-7/12 mx-auto">
      <div className="flex items-center mx-auto border-b gap-4 pt-32 pb-4">
        <SlUser />
        <p className="font-semibold">My Job Tracking Boards</p>
        <Link
          href="/home/archived-boards"
          className="text-slate-400 border rounded-sm px-2 transition-all delay-300 ease-in-out hover:bg-slate-100"
        >
          view archived
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {boards.map((board) =>
          isEditing && currentBoardId === board.id ? (
            // Render as div when editing (no Link)
            <div
              key={board.id}
              className="border-2 border-blue-500 rounded-sm px-6 py-5 flex items-center justify-center h-[160px]"
              title="board name"
            >
              <div className="relative w-full h-full">
                <BsPencil
                  z-index={1000}
                  className="absolute top-0 right-0"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(true);
                    setCurrentBoardId(board.id);
                    setRenamedBoardName(board.name);
                  }}
                />
                <Input
                  id={board.id}
                  placeholder="Board name (e.g., Job Search 2024)"
                  value={renamedBoardName}
                  type="text"
                  onChange={(e) => handleBoardNameChange(e)}
                  onKeyDown={(e) => checkForEnter(e)}
                  onBlur={confirmBoardNameChange}
                  className="focus:border-blue-500"
                />
                <p className="text-slate-700 text-sm mb-2">
                  {firstName} {lastName}
                </p>
                <p className="text-slate-400 text-xs">{email}</p>
                {/* TODO: Created at or how many days/weeks/months ago? */}
              </div>
            </div>
          ) : (
            // Render as Link when not editing
            <Link
              href={`/home/boards/${board.id}/board`}
              key={board.id}
              className="border rounded-sm px-6 py-5 flex items-center justify-center h-[160px]"
              title="board name"
            >
              <div className="relative w-full h-full">
                <BsPencil
                  z-index={1000}
                  className="absolute top-0 right-0"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(true);
                    setCurrentBoardId(board.id);
                    setRenamedBoardName(board.name);
                  }}
                />
                <p className="text-lg font-semibold">{board.name}</p>
                <p className="text-slate-700 text-sm mb-2">
                  {firstName} {lastName}
                </p>
                <p className="text-slate-400 text-xs">{email}</p>
                {/* TODO: Created at or how many days/weeks/months ago? */}
              </div>
            </Link>
          )
        )}
        <div className="border rounded-sm px-6 py-5 flex items-center justify-center h-[160px]">
          <CreateNewBoard buttonLabel="New Board" />
        </div>
      </div>
    </div>
  );
};

export default UserBoards;
