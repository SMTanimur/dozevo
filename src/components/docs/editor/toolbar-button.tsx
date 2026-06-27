import React from 'react';
import { cn } from '@/lib';

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const ToolbarButton = ({
  onClick,
  active,
  disabled,
  title,
  children,
  className,
}: ToolbarButtonProps) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'h-7 w-7 flex items-center justify-center rounded-md text-[13px] transition-all duration-150 flex-shrink-0',
      active
        ? 'bg-primary/15 text-primary ring-1 ring-primary/30'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/70',
      disabled && 'opacity-30 cursor-not-allowed pointer-events-none',
      className
    )}
  >
    {children}
  </button>
);

export const ToolbarSeparator = () => (
  <div className="w-px h-4 bg-border/80 mx-0.5 flex-shrink-0" />
);
