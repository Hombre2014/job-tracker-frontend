import { useState } from 'react';
import { useParams } from 'next/navigation';
import { TwitterPicker } from 'react-color';

import { Label } from '@/components/ui/label';
import { useAppSelector } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { defaultJobPostColor } from '@/data/constants';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const ColorPicker = ({ id, sendData }: ColorPickerProps) => {
  const { job_id } = useParams();
  const { jobPosts } = useAppSelector((state) => state.jobs);
  const currentJobPost = jobPosts.find((jobPost) => jobPost.id === job_id);

  const [companyColor, setCompanyColor] = useState(
    currentJobPost?.color || defaultJobPostColor
  );

  const handleColorChange = (color: any) => {
    setCompanyColor(color.hex);
    sendData(id as keyof JobApplication, color.hex);
  };

  const handleResetColor = () => {
    setCompanyColor(defaultJobPostColor);
    sendData(id as keyof JobApplication, defaultJobPostColor);
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
            <TwitterPicker
              color={companyColor}
              onChangeComplete={handleColorChange}
              colors={[
                '#FF6900',
                '#FCB900',
                '#7BDCB5',
                '#00D084',
                '#8ED1FC',
                '#0693E3',
                '#ABB8C3',
                '#EB144C',
                '#F78DA7',
                '#7c2d12',
                '#857e28',
                '#d531e4',
                '#f04141',
                '#6a776b',
              ]}
            />
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
