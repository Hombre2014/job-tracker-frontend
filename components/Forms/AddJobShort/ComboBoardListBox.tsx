'use client';

import { useLocalStorage } from 'usehooks-ts';
import { useEffect, useState, forwardRef, useMemo } from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TokenManager } from '@/utils/TokenManager';
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

interface ComboBoardListBoxProps {
  searchItem: string;
  initialBoardString?: string;
  initialColumnString?: string;
  firstColumnOfTheBoard?: string;
  itemsType: 'boards' | 'columns';
  items: Array<{
    id: string;
    name: string;
  }>;
}

const ComboBoardListBox = forwardRef<HTMLDivElement, ComboBoardListBoxProps>(
  (
    {
      items,
      itemsType,
      searchItem,
      initialBoardString,
      initialColumnString,
      firstColumnOfTheBoard,
    },
    ref
  ) => {
    const dispatch = useAppDispatch();

    const [open, setOpen] = useState(false);
    const accessToken = TokenManager.getAccessToken();
    const hasValidTokens = TokenManager.hasValidTokens();
    const { lastName } = useAppSelector((state) => state.user);
    const { firstName } = useAppSelector((state) => state.user);
    const { boardsStatus } = useAppSelector((state) => state.boards);
    const [valueBoard, setValueBoard] = useState(initialBoardString);
    const firstColumn = localStorage.getItem('firstColumnOfTheBoard');
    const [chosenBoard, setChosenBoard] = useState(initialBoardString);
    const [chosenColumn, setChosenColumn] = useState(initialColumnString);
    const [boardValueChanged, setBoardValueChanged] = useLocalStorage(
      'boardValueChanged',
      false
    );

    // Memoize authentication dependencies to reduce re-renders
    const authDeps = useMemo(
      () => ({
        accessToken,
        hasValidTokens,
      }),
      [accessToken, hasValidTokens]
    );

    useEffect(() => {
      // Only set localStorage if user is authenticated
      if (authDeps.hasValidTokens) {
        if (itemsType === 'boards') {
          localStorage.setItem('chosenBoard', chosenBoard as string);
          const boardId = items.find((item) => item.name === chosenBoard)?.id;
          const values = {
            accessToken: authDeps.accessToken,
            boardId: boardId,
          };
          dispatch(getBoardWithColumns(values));
        } else {
          localStorage.setItem('chosenColumn', chosenColumn as string);
          const columnId = items.find((item) => item.name === chosenColumn)?.id;
          localStorage.setItem('columnId', columnId as string);
        }
      }
    }, [
      itemsType,
      valueBoard,
      chosenBoard,
      authDeps,
      chosenColumn,
      firstColumnOfTheBoard,
      dispatch,
      items,
    ]);

    useEffect(() => {
      if (boardValueChanged && authDeps.hasValidTokens) {
        localStorage.setItem('chosenColumn', firstColumnOfTheBoard!);

        const columnId = items.find(
          (item) => item.name === firstColumnOfTheBoard
        )?.id;
        localStorage.setItem('columnId', columnId as string);
      }
    }, [
      boardValueChanged,
      chosenColumn,
      firstColumnOfTheBoard,
      authDeps,
      items,
    ]);

    return (
      boardsStatus === 'succeeded' && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              role="combobox"
              variant="outline"
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
                className="h-9"
                placeholder={`Search ${searchItem}`}
              />
              <CommandList>
                <CommandEmpty>Nothing found.</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      className={cn(
                        'hover:!bg-slate-200 cursor-pointer my-[2px]',
                        itemsType === 'boards'
                          ? chosenBoard === item.name
                            ? '!bg-slate-200'
                            : '!bg-white'
                          : chosenColumn === item.name
                          ? '!bg-slate-200'
                          : '!bg-white'
                      )}
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
                          itemsType === 'boards'
                            ? chosenBoard === item.name
                              ? 'opacity-100'
                              : 'opacity-0'
                            : chosenColumn === item.name
                            ? 'opacity-100'
                            : 'opacity-0'
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
  }
);

ComboBoardListBox.displayName = 'ComboBoardListBox';

export default ComboBoardListBox;
