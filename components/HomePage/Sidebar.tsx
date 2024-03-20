'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RiContactsLine } from 'react-icons/ri';
import { RiFolder2Line } from 'react-icons/ri';
import { RiQuestionMark } from 'react-icons/ri';
import { RiAddBoxLine } from 'react-icons/ri';
import { RiAccountPinBoxLine } from 'react-icons/ri';
import { RiDeleteBinLine } from 'react-icons/ri';

const Sidebar = () => {
  const [showTrash, setShowTrash] = useState(false);
  const toggleTrashIcon = () => {
    setShowTrash(!showTrash);
  };
  return (
    <>
      <div className="flex flex-col h-full border-r border-slate-200 text-[14px]">
        <div className="flex flex-col gap-2 border-b min-w-full border-slate-200 h-[100px] pl-4">
          <div className="flex items-center gap-2 pt-6">
            <RiContactsLine className="h-5 w-5" />
            <p>Contacts</p>
          </div>
          <div className="flex items-center gap-2 pt-2 pb-4">
            <RiFolder2Line className="h-5 w-5" />
            <p>Documents</p>
          </div>
        </div>
        <div className="border-b border-slate-200 h-[120px]">
          <div className="flex justify-between items-center pl-4 mt-4">
            <div className="flex items-center gap-1">
              <p className="">
                <Link href="/boards">My Job Tracker</Link>
              </p>
              <RiQuestionMark className="h-5 w-5 border rounded-md p-[1px]" />
            </div>
            <div className="mr-2">
              <RiAddBoxLine className="h-5 w-5" />
            </div>
          </div>
          <div
            className="flex justify-between items-center border border-slate-400 rounded-md bg-slate-200 p-2 mt-4 mx-2 cursor-pointer"
            onMouseEnter={toggleTrashIcon}
            onMouseLeave={toggleTrashIcon}
          >
            <div className="flex items-center gap-1">
              <RiAccountPinBoxLine className="h-5 w-5" />
              <p>Job Search 2024</p>
            </div>
            <div className="">
              {showTrash ? <RiDeleteBinLine className="h-5 w-5" /> : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
