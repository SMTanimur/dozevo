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
  iconColor,
  iconBgColor,
  delay = 0,
  suffix = '',
  description,
}) => {
  return (
    <AnimatedCard delay={delay}>
      <Card
        className={`${gradient} border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative`}
      >
        <CardContent className='p-6'>
          {/* Background decoration */}
          <motion.div
            className='absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10'
            style={{ backgroundColor: iconColor }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <div className='relative z-10 flex flex-col items-center justify-center'>
            {/* Animated icon */}
            <motion.div
              className={`${iconBgColor} p-3 rounded-xl mb-4 shadow-md`}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Icon className={iconColor} size={28} strokeWidth={2.5} />
              </motion.div>
            </motion.div>

            {/* Animated value */}
            <div className='text-4xl font-bold mb-2'>
              <CountUp end={value} duration={1.5} suffix={suffix} />
            </div>

            {/* Title */}
            <p className='text-sm font-medium text-muted-foreground text-center'>
              {title}
            </p>

            {/* Optional description */}
            {description && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: delay + 0.5 }}
                className='text-xs text-muted-foreground mt-2 text-center'
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
