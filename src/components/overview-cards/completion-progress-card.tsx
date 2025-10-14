'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AnimatedCard, CountUp } from '@/components/common/animated-wrapper';

interface CompletionProgressCardProps {
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  delay?: number;
}

export const CompletionProgressCard: React.FC<CompletionProgressCardProps> = ({
  completionRate,
  totalTasks,
  completedTasks,
  todoTasks,
  inProgressTasks,
  delay = 0,
}) => {
  return (
    <AnimatedCard delay={delay}>
      <Card className='overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900 rounded-2xl h-full'>
        <CardHeader className='bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 text-white relative overflow-hidden pb-5'>
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
              Task Completion Progress
            </CardTitle>
            <CardDescription className='text-white/90 text-xs mt-1'>
              Overall task completion rate
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='pt-6 pb-6 space-y-6'>
          {/* Main progress bar */}
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-lg font-semibold'>
                <CountUp end={completionRate} suffix='%' /> Complete
              </span>
              <span className='text-sm text-muted-foreground'>
                {completedTasks}/{totalTasks} tasks
              </span>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: delay + 0.3, duration: 0.8 }}
              style={{ transformOrigin: 'left' }}
            >
              <Progress value={completionRate} className='h-3' />
            </motion.div>
          </div>

          {/* Status breakdown */}
          <div className='grid grid-cols-3 gap-4'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.5 }}
              whileHover={{ scale: 1.05 }}
              className='flex flex-col items-center p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl shadow-lg border border-blue-200/50 dark:border-blue-800/50'
            >
              <span className='text-sm font-medium text-muted-foreground mb-1'>
                To Do
              </span>
              <span className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                <CountUp end={todoTasks} duration={1.5} />
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.6 }}
              whileHover={{ scale: 1.05 }}
              className='flex flex-col items-center p-5 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-2xl shadow-lg border border-amber-200/50 dark:border-amber-800/50'
            >
              <span className='text-sm font-medium text-muted-foreground mb-1'>
                In Progress
              </span>
              <span className='text-3xl font-bold text-amber-600 dark:text-amber-400'>
                <CountUp end={inProgressTasks} duration={1.5} />
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.7 }}
              whileHover={{ scale: 1.05 }}
              className='flex flex-col items-center p-5 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl shadow-lg border border-green-200/50 dark:border-green-800/50'
            >
              <span className='text-sm font-medium text-muted-foreground mb-1'>
                Completed
              </span>
              <span className='text-3xl font-bold text-green-600 dark:text-green-400'>
                <CountUp end={completedTasks} duration={1.5} />
              </span>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
};
