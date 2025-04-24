import { ISpace } from '@/types';
import React from 'react';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui';
import { Plus } from 'lucide-react';

export enum ListItemType {}
interface ListItemPlusProps {
  itemPlusType: 'space' | 'list';
  space: ISpace;
}

export const ListItemPlus = ({ itemPlusType, space }: ListItemPlusProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-6 w-6 cursor-pointer'
          isTooltip
          tooltipContent={
            itemPlusType === 'space'
              ? 'Create Lists, Docs and more'
              : 'Create Tasks, Notes and more'
          }
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <Plus className='h-3 w-3' />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Create Lists, Docs and more</p>
      </PopoverContent>
    </Popover>
  );
};
