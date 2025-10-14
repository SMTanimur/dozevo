'use client';

import React from 'react';
import { useThemeStore } from '@/stores';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette, Check } from 'lucide-react';
import { cn } from '@/lib';

const themes = [
  { name: 'zinc', label: 'Zinc', color: '#71717a' },
  { name: 'neutral', label: 'Neutral', color: '#737373' },
  { name: 'red', label: 'Red', color: '#ef4444' },
  { name: 'rose', label: 'Rose', color: '#f43f5e' },
  { name: 'orange', label: 'Orange', color: '#f97316' },
  { name: 'green', label: 'Green', color: '#22c55e' },
  { name: 'blue', label: 'Blue', color: '#3b82f6' },
  { name: 'yellow', label: 'Yellow', color: '#eab308' },
  { name: 'violet', label: 'Violet', color: '#8b5cf6' },
];

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='rounded-lg hover:bg-primary/10 hover:border-primary/50'
        >
          <Palette className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map(t => (
          <DropdownMenuItem
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={cn(
              'flex items-center justify-between cursor-pointer',
              theme === t.name && 'bg-accent'
            )}
          >
            <div className='flex items-center gap-2'>
              <div
                className='w-4 h-4 rounded-full border-2 border-border'
                style={{ backgroundColor: t.color }}
              />
              <span>{t.label}</span>
            </div>
            {theme === t.name && <Check className='h-4 w-4 text-primary' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
