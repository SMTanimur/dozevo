'use client';

import React, { useState } from 'react';
import { icons, Upload, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState('color');

  // Get first letter of space name or use the first letter of the icon name or 'M' as default
  const displayLetter =
    !icon && spaceName
      ? spaceName.charAt(0).toUpperCase()
      : icon
      ? icon.charAt(0).toUpperCase()
      : 'M';

  // Handle uploads (mock implementation)
  const handleUpload = () => {
    // This would open a file picker dialog in a real implementation
    console.log('File upload clicked');
    // For demo purposes, you could set a predefined icon here
    // onIconChange('Image');
  };

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

        <PopoverContent className='max-w-64 w-full p-3' align='start'>
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

          <Tabs
            defaultValue='color'
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className='flex justify-between items-center p-4 border-b'>
              <TabsList>
                <TabsTrigger value='color'>Color</TabsTrigger>
                <TabsTrigger value='icon'>Icon</TabsTrigger>
              </TabsList>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 gap-1 text-xs text-muted-foreground hover:text-foreground'
                onClick={handleUpload}
              >
                <Upload className='h-3 w-3' />
                Upload
              </Button>
            </div>

            <TabsContent value='color' className='p-4 pt-2'>
              <ColorPicker
                selected={color || ''}
                onChange={newColor => {
                  onColorChange(newColor);
                }}
              />
            </TabsContent>

            <TabsContent value='icon' className='pt-2 w-full'>
              <IconPicker
                spaceName={displayLetter}
                color={color}
                selected={icon || ''}
                onChange={newIcon => {
                  onIconChange(newIcon);
                }}
              />
            </TabsContent>

            <div className='p-4 border-t'>
              <Button
                className='w-full'
                size='sm'
                onClick={() => setOpen(false)}
              >
                Done
              </Button>
            </div>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
}
