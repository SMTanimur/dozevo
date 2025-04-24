'use client';

import React, { useState, useEffect } from 'react';
import { icons } from 'lucide-react';
import { Input } from '@/components/ui';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

// Use a subset of icons that actually exist in the lucide library
// These will be populated at runtime
const commonIcons: (keyof typeof icons)[] = [];

// List of icon names we want to use if they exist
const preferredIconNames = [
  'Folder',
  'File',
  'Users',
  'Briefcase',
  'BarChart',
  'Calendar',
  'CheckSquare',
  'Mail',
  'MessageSquare',
  'Settings',
  'Star',
  'Target',
  'Zap',
  'Award',
  'Bell',
  'Book',
  'Clock',
  'Coffee',
  'Compass',
  'Database',
  'Pencil',
  'FilePlus',
  'Flag',
  'Heart',
  'Building',
  'Image',
  'Link',
  'Map',
  'Monitor',
  'Moon',
  'Music',
  'Package',
  'Paperclip',
  'Phone',
  'Printer',
  'Shield',
  'ShoppingBag',
  'Sun',
  'Truck',
  'Upload',
  'UserPlus',
  'Video',
  'Code',
  'Box',
  'LayoutGrid',
  'Layout',
  'GitBranch',
  'Headphones',
  'Info',
];

interface IconPickerProps {
  selected: string;
  onChange: (icon: string) => void;
  spaceName?: string;
  color?: string;
}

export function IconPicker({
  selected,
  onChange,
  color = '',
  spaceName = 'M',
}: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');

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
  const filteredIcons = Object.keys(icons).filter(icon =>
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  ) as (keyof typeof icons)[];

  return (
    <div className='space-y-4 w-full'>
      <div className='space-y-2 w-full'>
        <label className='text-sm font-medium'>Icon</label>

        <div className='flex items-center gap-2'>
          <div
            className={cn(
              'h-8 w-8 flex items-center text-white justify-center rounded-md border'
            )}
            style={{ backgroundColor: color || '#f3f4f6' }}
          >
            {selected ? (
              <Icon name={selected as keyof typeof icons} className='h-4 w-4' />
            ) : (
              <span className='text-lg font-bold text-white'>
                {spaceName ?? 'M'}
              </span>
            )}
          </div>

          <div className='relative flex-1'>
            <Input
              placeholder='Search avatars'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-8'
            />
            <Icon
              name='Search'
              className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground'
            />
          </div>
        </div>
      </div>

      <ScrollArea className='h-32 w-full rounded-md border p-2'>
        <div className='grid grid-cols-6 gap-1 p-2 w-full'>
          {/* Text Option Button with the same styling as icon buttons */}
          <button
            type='button'
            onClick={() => onChange('')}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md border transition-colors'
            )}
            style={{ backgroundColor: color || '#f3f4f6' }}
          >
            <span className='text-sm font-bold text-white'>{spaceName}</span>
          </button>

          {filteredIcons.length > 0 ? (
            filteredIcons.map(iconName => (
              <button
                key={iconName}
                type='button'
                onClick={() => onChange(iconName)}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
                  selected === iconName
                    ? 'border-primary bg-primary/10'
                    : 'border-transparent hover:border-muted-foreground/20 hover:bg-muted'
                )}
              >
                <Icon name={iconName} className='h-4 w-4' />
              </button>
            ))
          ) : (
            <div className='col-span-6 py-8 text-center text-muted-foreground'>
              No icons found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
