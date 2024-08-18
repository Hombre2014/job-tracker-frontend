'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { RiDragMove2Fill } from 'react-icons/ri';
import { BsThreeDots, BsPencil } from 'react-icons/bs';

import { useAppSelector } from '@/redux/hooks';
import AlertDialogModal from '../Boards/AlertDialogModal';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ThreeDotsMenu = ({ columnOrder }: { columnOrder: number }) => {
  const { board_id } = useParams();
  const { boards } = useAppSelector((state) => state.boards);
  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const currentBoard = boards.find((board) => board.id === board_id);
  const currentBoardColumns = currentBoard?.columns;

  const columnData = currentBoardColumns?.find(
    (column) => column.order === columnOrder
  );

  const range = (from: number, to: number) => {
    return from > to
      ? []
      : Array.from({ length: to - from + 1 }, (value, idx) => idx + from);
  };

  const moveColumn = (numCols: number, from: number, to: number) => {
    return from < to
      ? [
          ...range(0, from - 1),
          ...range(from + 1, to),
          from,
          ...range(to + 1, numCols - 1),
        ]
      : [
          ...range(0, to - 1),
          from,
          ...range(to, from - 1),
          ...range(from + 1, numCols - 1),
        ];
  };

  const handleMoveList = () => {
    console.log('Order_id I want to move from : ', columnOrder);
    console.log('Order_id I have to move to: ', selectedColumn);
    const columnsArray = moveColumn(5, columnOrder, selectedColumn);
    console.log(columnsArray);

    const columns = currentBoardColumns?.map((column) => column.id);
    console.log('Columns in order: ', columns);

    const columnIdsMap = {
      '0': columns![0],
      '1': columns![1],
      '2': columns![2],
      '3': columns![3],
      '4': columns![4],
    };
    const columnIds = columnsArray.map((v) => columnIdsMap[v]);

    console.log('Column Ids: ', columnIds);
  };

  const handleSelected = (e: any) => {
    setSelectedColumn(parseInt(e));
    console.log('Column Clicked: ', columnOrder);
    console.log('Selected Column: ', e);
    console.log('Clicked Col: ', columnData);
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
              <Select onValueChange={(e) => handleSelected(e)}>
                <SelectTrigger className="w-[250px] mx-auto">
                  <SelectValue
                    placeholder={
                      'Position ' +
                      (columnOrder + 1) +
                      ' - ' +
                      columnData?.name +
                      ' (Current)'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {currentBoardColumns
                      ?.filter((column) => column.order !== columnOrder)
                      .map((column) => (
                        <SelectItem
                          key={column.order}
                          value={column.order.toString()}
                        >
                          Position {column.order + 1} - {column.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
