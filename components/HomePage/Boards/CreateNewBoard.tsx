'use client';

import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { createBoard } from '@/redux/boards/boardsThunk';
import { AlertDialogFooter } from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const CreateNewBoard = ({
  buttonLabel,
  styling,
}: {
  buttonLabel?: string;
  styling?: string;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [newBoardName, setNewBoardName] = useState('');
  const [buttonIsDisabled, setButtonIsDisabled] = useState(true);
  const accessToken = localStorage.getItem('accessToken');

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
    newBoardName && setNewBoardName('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn(styling)}>
          + {buttonLabel}
        </Button>
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
                We suggest having only one board per job search throughout your
                career.
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
        <AlertDialogFooter className="w-full">
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
        </AlertDialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewBoard;
