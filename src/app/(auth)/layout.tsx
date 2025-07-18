'use client';

import { Icon } from '@/components'; // Assuming Icon component exists
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white'>
      {/* Background subtle pattern/gradient - Adjusted for light theme */}
      <div className='absolute inset-0 z-0 opacity-50'>
        <div className='absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(var(--color-primary)/0.08),rgba(255,255,255,0))] animate-[spin_15s_linear_infinite]'></div>
        <div className='absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(var(--color-primary)/0.08),rgba(255,255,255,0))] animate-[spin_20s_linear_infinite_reverse]'></div>
      </div>

      {/* Logo - Adjusted text color */}
      <div className='absolute top-10 z-20 flex items-center gap-2'>
        <Icon name='Workflow' className='h-8 w-8 text-primary' />
        <span className='text-xl font-semibold text-slate-900'>Dozevo</span> {/* Changed text color */}
      </div>

      {/* Main content card container (for gradient border) - Adjusted for light theme */}
      <div className='relative z-10 mt-20 w-full max-w-md md:mt-0'>
        {/* Gradient Border Effect */}
        <div className='rounded-xl bg-gradient-to-br from-primary/20 via-slate-100 to-primary/20 p-px shadow-xl'> {/* Adjusted gradient */}
          {/* Inner Card */}
          <div className='rounded-[11px] border border-slate-200 bg-white p-6 backdrop-blur-none md:p-10'> {/* Adjusted bg, border, removed blur */}
            {children}
          </div>
        </div>
      </div>

      {/* Footer - Adjusted text color */}
      <footer className='absolute bottom-6 z-10 w-full px-4'>
        <p className='text-center text-xs text-muted-foreground'> {/* Changed text color */}
          This site is protected by reCAPTCHA and the Google Privacy Policy and
          Terms of Service apply.
        </p>
      </footer>
    </div>
  );
}
