'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocalStorage } from 'usehooks-ts';
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
  firstColumnOfTheBoard,
}: ComboBoardListBoxProps) => {
  const { board_id } = useParams();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const { lastName } = useAppSelector((state) => state.user);
  const { firstName } = useAppSelector((state) => state.user);
  const { boardsStatus } = useAppSelector((state) => state.boards);
  const [valueBoard, setValueBoard] = useState(initialBoardString);
  const firstColumn = localStorage.getItem('firstColumnOfTheBoard');

  const [chosenColumn, setChosenColumn] = useState(initialColumnString);

  const [chosenBoard, setChosenBoard] =
    useState(initialBoardString) || localStorage.getItem('chosenBoard');

  const [boardValueChanged, setBoardValueChanged] = useLocalStorage(
    'boardValueChanged',
    false
  );

  const useStringLocalStorage = (key: string, initialValue: string) => {
    const [storedValue, setStoredValue] = useState(() => {
      // Read raw value from localStorage or fall back to the initial value
      const saved = localStorage.getItem(key);
      return saved !== null ? saved : initialValue;
    });

    const setRawValue = (value: string) => {
      // Directly set raw value in localStorage and update state
      localStorage.setItem(key, value);
      setStoredValue(value);
    };

    return [storedValue, setRawValue] as const;
  };

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
  }, [valueBoard, chosenBoard, chosenColumn, itemsType, firstColumnOfTheBoard]);

  useEffect(() => {
    if (boardValueChanged) {
      localStorage.setItem('chosenColumn', firstColumnOfTheBoard!);
      // Get the columnId of the first column of the board

      const columnId = items.find(
        (item) => item.name === firstColumnOfTheBoard
      )?.id;
      localStorage.setItem('columnId', columnId as string);
      // if (chosenColumn === firstColumnOfTheBoard) {
      //   localStorage.setItem('chosenColumn', firstColumnOfTheBoard!);
      // }
    }
  }, [boardValueChanged, chosenColumn, firstColumnOfTheBoard]);

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
            {itemsType === 'boards'
              ? valueBoard
              : boardValueChanged
              ? firstColumn
              : chosenColumn}
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
                    value={itemsType === 'boards' ? valueBoard : chosenColumn}
                    onSelect={() => {
                      itemsType === 'boards'
                        ? (setChosenBoard(item.name),
                          setChosenColumn(firstColumn!),
                          setValueBoard(item.name),
                          setBoardValueChanged(true))
                        : (setBoardValueChanged(false),
                          setChosenColumn(item.name));
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
