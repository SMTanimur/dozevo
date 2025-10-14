'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import Image from 'next/image';
import { Menu, Sparkles } from 'lucide-react';

export const Header = () => {
  const router = useRouter();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className='w-full border-b border-slate-200/50 dark:border-slate-800/50 px-6 sm:px-10 md:px-20 py-4 flex justify-between items-center sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl'
    >
      {/* Logo */}
      <div className='flex items-center gap-3'>
        <Link href='/' className='flex items-center gap-3 group'>
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className='relative'
          >
            <Image
              src='/images/logo-color.svg'
              alt='Dozevo Logo'
              width={40}
              height={40}
              className='group-hover:drop-shadow-lg transition-all'
            />
          </motion.div>
          <span className='font-bold text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
            Dozevo
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className='hidden md:flex items-center gap-3'>
        <Link
          href='/demo'
          className='text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800'
        >
          Features
        </Link>
        <Link
          href='/demo'
          className='text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800'
        >
          Pricing
        </Link>
        <Link
          href='/demo'
          className='text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800'
        >
          Contact
        </Link>

        <div className='h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2' />

        <ShimmerButton
          borderRadius='12px'
          background='transparent'
          shimmerColor='#e5e7eb'
          className='border border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-2'
          onClick={() => router.push('/login')}
        >
          Log in
        </ShimmerButton>
        <ShimmerButton
          borderRadius='12px'
          background='linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
          shimmerColor='#ffffff'
          className='shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all py-2 font-semibold'
          onClick={() => router.push('/signup')}
        >
          <Sparkles className='h-4 w-4 mr-2 inline' />
          Get Started Free
        </ShimmerButton>
      </div>

      {/* Mobile Menu Button */}
      <div className='md:hidden'>
        <button className='p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all'>
          <Menu className='w-6 h-6' />
        </button>
      </div>
    </motion.nav>
  );
};
