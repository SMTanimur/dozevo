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
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CircleCheck, Calendar } from 'lucide-react';
import {
  AnimatedCard,
  StaggerContainer,
} from '@/components/common/animated-wrapper';

interface Task {
  _id: string;
  title: string;
  dueDate?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface TasksDueSoonCardProps {
  tasks: Task[];
  delay?: number;
}

const priorityColors = {
  high: 'destructive',
  medium: 'default',
  low: 'outline',
} as const;

export const TasksDueSoonCard: React.FC<TasksDueSoonCardProps> = ({
  tasks,
  delay = 0,
}) => {
  return (
    <AnimatedCard delay={delay}>
      <Card className='overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900'>
        <CardHeader className='bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-white relative overflow-hidden'>
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

          <div className='relative z-10 flex items-center gap-2'>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <AlertTriangle className='h-5 w-5' />
            </motion.div>
            <div>
              <CardTitle className='text-lg font-semibold'>
                Tasks Due Soon
              </CardTitle>
              <CardDescription className='text-white opacity-90'>
                Tasks due in the next 7 days
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className='pt-6'>
          {tasks.length > 0 ? (
            <StaggerContainer className='space-y-3'>
              {tasks.map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  }}
                  className='flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 transition-all'
                >
                  <div className='flex items-center space-x-3 flex-1'>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    >
                      <Calendar
                        className='text-amber-500 flex-shrink-0'
                        size={18}
                      />
                    </motion.div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium truncate'>{task.title}</p>
                      {task.dueDate && (
                        <p className='text-sm text-muted-foreground'>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={
                      task.priority ? priorityColors[task.priority] : 'outline'
                    }
                    className='ml-2 flex-shrink-0'
                  >
                    {task.priority || 'No Priority'}
                  </Badge>
                </motion.div>
              ))}
            </StaggerContainer>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.3 }}
              className='flex flex-col items-center justify-center py-12 text-center'
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <CircleCheck className='h-16 w-16 mb-4 text-green-500' />
              </motion.div>
              <p className='text-lg font-semibold text-muted-foreground'>
                No tasks due soon
              </p>
              <p className='text-sm text-muted-foreground mt-1'>
                You&apos;re all caught up! 🎉
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </AnimatedCard>
  );
};
