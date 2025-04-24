'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Preset color options
const colorOptions = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Neutral', value: '#a3a3a3' },
  { name: 'Stone', value: '#78716c' },
  { name: 'Black', value: '#000000' },
];

interface ColorPickerProps {
  selected: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ selected, onChange }: ColorPickerProps) {
  return (
    <div className=' flex flex-col gap-3'>
      <label className='text-sm font-medium'>Space color</label>
      <div className='grid grid-cols-6 gap-2 sm:grid-cols-7 md:grid-cols-8'>
        {colorOptions.map(color => (
          <button
            key={color.value}
            type='button'
            onClick={() => onChange(color.value)}
            className={cn(
              'h-5 w-5 rounded-full transition-all',
              selected === color.value
                ? 'ring-2 ring-offset-2 ring-primary'
                : ''
            )}
            style={{ backgroundColor: color.value }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          />
        ))}
      </div>
    </div>
  );
}
