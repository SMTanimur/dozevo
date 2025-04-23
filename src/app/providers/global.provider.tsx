'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib';
import { useThemeStore } from '@/stores';
import { PrimaryLoader } from '@/components/ui/primary-loader';

import { ThemeProvider } from 'next-themes';
import { Geist, Geist_Mono } from 'next/font/google';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, radius } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <body
      className={cn(
        geistSans.variable,
        geistMono.variable,
        'antialiased',
        'theme-' + theme
      )}
      style={
        {
          '--radius': `${radius}rem`,
        } as React.CSSProperties
      }
    >
      <ThemeProvider
        attribute='class'
        enableSystem={false}
        defaultTheme='light'
      >
        {isLoading ? <PrimaryLoader /> : children}
      </ThemeProvider>
    </body>
  );
};
