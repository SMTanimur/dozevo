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
      <Card className='overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900'>
        {/* Animated header with gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.2, duration: 0.5 }}
        >
          <CardHeader
            className={`${gradient} ${textColor} relative overflow-hidden`}
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
              <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
              <CardDescription className={`${textColor} opacity-90`}>
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
          <CardContent className={`pt-6 ${height}`}>{children}</CardContent>
        </motion.div>
      </Card>
    </AnimatedCard>
  );
};
