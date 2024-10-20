import { useState } from 'react';
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
  const [companyColor, setCompanyColor] = useState('#8b5cf6');

  const handleColorChange = (color: any) => {
    setCompanyColor(color.hex);
    console.log('color: ', color.hex);
    localStorage.setItem('chosenCompanyColor', color.hex);
    // TODO: Dispatch update jobPost with the new color
    // dispatch(updateJobPost(color.hex));
  };

  const handleResetColor = () => {
    setCompanyColor('#8b5cf6');
  };

  return (
    <div className="space-y-1 w-1/3 flex flex-col">
      <Label htmlFor="color" className="pb-2">
        Color
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <DropdownMenuTrigger asChild>
            <div
              style={{ backgroundColor: companyColor }}
              id="color"
              className="!w-full !h-[34px] !rounded-md mt-[2px]"
            ></div>
          </DropdownMenuTrigger>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <TwitterPicker color={companyColor} onChange={handleColorChange} />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResetColor}
            >
              Reset company color
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ColorPicker;
