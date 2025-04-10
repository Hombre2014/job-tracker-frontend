import { debounce } from 'lodash';
import { RiCloseLine } from 'react-icons/ri';
import { HiOutlinePhone } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useCallback } from 'react';
import { RxEnvelopeClosed, RxChevronDown } from 'react-icons/rx';
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
    value: 'WORK',
    label: 'WORK',
  },
  {
    value: 'PERSONAL',
    label: 'PERSONAL',
  },
];

interface EmailAndPhoneProps {
  id: string;
  value: string;
  initialType: string;
  contact: 'email' | 'phone';
  returnData: (contact: 'email' | 'phone', id: string) => void;
  handleChange: (id: string, value: string, type: string) => void;
}

const EmailAndPhone = ({
  id,
  value,
  contact,
  returnData,
  initialType,
  handleChange,
}: EmailAndPhoneProps) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(initialType);
  const [inputValue, setInputValue] = useState(value);

  const removeContact = () => {
    returnData(contact, id);
  };

  const debouncedHandleChange = useCallback(
    debounce((id: string, value: string, type: string) => {
      handleChange(id, value, type);

      const storageKey = contact === 'email' ? 'emails' : 'phones';
      const existingItems = JSON.parse(
        localStorage.getItem(storageKey) || '[]'
      ) as any[];
      const updatedItems = existingItems.filter((item) => item.id !== id); // Remove any existing item with the same id
      if (contact === 'email') {
        updatedItems.push({ email: value, type });
      } else {
        updatedItems.push({ phone: value, type });
      }
      const nonEmptyItems = updatedItems.filter(
        (item) => item.email || item.phone
      ); // Filter out empty items
      localStorage.setItem(storageKey, JSON.stringify(nonEmptyItems));
      console.log('updatedItems: ', nonEmptyItems);
    }, 300),
    [contact]
  );

  useEffect(() => {
    if (inputValue) {
      debouncedHandleChange(id, inputValue, type);
    }
    return () => {
      debouncedHandleChange.cancel();
    };
  }, [inputValue, id, type, debouncedHandleChange]);

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
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (e.target.value) {
                handleChange(id, e.target.value, type); // Add the record to the state when the user types a value
              }
            }}
            onBlur={() => {
              if (inputValue) {
                debouncedHandleChange(id, inputValue, type);
              }
            }} // Save on blur if inputValue is not empty
            className="outline-none bg-transparent border-none pl-2 text-sm"
            placeholder={contact.charAt(0).toUpperCase() + contact.slice(1)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                value={type}
                role="combobox"
                variant="outline"
                aria-expanded={open}
                className="w-fit justify-between !h-7 !px-2"
              >
                <span className="text-xs">{type}</span>
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
                          setType(currentValue);
                          setOpen(false);
                          if (inputValue) {
                            debouncedHandleChange(id, inputValue, currentValue); // Ensure the type is saved when changed
                          }
                        }}
                      >
                        <span className="text-xs">{type.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <RiCloseLine
            onClick={removeContact}
            className="text-gray-500 hover:cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default EmailAndPhone;
