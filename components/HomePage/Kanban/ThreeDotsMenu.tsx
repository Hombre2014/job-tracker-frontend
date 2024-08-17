'use client';

import { RiDragMove2Fill } from 'react-icons/ri';
import { BsThreeDots, BsPencil } from 'react-icons/bs';

import AlertDialogModal from '../Boards/AlertDialogModal';

const handleMoveList = () => {
  console.log('Move List');
};

const ThreeDotsMenu = () => {
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" title="trigger" className="btn m-1">
        <BsThreeDots className="cursor-pointer" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <li>
          <div className="flex !justify-between h-12 mb-1">
            <AlertDialogModal
              buttonLabel="Move List"
              buttonVariant="ghost"
              dialogTitle="Move List"
              buttonCancel="Discard"
              buttonConfirm="Move"
              actionFunction={handleMoveList}
              stylings="bg-none hover:!bg-gray-200 p-0 m-0 active:!bg-gray-800 active:text-gray-200"
            >
              <div>DropDown</div>
            </AlertDialogModal>
            <RiDragMove2Fill className="w-4 h-4" />
          </div>
        </li>
        <li>
          <div className="flex !justify-between h-12">
            <a>Rename List</a>
            <BsPencil className="w-4 h-4" />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ThreeDotsMenu;
