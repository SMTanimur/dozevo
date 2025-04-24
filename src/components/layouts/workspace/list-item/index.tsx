'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import { Icon } from '@/components/ui';
import { icons } from 'lucide-react';

interface ListItemProps {
  href: string;
  icon: keyof typeof icons;
  label: string;
  color: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  indent?: boolean;
  variant?: 'default' | 'accent';
  actions?: ReactNode;
}

export function ListItem({
  href,
  icon,
  label,
  color,
  isActive = false,
  isCollapsed = false,
  variant = 'default',
  actions,
}: ListItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = () => {
    if (icon) {
      return (
        <Icon
          name={icon as keyof typeof icons}
          className='h-3 w-3 text-white'
        />
      );
    }
    return (
      <span className='text-xs text-white'>
        {label.charAt(0).toUpperCase()}
      </span>
    );
  };

  return (
    <Link
      href={href}
      className={cn(
        'flex w-full items-center gap-2 overflow-hidden rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted',
        isActive && variant === 'default' && 'bg-muted text-foreground',
        isActive &&
          variant === 'accent' &&
          'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='flex shrink-0 items-center gap-2 justify-center'>
        <div
          className='flex h-6 w-6 items-center justify-center rounded-sm'
          style={{ backgroundColor: color ? color : '#ec4899' }}
        >
          <IconComponent />
        </div>
        <span className='truncate'>{label}</span>
      </div>

      {!isCollapsed && (
        <>
          {actions && (
            <div
              className={cn(
                'ml-auto items-center gap-1',
                isHovered ? 'flex' : 'hidden'
              )}
            >
              {actions}
            </div>
          )}
        </>
      )}
      <div className={cn('ml-auto pr-2', isHovered ? 'hidden' : 'block')}>
        <span>4</span>
      </div>
    </Link>
  );
}
