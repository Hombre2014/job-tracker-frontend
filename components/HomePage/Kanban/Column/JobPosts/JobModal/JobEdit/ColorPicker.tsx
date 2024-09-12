import { TwitterPicker } from 'react-color';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ColorPicker = () => {
  return (
    <div className="space-y-1 w-1/3 flex flex-col">
      <Label htmlFor="color" className="pb-2">
        Color
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <DropdownMenuTrigger asChild>
            <Button
              id="color"
              variant="none"
              className="!bg-blue-700 !w-full !h-[34px] !rounded-md mt-[2px]"
            ></Button>
          </DropdownMenuTrigger>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <TwitterPicker />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button variant="outline" className="w-full">
              Reset company color
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ColorPicker;
