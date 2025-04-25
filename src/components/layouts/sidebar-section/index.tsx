'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function SidebarSection({
  title,
  children,
  className,
}: SidebarSectionProps) {
  return (
    <div className={cn('py-2 px-2 w-full overflow-hidden', className)}>
      <div className='flex items-center px-4 py-1'>
        <span className='text-xs font-medium text-muted-foreground ml-1'>
          {title}
        </span>
      </div>

      <div className={cn('mt-1 flex flex-col gap-2')}>{children}</div>
    </div>
  );
}
