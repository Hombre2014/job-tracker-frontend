'use client';

import { useState, forwardRef, useEffect } from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { useAppSelector } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { TokenManager } from '@/utils/TokenManager';
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

const ComboBoardListBox = forwardRef<HTMLDivElement, ComboBoardListBoxProps>(
  (
    {
      items,
      itemsType,
      searchItem,
      initialBoardString,
      initialColumnString,
      firstColumnOfTheBoard,
      value,
      onSelectItem,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const hasValidTokens = TokenManager.hasValidTokens();
    const { lastName } = useAppSelector((state) => state.user);
    const { firstName } = useAppSelector((state) => state.user);
    const { boardsStatus } = useAppSelector((state) => state.boards);
    const [internalValue, setInternalValue] = useState(
      initialBoardString || initialColumnString || ''
    );

    // Sync controlled value
    useEffect(() => {
      if (value !== undefined) setInternalValue(value);
    }, [value]);

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
              {internalValue ||
                (itemsType === 'boards'
                  ? initialBoardString
                  : initialColumnString) ||
                'Select'}
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
                        'hover:!bg-slate-200 dark:hover:!bg-slate-600 cursor-pointer my-[2px]',
                        internalValue === item.name
                          ? '!bg-slate-200 dark:!bg-slate-600'
                          : '!bg-white dark:!bg-slate-800'
                      )}
                      value={internalValue}
                      onSelect={() => {
                        setInternalValue(item.name);
                        onSelectItem?.(item);
                        setOpen(false);
                      }}
                    >
                      <CheckIcon
                        key={item.id}
                        className={cn(
                          'mr-2 h-4 w-4',
                          internalValue === item.name
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
