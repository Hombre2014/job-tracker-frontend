import { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { HiOutlinePhone } from 'react-icons/hi';
import { RxEnvelopeClosed } from 'react-icons/rx';

import { RxChevronDown } from 'react-icons/rx';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandItem,
  CommandList,
  CommandGroup,
} from '@/components/ui/command';

const types = [
  {
    value: 'work',
    label: 'work',
  },
  {
    value: 'personal',
    label: 'personal',
  },
];

interface EmailAndPhoneProps {
  id: string;
  contact: 'email' | 'phone';
  returnData: (type: 'email' | 'phone', id: string) => void;
}

const EmailAndPhone = ({ id, contact, returnData }: EmailAndPhoneProps) => {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const removeContact = () => {
    returnData(contact, id);
  };

  return (
    <div className="w-full px-2">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          {contact === 'email' ? (
            <RxEnvelopeClosed size={20} className="text-gray-500" />
          ) : (
            <HiOutlinePhone size={20} className="text-gray-500" />
          )}
          <input
            name="contact"
            title="contact"
            className="outline-none bg-transparent border-none pl-2 text-sm"
            placeholder={contact.charAt(0).toUpperCase() + contact.slice(1)}
          ></input>
        </div>
        <div className="flex items-center gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                value={value}
                role="combobox"
                variant="outline"
                aria-expanded={open}
                className="w-fit justify-between !h-7 !px-2"
              >
                {value ? value : 'work'}
                <RxChevronDown className="opacity-50 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[98px] p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {types.map((type) => (
                      <CommandItem
                        key={type.value}
                        value={type.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue);
                          setOpen(false);
                        }}
                      >
                        {type.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <RiCloseLine
            className="text-gray-500 hover:cursor-pointer"
            onClick={removeContact}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailAndPhone;
