'use client';

import { useState } from 'react';
import { LiaLinkSolid } from 'react-icons/lia';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useRouter, useParams } from 'next/navigation';
import {
  format,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';

import { returnJobPostIcon } from '@/utils/ReturnIcons';
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

const JobPostCard = ({
  id,
  title,
  status,
  columnId,
  timeStamp,
  companyName,
}: JobPostCardProps) => {
  const router = useRouter();
  const { board_id } = useParams();
  const date = new Date(timeStamp);
  const [showIcons, setShowIcons] = useState(false);
  const formattedDate = format(date, 'MMMM do, yyyy, h:mm a');
  const toggleIcons = () => {
    setTimeout(() => {
      setShowIcons((prev) => !prev);
    }, 200);
  };

  function getShortTimeSinceStatusChange(timeStamp: string): string {
    const now = new Date();
    const date = new Date(timeStamp);

    const years = differenceInYears(now, date);
    const days = differenceInDays(now, date) % 30;
    const hours = differenceInHours(now, date) % 24;
    const months = differenceInMonths(now, date) % 12;
    const minutes = differenceInMinutes(now, date) % 60;
    const seconds = differenceInSeconds(now, date) % 60;

    if (years > 0) return `${years}y`;
    if (months > 0) return `${months}mo`;
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  }

  const shortTimeSinceChange = getShortTimeSinceStatusChange(timeStamp);

  const handleJobPostClick = (id: string) => {
    router.push(`/home/boards/${board_id}/job/${id}/job-details`);
    localStorage.setItem('columnId', columnId);
  };

  return (
    <Card
      onMouseEnter={toggleIcons}
      onMouseLeave={toggleIcons}
      className="w-11/12 mx-auto mt-2 rounded-sm bg-violet-500 text-white"
      onClick={() => {
        handleJobPostClick(id);
      }}
    >
      <div className="flex h-[90px] hover:cursor-pointer">
        <CardHeader className="w-3/4">
          <CardTitle className="!p-0 !m-0 tracking-normal">{title}</CardTitle>
          <CardDescription className="text-white">
            {companyName}
          </CardDescription>
        </CardHeader>
        <div className="flex flex-col gap-1 py-1 pr-2 items-end w-1/4 mt-1">
          {showIcons ? (
            <div className="h-[24px] w-[24px] rounded-md cursor-pointer border hover:border-gray-400">
              <RiDeleteBinLine className="h-5 w-5 m-auto" />
            </div>
          ) : (
            <div className="h-[24px] w-[24px] rounded-md p-[1px]"></div>
          )}
          {showIcons ? (
            <LiaLinkSolid className="h-[24px] w-[24px] border rounded-md p-[1px] cursor-pointer hover:border-gray-400" />
          ) : (
            <div className="h-[24px] w-[24px] rounded-md p-[1px]"></div>
          )}
          <div className="flex justify-center items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-white cursor-help">
                    {shortTimeSinceChange}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    <span>{status}</span>
                    <span> | </span>
                    <span>{formattedDate}</span>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {returnJobPostIcon(
              status === 'Job Created'
                ? 'HiOutlinePlusCircle'
                : status === 'Deadline'
                ? 'HiOutlineClock'
                : status === 'Applied'
                ? 'HiOutlineFolder'
                : status === 'Interview'
                ? 'PiBriefcaseLight'
                : status === 'Offer Received'
                ? 'GoTrophy'
                : status === 'Job Moved'
                ? 'GoInbox'
                : 'HiOutlinePlusCircle'
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JobPostCard;
