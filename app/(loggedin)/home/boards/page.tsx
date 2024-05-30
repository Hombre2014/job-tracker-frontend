'use client';

import Link from 'next/link';
import { SlUser } from 'react-icons/sl';
import { BsPencil } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

import boards from '@/data/boards';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const UserBoards = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [boardName, setBoardName] = useState(''); // TODO: Get the board name from the database
  const [createNewBoardName, setCreateNewBoardName] = useState('');
  const [buttonIsDisabled, setButtonIsDisabled] = useState(true);

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted');

    // TODO: Implement board name change functionality
    // TODO: Update the board name in the database
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCreateNewBoardName(e.target.value);
    setButtonIsDisabled(e.target.value === '');
  };

  const createNewBoard = () => {
    // TODO: Create a new board in the database

    console.log('Creating new board');
    router.push('/home/boards/new-board/board');
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
            href={`/home/boards/${board.value}/board`}
            key={board.value}
            className="border rounded-sm px-6 py-5"
            title="board name"
          >
            <div className="relative">
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
                  id={board.value}
                  title="board name"
                  type="submit"
                  value={board.value}
                  onChange={(ev) => {
                    ev.preventDefault();
                    setIsEditing(true);
                    setBoardName(ev.target.value);
                  }}
                  disabled={!isEditing}
                  className="font-semibold bg-white outline-none border-none !pl-0"
                />
              </form>
              <p className="text-slate-700 text-sm">{board.label}</p>
              <p className="text-slate-400 text-xs">user@email.com</p>
              <p className="text-slate-400 text-xs pt-8">
                created 4 months ago
              </p>
            </div>
          </Link>
        ))}
        <div className="border rounded-sm px-6 py-5 flex items-center justify-center h-[174px]">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">+ New Board</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="pb-2">
                <DialogTitle className="mx-auto">New Board</DialogTitle>
                <DialogDescription className="border-t pt-4">
                  <div className="flex flex-col py-4 bg-yellow-200 rounded-md">
                    <p className="font-semibold px-4">
                      Are you sure you want to create a new board?
                    </p>
                    <p className="px-4">
                      We suggest having only one board per job search throughout
                      your career.
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="flex">
                <Input
                  id="name"
                  placeholder="Board name (e.g., Job Search 2024)"
                  value={createNewBoardName}
                  onChange={(e) => handleInputChange(e)}
                  className="focus:border-blue-500"
                />
              </div>
              <DialogFooter className="w-full">
                <Button
                  type="submit"
                  variant="normal"
                  className="w-full"
                  disabled={buttonIsDisabled}
                  onClick={createNewBoard}
                >
                  Create Board
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default UserBoards;
