'use client';

import { useRouter } from 'next/navigation';
import { RiInbox2Line } from 'react-icons/ri';

import { Button } from '@/components/ui/button';
import archivedBoards from '@/data/archived-boards';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const ArchivedBoards = () => {
  const router = useRouter();
  const unarchiveBoard = () => {
    // TODO: Restore the board in the DB and update the state

    router.push('/home/boards');
  };

  return (
    <div className="w-full md:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto">
      <div className="flex items-center mx-auto border-b gap-4 pt-32 pb-4">
        <RiInbox2Line />
        <p className="font-semibold">Archived Boards</p>
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {archivedBoards.map((board) => (
          <div className="min-h-[188px]" key={board.value}>
            <div className="bg-slate-100 rounded-md p-6 h-full flex flex-col justify-between">
              <div>
                <p className="text-slate-700 text-sm">{board.value}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs pt-8">
                  created 4 months ago
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="normal" className="mt-4">
                      Unarchive
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Unarchive Board</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to unarchive this board?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={unarchiveBoard}>
                        Unarchive
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchivedBoards;
