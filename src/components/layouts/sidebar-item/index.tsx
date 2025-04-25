'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Icon } from '@/components/ui';
import { icons } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SidebarItemProps {
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
}

export function SidebarItem({
  href,
  icon,
  label,
  color,
  isActive = false,
  isCollapsed = false,
  indent = false,
  onExpand,
  variant = 'default',
  actions,
}: SidebarItemProps) {
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();
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
    <div
      className={cn(
        'group flex w-full cursor-pointer z-50 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted',
        isActive && variant === 'default' && 'bg-muted text-foreground',
        isActive &&
          variant === 'accent' &&
          'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
        indent && !isCollapsed && 'ml-4'
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => {
        if (onExpand) {
          router.push(href);
          onExpand();
        }
      }}
    >
      <div className='flex items-center gap-2 shrink-0 group  justify-center'>
        {!isHovering ? (
          <div
            className='flex h-6 w-6   items-center justify-center rounded-sm'
            style={{ backgroundColor: color ? color : '#ec4899' }}
          >
            <IconComponent />
          </div>
        ) : (
          <Icon name='ChevronDown' className='h-6 w-6' />
        )}
        <span className='truncate'>{label}</span>
      </div>

      {!isCollapsed && (
        <>
          {actions && (
            <div className='ml-auto flex items-center gap-1'>{actions}</div>
          )}
        </>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{item}</TooltipTrigger>
          <TooltipContent
            side='right'
            align='start'
            className='flex items-center gap-2'
          >
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return item;
}
