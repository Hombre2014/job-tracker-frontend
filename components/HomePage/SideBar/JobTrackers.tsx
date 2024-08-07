import Link from 'next/link';
import { RiQuestionMark } from 'react-icons/ri';

import CreateNewBoard from '../Boards/CreateNewBoard';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const JobTrackers = () => {
  return (
    <div className="flex justify-between items-center pl-4 mt-4">
      <div className="flex items-center gap-1">
        <p className="hover:underline mr-1">
          <Link href="/home/boards">My Job Tracker</Link>
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <RiQuestionMark className="h-5 w-5 border rounded-md p-[1px] dark:border-slate-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Your personal job search tracking boards. Each board represents
                a different search throughout your career.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mr-2 cursor-pointer">
        <CreateNewBoard
          buttonLabel=""
          styling="max-w-0 max-h-0 p-3 font-bold"
        />
      </div>
    </div>
  );
};

export default JobTrackers;
