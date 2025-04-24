'use client';

import { ReactNode } from 'react';
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
  onExpand?: () => void;
  indent?: boolean;
  variant?: 'default' | 'accent';
  actions?: ReactNode;
  onClick?: () => void;
}

export function ListItem({
  href,
  icon,
  label,
  color,
  isActive = false,
  isCollapsed = false,
  onExpand,
  variant = 'default',
  actions,
  onClick,
}: ListItemProps) {
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

  const item = (
    <Link
      href={href}
      className={cn(
        'group flex w-full items-center gap-2 overflow-hidden rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted',
        isActive && variant === 'default' && 'bg-muted text-foreground',
        isActive &&
          variant === 'accent' &&
          'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
      )}
      onClick={e => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div
        className='flex shrink-0 group items-center gap-2 justify-center'
        onClick={onExpand}
      >
        <div
          className='flex h-6 w-6   items-center justify-center rounded-sm'
          style={{ backgroundColor: color ? color : '#ec4899' }}
        >
          <IconComponent />
        </div>
        <span className='truncate'>{label}</span>
      </div>

      {!isCollapsed && (
        <>
          {actions && (
            <div className='ml-auto flex items-center gap-1'>{actions}</div>
          )}
        </>
      )}
    </Link>
  );

  return item;
}
