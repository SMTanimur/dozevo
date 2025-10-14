'use client';

import React from 'react';
import { cn } from '@/lib';

interface ThemeWrapperProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'muted' | 'accent';
}

/**
 * Wrapper component that applies theme-aware backgrounds
 */
export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({
  children,
  className = '',
  variant = 'default',
}) => {
  const backgrounds = {
    default: 'bg-background',
    muted: 'bg-muted',
    accent: 'bg-accent',
  };

  return <div className={cn(backgrounds[variant], className)}>{children}</div>;
};

/**
 * Theme-aware gradient background
 */
export const ThemeGradientBg: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div
      className={cn(
        'bg-gradient-to-br from-background via-background to-primary/5',
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Theme-aware glassmorphism header
 */
export const ThemeGlassHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div
      className={cn(
        'bg-background/80 backdrop-blur-xl border-b border-border',
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Theme-aware card with hover effects
 */
export const ThemeCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className = '', hover = true }) => {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-2xl shadow-lg shadow-primary/5',
        hover &&
          'hover:shadow-xl hover:shadow-primary/10 transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Theme-aware gradient text
 */
export const ThemeGradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <span
      className={cn(
        'bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent font-bold',
        className
      )}
    >
      {children}
    </span>
  );
};
