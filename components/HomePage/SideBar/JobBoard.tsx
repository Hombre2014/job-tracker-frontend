import { useState } from 'react';
import { RiAccountPinBoxLine, RiDeleteBinLine } from 'react-icons/ri';

const JobBoard = () => {
  const [showTrash, setShowTrash] = useState(false);

  const toggleTrashIcon = () => {
    setTimeout(() => {
      setShowTrash((prev) => !prev);
    }, 300);
  };

  return (
    <div
      className="flex justify-between items-center border border-slate-400 rounded-md bg-slate-200 p-2 mt-4 mx-2 cursor-pointer dark:bg-slate-700 dark:border-slate-500 dark:text-white"
      onMouseEnter={toggleTrashIcon}
      onMouseLeave={toggleTrashIcon}
    >
      <div className="flex items-center gap-1">
        <RiAccountPinBoxLine className="h-5 w-5" />
        <p>Job Search 2024</p>
      </div>
      <div>{showTrash ? <RiDeleteBinLine className="h-5 w-5" /> : null}</div>
    </div>
  );
};

export default JobBoard;
