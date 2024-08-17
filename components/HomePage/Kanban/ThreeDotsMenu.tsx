'use client';

import { useState, ChangeEvent } from 'react';
import { useParams } from 'next/navigation';
import { RiDragMove2Fill } from 'react-icons/ri';
import { BsThreeDots, BsPencil } from 'react-icons/bs';

import AlertDialogModal from '../Boards/AlertDialogModal';
import { useAppSelector } from '@/redux/hooks';

const ThreeDotsMenu = ({ columnOrder }: { columnOrder: number }) => {
  const { board_id } = useParams();
  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const { boards } = useAppSelector((state) => state.boards);
  const currentBoard = boards.find((board) => board.id === board_id);
  const currentBoardColumns = currentBoard?.columns;

  const col = currentBoardColumns?.find(
    (column) => column.order === columnOrder
  );

  const handleMoveList = () => {
    console.log('Order I want to move from : ', columnOrder);
    console.log('Order I have to move to: ', selectedColumn);
  };

  const handleSelected = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setSelectedColumn(parseInt(e.currentTarget.value));
    console.log('Column Clicked: ', columnOrder);
    console.log('Selected Column: ', e.target.value);
  };

  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" title="trigger" className="!px-1">
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
              <select
                className="select select-bordered w-full max-w-xs"
                name="columns"
                title="chose order"
                defaultValue={columnOrder + 1 + '-' + col?.name + '(Current)'}
                onChange={(e) => handleSelected(e)}
              >
                <option>
                  Position {columnOrder + 1} - {col?.name} (Current)
                </option>
                {currentBoardColumns
                  ?.filter((column) => column.order !== columnOrder)
                  .map((column) => (
                    <option key={column.order} value={column.order}>
                      Position {column.order + 1} - {column.name}
                    </option>
                  ))}
              </select>
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
