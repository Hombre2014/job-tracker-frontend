'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { useAppSelector } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
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
  initialString,
}: ComboBoardListBoxProps) => {
  const { board_id } = useParams();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const { lastName } = useAppSelector((state) => state.user);
  const { firstName } = useAppSelector((state) => state.user);
  const [chosenColumn, setChosenColumn] = useState(initialString);
  const { boardsStatus } = useAppSelector((state) => state.boards);
  const currentBoardName = items.find((item) => item.id === board_id)?.name;
  const [chosenBoard, setChosenBoard] = useState(currentBoardName);

  useEffect(() => {
    if (itemsType === 'boards') {
      localStorage.setItem('chosenBoard', chosenBoard as string);
    } else {
      localStorage.setItem('chosenColumn', chosenColumn as string);
    }
  }, [value, chosenBoard, chosenColumn, itemsType]);

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
            {value
              ? items.find((item) => item.name === value)?.name
              : `${initialString}`}
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
                    value={item.name}
                    onSelect={() => {
                      itemsType === 'boards'
                        ? setChosenBoard(item.name)
                        : setChosenColumn(item.name);
                      setValue(item.name);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      key={item.id}
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === item.name ? 'opacity-100' : 'opacity-0'
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
