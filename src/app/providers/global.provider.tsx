'use client';


import { cn } from '@/lib';
import { useThemeStore } from '@/stores';

import { ThemeProvider } from 'next-themes';
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {

  const { theme, radius } = useThemeStore();
 
 
  return (
    <body

      className={cn(geistSans.variable ,  geistMono.variable,'antialiased', 'theme-' + theme)}
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
        {children}
      </ThemeProvider>
    </body>
  );
};
