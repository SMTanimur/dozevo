'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Upload, icons } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icon } from '@/components/ui/icon';
import { ISpace } from '@/types';
import { IList } from '@/types/list';
import { ScrollArea } from '@/components/ui/scroll-area';
import { preferredIconNames } from '@/constants';

const colors = [
  { name: 'purple', value: '#8B5CF6' },
  { name: 'blue', value: '#3B82F6' },
  { name: 'light-blue', value: '#38BDF8' },
  { name: 'teal', value: '#2DD4BF' },
  { name: 'green', value: '#22C55E' },
  { name: 'yellow', value: '#F59E0B' },
  { name: 'orange', value: '#F97316' },
  { name: 'red', value: '#EF4444' },
  { name: 'pink', value: '#EC4899' },
  { name: 'purple-dark', value: '#9333EA' },
  { name: 'brown', value: '#78716C' },
  { name: 'black', value: '#000000' },
];

// Use a subset of icons that actually exist in the lucide library
// These will be populated at runtime
const commonIcons: (keyof typeof icons)[] = [];

interface ColorIconPickerProps {
  initialColor?: string;
  initialIcon?: string;
  itemType?: 'space' | 'list';
  onColorChange?: (color: string) => void;
  onIconChange?: (icon: string) => void;
  item?: ISpace | IList;
  onClose?: () => void;
}

export function ColorIconPicker({
  initialColor,
  initialIcon,
  onColorChange,
  itemType = 'space',
  onIconChange,
  onClose,
  item,
}: ColorIconPickerProps) {
  const [selectedColor, setSelectedColor] = useState<string>(
    initialColor || colors[0].value
  );
  const [selectedIcon, setSelectedIcon] = useState<string>(initialIcon || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize common icons on component mount
  useEffect(() => {
    // Get all available icon names
    const availableIcons = Object.keys(icons) as (keyof typeof icons)[];

    // First try to find preferred icons
    preferredIconNames.forEach(name => {
      // Check if any icon in the library contains this name
      const found = availableIcons.find(icon =>
        icon.toLowerCase().includes(name.toLowerCase())
      );

      if (found && !commonIcons.includes(found)) {
        commonIcons.push(found);
      }
    });
  }, []);

  // Filter icons based on search term
  const filteredIcons = useMemo(() => {
    if (!searchQuery) {
      return commonIcons.length > 0
        ? commonIcons
        : (Object.keys(icons).slice(0, 50) as (keyof typeof icons)[]);
    }

    return Object.keys(icons).filter(icon =>
      icon.toLowerCase().includes(searchQuery.toLowerCase())
    ) as (keyof typeof icons)[];
  }, [searchQuery]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (onColorChange) {
      onColorChange(color);
    }
  };

  const handleIconSelect = (icon: string) => {
    setSelectedIcon(icon);
    if (onIconChange) {
      onIconChange(icon);
    }
  };

  return (
    <TooltipProvider>
      <div className='p-4'>
        <div>
          <h3 className='text-sm font-medium mb-3'>Color</h3>
          <div className='grid grid-cols-7 gap-2'>
            {colors.slice(0, 9).map(color => (
              <Tooltip key={color.name}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      'w-6 h-6 rounded-full transition-all duration-200',
                      selectedColor === color.value
                        ? 'ring-2 ring-offset-2 ring-gray-400'
                        : 'hover:scale-110'
                    )}
                    style={{ backgroundColor: color.value }}
                    onClick={e => {
                      e.stopPropagation();
                      handleColorSelect(color.value);
                      onClose?.();
                    }}
                    type='button'
                  />
                </TooltipTrigger>
                <TooltipContent>{color.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className='mt-6'>
          <div className='flex justify-between mb-3'>
            <div className='relative'>
              <Search className='absolute left-2 top-2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search icons...'
                className='pl-8 h-8 w-[150px]'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant='outline' size='sm' className='h-8 px-3'>
              <Upload className='h-4 w-4 mr-1' />
              Upload
            </Button>
          </div>

          <ScrollArea className='h-[300px]'>
            <div className='grid grid-cols-6 sm:grid-cols-9 gap-3 p-2'>
              {itemType === 'space' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type='button'
                      onClick={e => {
                        e.stopPropagation();
                        handleIconSelect('');
                      }}
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-md border transition-colors'
                      )}
                      style={{ backgroundColor: selectedColor || '#f3f4f6' }}
                    >
                      <span className='text-sm font-bold text-white'>
                        {item?.name?.charAt(0).toUpperCase()}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Text Initial</TooltipContent>
                </Tooltip>
              )}
              {filteredIcons.length > 0 ? (
                filteredIcons.map(iconName => (
                  <Tooltip key={iconName}>
                    <TooltipTrigger asChild>
                      <button
                        type='button'
                        onClick={e => {
                          e.stopPropagation();
                          handleIconSelect(iconName);
                          onClose?.();
                        }}
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-md border transition-colors',
                          selectedIcon === iconName
                            ? 'border-primary bg-primary/10'
                            : 'border-transparent hover:border-muted-foreground/20 hover:bg-muted'
                        )}
                      >
                        <Icon name={iconName} className='h-4 w-4' />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{iconName}</TooltipContent>
                  </Tooltip>
                ))
              ) : (
                <div className='col-span-9 py-8 text-center text-muted-foreground'>
                  No icons found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className='mt-4 flex justify-end'>
          <Button
            variant='outline'
            size='sm'
            className='mr-2'
            onClick={e => {
              e.stopPropagation();
              onClose?.();
            }}
          >
            Close
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
