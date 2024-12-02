'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { getBoardWithColumns } from '@/redux/boards/boardsThunk';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/components/ui/command';

const ComboBoardListBox = ({
  items,
  itemsType,
  searchItem,
  initialBoardString,
  initialColumnString,
  sendDataToParent,
}: ComboBoardListBoxProps) => {
  const { board_id } = useParams();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const { lastName } = useAppSelector((state) => state.user);
  const { firstName } = useAppSelector((state) => state.user);
  const [chosenColumn, setChosenColumn] = useState(initialColumnString);
  const { boardsStatus } = useAppSelector((state) => state.boards);
  // const currentBoardName = items.find((item) => item.id === board_id)?.name;
  const [chosenBoard, setChosenBoard] =
    useState(initialBoardString) || localStorage.getItem('chosenBoard');

  const [boardValueChanged, setBoardValueChanged] = useState(false);

  const [valueBoard, setValueBoard] = useState(initialBoardString);
  const [valueColumn, setValueColumn] = useState(initialColumnString);

  console.log('ValueBoard: ', valueBoard);
  console.log('ValueColumn: ', valueColumn);

  const firstColumn =
    localStorage.getItem('firstColumnOfTheBoard') || initialColumnString;

  useEffect(() => {
    if (itemsType === 'boards') {
      localStorage.setItem('chosenBoard', chosenBoard as string);
      const values = {
        accessToken,
        boardId: board_id,
      };
      dispatch(getBoardWithColumns(values));
    } else {
      localStorage.setItem('chosenColumn', chosenColumn as string);
      const columnId = items.find((item) => item.name === chosenColumn)?.id;
      localStorage.setItem('columnId', columnId as string);
    }
  }, [valueBoard, chosenBoard, chosenColumn, itemsType]);

  console.log('chosenBoard: ', chosenBoard);
  console.log('chosenColumn: ', chosenColumn);

  const handleBoardChange = () => {
    sendDataToParent(chosenBoard!);
  };

  const displayValue = controlledValue || initialString;

  return (
    boardsStatus === 'succeeded' && (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {/* {itemsType === 'boards'
              ? chosenBoard
              : localStorage.getItem('firstColumnOfTheBoard')} */}
            {/* {valueBoard
              ? items.find((item) => item.name === valueBoard)?.name
              : itemsType === 'boards'
              ? chosenBoard
              : chosenColumn} */}
            {itemsType === 'boards' ? valueBoard : valueColumn}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${searchItem}`}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>Nothing found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={itemsType === 'boards' ? valueBoard : valueColumn}
                    onSelect={() => {
                      itemsType === 'boards'
                        ? (setChosenBoard(item.name),
                          setChosenColumn(firstColumn),
                          setValueBoard(item.name),
                          setBoardValueChanged(true),
                          { handleBoardChange })
                        : (setChosenColumn(item.name),
                          setValueColumn(item.name));

                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      key={item.id}
                      className={cn(
                        'mr-2 h-4 w-4',
                        valueBoard === item.name ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div>
                      <span>{item.name}&nbsp;</span>
                      <span className="opacity-40">
                        {itemsType === 'boards'
                          ? `${firstName} ${lastName}`
                          : ''}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  );
};

export default ComboBoardListBox;
