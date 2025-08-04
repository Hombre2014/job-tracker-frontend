'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LiaLinkSolid } from 'react-icons/lia';
import { RiDeleteBinLine } from 'react-icons/ri';
import { format, toZonedTime } from 'date-fns-tz';
import { useRouter, useParams } from 'next/navigation';


import { cn } from '@/lib/utils';
import { TokenManager } from '@/utils/TokenManager';
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
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';

const JobPostCard = ({
  id,
  title,
  color,
  status,
  postUrl,
  columnId,
  deadline,
  timeStamp,
  companyName,
  statusChangedTime,
}: JobPostCardProps) => {
  const router = useRouter();
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [showIcons, setShowIcons] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const { boards } = useAppSelector((state) => state.boards);
  const boardColumns = boards.find((board) => board.id === board_id)?.columns;

  const formattedStatusChangedTime = format(
    new Date(statusChangedTime),
    'dd/MM/yyyy HH:mm, a'
  );

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
    const dateTime = new Date(Date.parse(timeStamp)).getTime();

    return formatTimeDifference(nowTime - dateTime);
  }

  function formatTimeDifference(
    diffInMs: number,
    showPrefix: boolean = false
  ): string {
    const isInFuture = diffInMs > 0;
    const absDiffInMs = Math.abs(diffInMs);
    const diffInSeconds = Math.floor(absDiffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    let result = '';
    if (diffInYears > 0) result = `${diffInYears}y`;
    else if (diffInMonths > 0) result = `${diffInMonths}mo`;
    else if (diffInWeeks > 0) result = `${diffInWeeks}w`;
    else if (diffInDays > 0) result = `${diffInDays}d`;
    else if (diffInHours > 0) result = `${diffInHours}h`;
    else if (diffInMinutes > 0) result = `${diffInMinutes}m`;
    else result = `${diffInSeconds}s`;

    return isInFuture && showPrefix ? `in ${result}` : result;
  }

  const shortTimeSinceChange = getShortTimeSinceStatusChange(timeStamp);
  const shortTimeSinceStatusChange = getShortTimeSinceStatusChange(
    new Date(Date.parse(statusChangedTime)).toISOString()
  );

  const now = new Date();
  const timeDifference = new Date(deadline).getTime() - now.getTime();
  const timeDifferenceString = formatTimeDifference(timeDifference, true);

  const isDeadlinePassed = deadline ? new Date(deadline) < new Date() : false;

  const handleJobPostClick = (id: string) => {
    if (!isDialogOpen) {
      // Check if user has valid tokens
      if (!TokenManager.hasValidTokens()) {
        console.log('JobPostCard: No valid tokens, redirecting to login');
        router.push('/login');
        return;
      }

      router.push(`/home/boards/${board_id}/job/${id}/job-details`);
      // Only set localStorage if user is authenticated
      localStorage.setItem('columnId', columnId);
      const chosenColumn = boardColumns?.find(
        (column) => column.id === columnId
      )?.name;
      localStorage.setItem('chosenColumn', chosenColumn as string);
    }
  };

  const handleDeleteJobPost = () => {
    // Get the full job post data from Redux state to access documents
    const fullJobData = boards
      .find((board) => board.id === board_id)
      ?.columns.flatMap((column) => column.jobApplications)
      .find((job) => job.id === id);

    dispatch(
      deleteJobPost({
        accessToken,
        jobPostId: id,
        jobPostData: fullJobData,
      })
    );
    setIsDialogOpen(false);
  };

  return (
    <Card
      style={{ backgroundColor: color }}
      onMouseEnter={iconsOn}
      onMouseLeave={iconsOff}
      className={cn(
        'w-11/12 mx-auto mt-2 rounded-sm text-white cursor-pointer',
        color === null ? 'bg-[#6a776b]' : `bg-[${color}]`
      )}
      onClick={() => handleJobPostClick(id)}
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
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <div
                  className="h-[24px] w-[24px] rounded-md border border-gray-200 p-[1px] hover:border-gray-400 hover:border flex items-center justify-center cursor-pointer"
                  id={id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDialogOpen(true);
                  }}


                  style={{ backgroundColor: color }}
                >
                  <RiDeleteBinLine className="h-[20px] w-[20px]" />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center">
                    Delete Job Post
                  </AlertDialogTitle>
                  <hr />
                  <AlertDialogDescription className="text-center">
                    Are you sure you want to delete this job post?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <hr />
                <AlertDialogFooter>
                  <AlertDialogAction
                    className="bg-red-500"
                    onClick={handleDeleteJobPost}
                  >
                    Delete
                  </AlertDialogAction>
                  <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                  <span
                    className={cn(
                      'text-xs cursor-help',
                      isDeadlinePassed
                        ? 'bg-red-700 py-[2px] px-[5px] rounded-md'
                        : 'text-white'
                    )}
                  >
                    <div className="min-w-10">
                      {status === 'Job Created'
                        ? shortTimeSinceChange
                        : status === 'Deadline'
                        ? isDeadlinePassed
                          ? `o ${timeDifferenceString}`
                          : `${timeDifferenceString}`
                        : `${shortTimeSinceStatusChange}`}
                    </div>
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-300 !min-w-[250px] text-gray-900">
                  <p>
                    <span>
                      {isDeadlinePassed ? (
                        <span>Overdue {timeDifferenceString} ago</span>
                      ) : (
                        status
                      )}
                    </span>
                    <span> | </span>
                    <span>
                      {status === 'Deadline'
                        ? format(
                            toZonedTime(new Date(deadline), 'UTC'),
                            'dd/MM/yyyy HH:mm, a',
                            {
                              timeZone: 'UTC',
                            }
                          )
                        : formattedStatusChangedTime}
                    </span>
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
