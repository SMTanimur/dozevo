'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Marquee } from '@/components/magicui/marquee';

const LogoPlaceholder = ({ name }: { name: string }) => (
  <div className='relative w-32 sm:w-36 h-12 flex justify-center items-center px-3'>
    <motion.span
      whileHover={{ scale: 1.1 }}
      className='text-slate-400 dark:text-slate-600 font-bold text-lg grayscale hover:grayscale-0 hover:text-slate-600 dark:hover:text-slate-400 transition-all duration-300'
    >
      {name}
    </motion.span>
  </div>
);

const logos = [
  { name: 'Shipt' },
  { name: 'Cartoon Network' },
  { name: 'Miami University' },
  { name: 'Padres' },
  { name: 'T-Mobile' },
  { name: 'Sephora' },
  { name: 'Logitech' },
  { name: 'IBM' },
];

const allLogos = [...logos, ...logos]; // Duplicate for smooth loop

export const SocialProof = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className='w-full max-w-7xl mx-auto px-6 py-16 sm:py-20'
    >
      <div className='text-center mb-12'>
        <p className='text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
          Trusted by teams worldwide
        </p>
      </div>

      <div className='relative flex h-20 w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50'>
        <Marquee pauseOnHover className='[--duration:40s]'>
          {allLogos.map((logo, index) => (
            <LogoPlaceholder key={`${logo.name}-${index}`} name={logo.name} />
          ))}
        </Marquee>

        {/* Gradient Fades */}
        <div className='pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-50 via-slate-50/50 to-transparent dark:from-slate-950 dark:via-slate-950/50' />
        <div className='pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-50 via-slate-50/50 to-transparent dark:from-slate-950 dark:via-slate-950/50' />
      </div>
    </motion.section>
  );
};
