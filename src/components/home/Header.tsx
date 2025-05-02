'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShimmerButton } from '@/components/magicui/shimmer-button';

export const Header = () => {
  const router = useRouter();

  return (
    <nav className='w-full border-b px-6 sm:px-10 md:px-20 py-4 flex justify-between items-center absolute top-0 left-0 z-10 bg-transparent'>
      {/* Use absolute positioning for transparent overlay effect if desired, or keep sticky with adjusted background */}
      <div className='flex items-center gap-3'>
        {/* Updated Logo Placeholder */}
        <Link href='/' className='flex items-center gap-3'>
          <div className='w-7 h-7 bg-purple-200 rounded-full'></div>{' '}
          {/* Slightly smaller */}
          <span className='font-semibold text-xl text-gray-800'>TaskZen</span>
        </Link>
      </div>
      <div className='hidden md:flex items-center gap-4'>
        <Link
          href='/demo'
          className='text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-2'
        >
          Book a Demo
        </Link>
        <ShimmerButton
          borderRadius='8px'
          background='transparent'
          shimmerColor='#e5e7eb'
          className='border  border-black hover:border-gray-200 transition-colors duration-300 text-sm font-medium text-gray-500 hover:text-gray-900  py-1.5'
          onClick={() => router.push('/login')}
        >
          Log in
        </ShimmerButton>
        <ShimmerButton
          borderRadius='8px'
          background='#8B5CF6'
          shimmerColor='#ffffff'
          className='shadow-sm py-1.5'
          onClick={() => router.push('/signup')}
        >
          Sign Up
        </ShimmerButton>
      </div>
      {/* Mobile Menu Button Placeholder (Keep basic structure) */}
      <div className='md:hidden'>
        <button className='p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};
