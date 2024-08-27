'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BsThreeDots } from 'react-icons/bs';
import { RiDragMove2Fill } from 'react-icons/ri';

import { moveColumn } from '@/utils/moveColumn';
import AlertDialogModal from '../Boards/AlertDialogModal';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { getBoards, rearrangeColumns } from '@/redux/boards/boardsThunk';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ThreeDotsMenu = ({ columnOrder }: { columnOrder: number }) => {
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const { boards } = useAppSelector((state) => state.boards);
  const { boardsStatus } = useAppSelector((state) => state.boards);
  const currentBoard = boards.find((board) => board.id === board_id);
  const [selectedColumn, setSelectedColumn] = useState<number>(columnOrder);
  const currentBoardColumns = currentBoard?.columns;

  const columnData = currentBoardColumns?.find(
    (column) => column.order === columnOrder
  );

  const handleMoveList = () => {
    const columnsArray = moveColumn(5, columnOrder, selectedColumn);
    const columns = currentBoardColumns?.map((column) => column.id);
    const columnIds = columnsArray.map((v) => columns![v]);

    if (columnOrder === selectedColumn) return;

    dispatch(
      rearrangeColumns({
        accessToken: accessToken,
        boardId: board_id,
        columns_id: columnIds,
      })
    );
    setIsEditing(true);
  };

  useEffect(() => {
    if (boardsStatus === 'succeeded' && isEditing) {
      dispatch(getBoards(accessToken as string));
      setIsEditing(false);
    }
  }, [dispatch, accessToken, isEditing, boardsStatus]);

  return (
    <div className="dropdown">
      <div
        tabIndex={0}
        role="button"
        title="trigger"
        className="!px-3 !py-2 rounded-md hover:bg-gray-200"
      >
        <BsThreeDots className="cursor-pointer" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content !fixed menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <li>
          <div className="flex !justify-between h-12 mb-1 p-4 w-full">
            <AlertDialogModal
              buttonLabel="Move List"
              buttonVariant="ghost"
              dialogTitle="Move List"
              buttonCancel="Discard"
              buttonConfirm="Move"
              actionFunction={handleMoveList}
              stylings="bg-none hover:!bg-gray-200 py-4 !pl-0 pr-[72px] m-0 active:!bg-gray-800 active:text-gray-200"
            >
              <Select onValueChange={(e) => setSelectedColumn(parseInt(e))}>
                <SelectTrigger className="w-[264px] mx-auto">
                  <SelectValue
                    placeholder={
                      'Position ' +
                      (columnOrder + 1) +
                      ' - ' +
                      columnData?.name.toUpperCase() +
                      ' (Current)'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {currentBoardColumns?.map((column) => (
                      <SelectItem
                        key={column.order}
                        value={column.order.toString()}
                      >
                        Position {column.order + 1} -{' '}
                        {column.name.toUpperCase()}{' '}
                        {column.order === columnOrder && '(Current)'}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </AlertDialogModal>
            <RiDragMove2Fill className="w-4 h-4" />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ThreeDotsMenu;
