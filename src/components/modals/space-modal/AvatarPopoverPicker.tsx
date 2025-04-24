'use client';

import React, { useState } from 'react';
import { icons, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconPicker } from './IconPicker';
import { ColorPicker } from './ColorPicker';

interface AvatarPopoverPickerProps {
  icon: string;
  color: string;
  spaceName?: string;
  onIconChange: (icon: string) => void;
  onColorChange: (color: string) => void;
}

export function AvatarPopoverPicker({
  icon,
  color,
  spaceName = '',
  onIconChange,
  onColorChange,
}: AvatarPopoverPickerProps) {
  const [open, setOpen] = useState(false);

  // Get first letter of space name or use the first letter of the icon name or 'M' as default
  const displayLetter =
    !icon && spaceName
      ? spaceName.charAt(0).toUpperCase()
      : icon
      ? icon.charAt(0).toUpperCase()
      : 'M';



  return (
    <div className='space-y-2'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type='button'
            className={cn(
              'h-8 w-8 rounded-md cursor-pointer border-2 text-xl font-semibold flex items-center justify-center transition-colors'
            )}
            style={{ backgroundColor: color || '#f3f4f6' }}
            aria-label='Select space icon and color'
          >
            {icon ? (
              <Icon
                name={icon as keyof typeof icons}
                className='h-4 w-4 text-white'
              />
            ) : (
              <span className='text-lg text-white font-semibold'>
                {displayLetter}
              </span>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent className='max-w-72 w-full p-3' align='start'>
          <div className='flex justify-between items-center p-2 border-b'>
            <p className='text-sm font-medium ml-2'>Customize</p>
            <Button
              variant='ghost'
              size='sm'
              className='h-7 w-7 p-0'
              onClick={() => setOpen(false)}
            >
              <X className='h-4 w-4' />
              <span className='sr-only'>Close</span>
            </Button>
          </div>

          <div className='flex flex-col gap-6'>
            <ColorPicker
              selected={color || ''}
              onChange={newColor => {
                onColorChange(newColor);
              }}
            />

            <IconPicker
              spaceName={displayLetter}
              color={color}
              selected={icon || ''}
              onChange={newIcon => {
                onIconChange(newIcon);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
