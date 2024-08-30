'use client';

import { useState } from 'react';
import { LiaLinkSolid } from 'react-icons/lia';
import { RiDeleteBinLine } from 'react-icons/ri';

import { returnJobPostIcon } from '@/utils/ReturnIcons';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const JobPostCard = ({
  title,
  companyName,
  status,
  timeStamp,
}: JobPostCardProps) => {
  const [showIcons, setShowIcons] = useState(false);

  const toggleIcons = () => {
    setTimeout(() => {
      setShowIcons((prev) => !prev);
    }, 200);
  };

  return (
    <Card
      onMouseEnter={toggleIcons}
      onMouseLeave={toggleIcons}
      className="w-11/12 mx-auto mt-2 rounded-sm bg-violet-500 text-white"
    >
      <div className="flex h-[90px]">
        <CardHeader className="w-3/4">
          <CardTitle className="!p-0 !m-0">{title}</CardTitle>
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
                  <span className="text-xs text-white cursor-help">35 d</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    <span>{status}</span>
                    <span> | </span>
                    <span>{timeStamp}</span>
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
