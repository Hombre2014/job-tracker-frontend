'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SlUser } from 'react-icons/sl';
import { BsPencil } from 'react-icons/bs';

import boards from '@/data/boards';

const UserBoards = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [boardName, setBoardName] = useState('');

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted');

    // TODO: Update the board name in the database
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
          <Link href={'/home/boards/new-board'}>
            <p className="font-semibold">+ New Board</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserBoards;
