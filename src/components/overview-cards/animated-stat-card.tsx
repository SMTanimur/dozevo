'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { AnimatedCard, CountUp } from '@/components/common/animated-wrapper';

interface AnimatedStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
  iconBgColor: string;
  delay?: number;
  suffix?: string;
  description?: string;
}

export const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
  title,
  value,
  icon: Icon,
  gradient,
  delay = 0,
  suffix = '',
  description,
}) => {
  return (
    <AnimatedCard delay={delay}>
      <Card
        className={`${gradient} border-none shadow-xl shadow-blue-200/20 dark:shadow-slate-900/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden relative rounded-2xl`}
      >
        <CardContent className='p-6'>
          {/* Background decoration */}
          <motion.div
            className='absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 dark:opacity-10'
            style={{ backgroundColor: 'white' }}
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <div className='relative z-10 flex flex-col items-center justify-center min-h-[140px]'>
            {/* Animated icon */}
            <motion.div
              className='bg-white/20 dark:bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl mb-4 shadow-lg'
              whileHover={{ rotate: 360, scale: 1.15 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Icon className='text-white' size={30} strokeWidth={2.5} />
              </motion.div>
            </motion.div>

            {/* Animated value */}
            <div className='text-4xl font-extrabold mb-2 text-white'>
              <CountUp end={value} duration={1.5} suffix={suffix} />
            </div>

            {/* Title */}
            <p className='text-sm font-semibold text-white/90 text-center tracking-wide'>
              {title}
            </p>

            {/* Optional description */}
            {description && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: delay + 0.5 }}
                className='text-xs text-white/80 mt-2 text-center'
              >
                {description}
              </motion.p>
            )}
          </div>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
};
