'use client';

import Link from 'next/link';
import { SlUser } from 'react-icons/sl';
import { BsPencil } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { createBoard, getBoards } from '@/redux/boards/boardsThunk';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const UserBoards = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = localStorage.getItem('user');
  const email = user ? JSON.parse(user).email : '';
  const [isEditing, setIsEditing] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const accessToken = localStorage.getItem('accessToken');
  const [buttonIsDisabled, setButtonIsDisabled] = useState(true);
  const { boards, boardsStatus } = useAppSelector((state) => state.boards);

  useEffect(() => {
    if (boardsStatus === 'succeeded') {
      dispatch(getBoards(accessToken as string));
    }
  }, [dispatch, accessToken, boardsStatus]);

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted');

    // TODO: Implement board name change functionality
    // TODO: Update the board name in the database
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewBoardName(e.target.value);
    setButtonIsDisabled(e.target.value === '');
  };

  const createNewBoard = async () => {
    const name = newBoardName;
    const values = { name, accessToken };
    dispatch(createBoard(values));
    router.push('/home/boards/');
  };

  return (
    <div className="w-full md:w-3/4 lg:w-2/3 2xl:w-7/12 mx-auto">
      <div className="flex items-center mx-auto border-b gap-4 pt-32 pb-4">
        <SlUser />
        <p className="font-semibold">My Job Tracking Boards</p>
        <Link
          href="/home/archived-boards"
          className="text-slate-400 border rounded-sm px-1"
        >
          view archived
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {boards.map((board) => (
          <Link
            href={`/home/boards/${board.id}/board`}
            key={board.id}
            className="border rounded-sm px-6 py-5 min-h-[160px]"
            title="board name"
          >
            <div className="relative w-full h-full">
              <BsPencil
                z-index={1000}
                className="absolute top-0 right-0"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
              />
              <form onSubmit={submitForm}>
                <label htmlFor="board" />
                <input
                  name="board"
                  id={board.id}
                  title="board name"
                  type="submit"
                  value={board.name}
                  onChange={(ev) => {
                    ev.preventDefault();
                    setIsEditing(true);
                  }}
                  disabled={!isEditing}
                  className="font-semibold bg-white outline-none border-none !pl-0 dark:bg-slate-900 dark:text-white"
                />
              </form>
              {/* Bellow line is the user's name, which we do not have so far */}
              {/* TODO: Resolve the issue with user's name! */}
              {/* <p className="text-slate-700 text-sm">{board.label}</p> */}
              <p className="text-slate-400 text-xs">{email}</p>
              {/* TODO: Created at or how many days/weeks/months ago? */}
            </div>
          </Link>
        ))}
        <div className="border rounded-sm px-6 py-5 flex items-center justify-center h-[160px]">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">+ New Board</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="pb-2">
                <DialogTitle className="mx-auto">New Board</DialogTitle>
                <DialogDescription className="border-t pt-4">
                  <span className="flex flex-col py-4 bg-yellow-200 rounded-md">
                    <span className="font-semibold px-4">
                      Are you sure you want to create a new board?
                    </span>
                    <span className="px-4">
                      We suggest having only one board per job search throughout
                      your career.
                    </span>
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="flex">
                <Input
                  id="name"
                  placeholder="Board name (e.g., Job Search 2024)"
                  value={newBoardName}
                  onChange={(e) => handleInputChange(e)}
                  className="focus:border-blue-500"
                />
              </div>
              <DialogFooter className="w-full">
                <DialogClose asChild>
                  <Button
                    type="submit"
                    variant="normal"
                    className="w-full"
                    disabled={buttonIsDisabled}
                    onClick={createNewBoard}
                  >
                    Create Board
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default UserBoards;
