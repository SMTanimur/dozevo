'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AnimatedCard } from '@/components/common/animated-wrapper';

interface AnimatedChartCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
  gradient: string;
  textColor?: string;
  height?: string;
}

export const AnimatedChartCard: React.FC<AnimatedChartCardProps> = ({
  title,
  description,
  children,
  delay = 0,
  gradient,
  textColor = 'text-white',
  height = 'h-80',
}) => {
  return (
    <AnimatedCard delay={delay}>
      <Card className='overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-slate-900/80 transition-all duration-500 bg-white dark:bg-slate-900 rounded-2xl'>
        {/* Animated header with gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.2, duration: 0.5 }}
        >
          <CardHeader
            className={`${gradient} ${textColor} relative overflow-hidden pb-5`}
          >
            {/* Animated background pattern */}
            <motion.div
              className='absolute inset-0 opacity-10'
              style={{
                backgroundImage:
                  'radial-gradient(circle, currentColor 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
              animate={{
                backgroundPosition: ['0px 0px', '20px 20px'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            <div className='relative z-10'>
              <CardTitle className='text-lg font-bold tracking-tight'>
                {title}
              </CardTitle>
              <CardDescription
                className={`${textColor} opacity-90 text-xs mt-1`}
              >
                {description}
              </CardDescription>
            </div>
          </CardHeader>
        </motion.div>

        {/* Animated content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4, duration: 0.5 }}
        >
          <CardContent className={`pt-6 pb-6 ${height}`}>
            {children}
          </CardContent>
        </motion.div>
      </Card>
    </AnimatedCard>
  );
};
