'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, CheckCircle2, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const HeroSection = () => {
  const router = useRouter();

  return (
    <div className='w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-20 pt-32 pb-20'>
      <div className='text-center space-y-8'>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex justify-center'
        >
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-500/10'>
            <Sparkles className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
              The Modern Task Management Platform
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1]'>
            <span className='bg-gradient-to-r from-slate-900 via-blue-800 to-purple-900 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent'>
              Everything you need
            </span>
            <br />
            <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
              to get work done
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed'
        >
          Streamline your workflow with beautiful task boards, powerful
          automation, and seamless collaboration. All in one place.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='flex flex-col sm:flex-row items-center justify-center gap-4'
        >
          <Button
            size='lg'
            className='group rounded-xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl shadow-blue-500/30 hover:shadow-3xl hover:shadow-blue-500/40 transition-all px-8 py-6 text-lg font-bold'
            onClick={() => router.push('/signup')}
          >
            <Sparkles className='h-5 w-5 mr-2' />
            Get Started Free
            <ArrowRight className='h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform' />
          </Button>

          <Button
            size='lg'
            variant='outline'
            className='rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-300 px-8 py-6 text-lg font-semibold transition-all'
            onClick={() => router.push('/demo')}
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-slate-600 dark:text-slate-400'
        >
          <div className='flex items-center gap-2'>
            <CheckCircle2 className='h-4 w-4 text-green-500' />
            <span className='font-medium'>Free Forever</span>
          </div>
          <div className='flex items-center gap-2'>
            <Zap className='h-4 w-4 text-blue-500' />
            <span className='font-medium'>No Credit Card</span>
          </div>
          <div className='flex items-center gap-2'>
            <Shield className='h-4 w-4 text-purple-500' />
            <span className='font-medium'>Secure & Private</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
