'use client';

import { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { LiaLinkSolid } from 'react-icons/lia';
import { RiDeleteBinLine } from 'react-icons/ri';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const JobPostCard = () => {
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
          <CardTitle className="!p-0 !m-0">Front end Developer</CardTitle>
          <CardDescription className="text-white">Amazon</CardDescription>
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
                    <span>Job Created</span>
                    <span> | </span>
                    <span>August 30th 2024, 10:44 am</span>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <FiPlusCircle className="h-[24px] w-[24px] rounded-md p-[1px]" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JobPostCard;
