'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LiaLinkSolid } from 'react-icons/lia';
import { RiDeleteBinLine } from 'react-icons/ri';
import { format, toZonedTime } from 'date-fns-tz';
import { useRouter, useParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import { deleteJobPost } from '@/redux/jobs/jobsThunk';
import { returnJobPostIcon } from '@/utils/ReturnIcons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
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
  color,
  status,
  postUrl,
  columnId,
  timeStamp,
  companyName,
  statusChangedTime,
}: JobPostCardProps) => {
  const router = useRouter();
  const date = new Date(timeStamp);
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [showIcons, setShowIcons] = useState(false);
  const zonedDate = toZonedTime(date, 'Europe/Sofia');
  const accessToken = localStorage.getItem('accessToken');
  const { boards } = useAppSelector((state) => state.boards);
  const boardColumns = boards.find((board) => board.id === board_id)?.columns;
  const formattedDateHour = format(zonedDate, 'dd/MM/yyyy HH:mm, a', {
    timeZone: 'Europe/Paris',
  });

  const iconsOn = () => {
    setTimeout(() => {
      setShowIcons(true);
    }, 200);
  };

  const iconsOff = () => {
    setTimeout(() => {
      setShowIcons(false);
    }, 200);
  };

  function getShortTimeSinceStatusChange(timeStamp: string): string {
    const nowTime = Date.now();
    const adjustedTimeStamp = new Date(Date.parse(timeStamp) + 60 * 60 * 1000); // Add 1 hour due to timezone difference between server Docker container and client
    const dateTime = adjustedTimeStamp.getTime();

    const diffInMs = nowTime - dateTime;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInYears > 0) return `${diffInYears}y`;
    if (diffInMonths > 0) return `${diffInMonths}mo`;
    if (diffInDays > 0) return `${diffInDays}d`;
    if (diffInHours > 0) return `${diffInHours}h`;
    if (diffInMinutes > 0) return `${diffInMinutes}m`;
    return `${diffInSeconds}s`;
  }

  const shortTimeSinceChange = getShortTimeSinceStatusChange(timeStamp);

  const handleJobPostClick = (id: string) => {
    router.push(`/home/boards/${board_id}/job/${id}/job-details`);
    localStorage.setItem('columnId', columnId);
    const chosenColumn = boardColumns?.find(
      (column) => column.id === columnId
    )?.name;
    localStorage.setItem('chosenColumn', chosenColumn as string);
  };

  const handleDeleteJobPost = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      deleteJobPost({
        accessToken,
        jobPostId: id,
      })
    );
  };

  return (
    <Card
      onMouseEnter={iconsOn}
      onMouseLeave={iconsOff}
      style={{ backgroundColor: color }}
      className={cn(
        'w-11/12 mx-auto mt-2 rounded-sm text-white cursor-pointer',
        color === null ? 'bg-[#6a776b]' : `bg-[${color}]`
      )}
      onClick={() => {
        handleJobPostClick(id);
      }}
    >
      <div className="flex h-[90px]">
        <CardHeader className="w-3/4">
          <CardTitle className="!p-0 !m-0 tracking-normal">{title}</CardTitle>
          <CardDescription className="text-white">
            {companyName}
          </CardDescription>
        </CardHeader>
        <div className="flex flex-col gap-1 py-1 pr-2 items-end w-1/4 mt-1">
          {showIcons ? (
            <div
              className="h-[24px] w-[24px] rounded-md border border-gray-200 p-[1px] hover:border-gray-400 hover:border"
              id={id}
            >
              <RiDeleteBinLine
                className="h-[24px] w-[24px] m-auto pb-[5px] pr-[3px]"
                onClick={handleDeleteJobPost}
              />
            </div>
          ) : (
            <div className="h-[24px] w-[24px] rounded-md p-[1px]"></div>
          )}
          {showIcons && postUrl?.length > 6 ? (
            <Link href={postUrl} rel="noopener" target="_blank">
              <LiaLinkSolid className="h-[24px] w-[24px] border rounded-md p-[1px] cursor-pointer hover:border-gray-400" />
            </Link>
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
                <TooltipContent className="bg-slate-300 !min-w-[250px] text-gray-900">
                  <p>
                    <span>{status}</span>
                    <span> | </span>
                    <span>{formattedDateHour}</span>
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
