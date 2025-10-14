'use client';

import React from 'react';
import {
  ListChecks,
  CircleCheck,
  Clock,
  Activity,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { AnimatedStatCard } from './animated-stat-card';
import { StaggerContainer } from '@/components/common/animated-wrapper';

interface DashboardStatsProps {
  totalTasks: number;
  completionRate: number;
  dueSoon: number;
  activities: number;
  inProgress?: number;
  overdue?: number;
}

export const ModernDashboardStats: React.FC<DashboardStatsProps> = ({
  totalTasks,
  completionRate,
  dueSoon,
  activities,
  inProgress = 0,
  overdue = 0,
}) => {
  return (
    <StaggerContainer className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
      <AnimatedStatCard
        title='Total Tasks'
        value={totalTasks}
        icon={ListChecks}
        gradient='bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700'
        iconColor='text-blue-600'
        iconBgColor='bg-blue-100 dark:bg-blue-900/30'
        delay={0}
      />

      <AnimatedStatCard
        title='Completion Rate'
        value={completionRate}
        suffix='%'
        icon={CircleCheck}
        gradient='bg-gradient-to-br from-green-500 via-green-600 to-green-700'
        iconColor='text-green-600'
        iconBgColor='bg-green-100 dark:bg-green-900/30'
        delay={0.1}
      />

      <AnimatedStatCard
        title='Due Soon'
        value={dueSoon}
        icon={Clock}
        gradient='bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700'
        iconColor='text-amber-600'
        iconBgColor='bg-amber-100 dark:bg-amber-900/30'
        delay={0.2}
      />

      <AnimatedStatCard
        title='In Progress'
        value={inProgress}
        icon={TrendingUp}
        gradient='bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700'
        iconColor='text-purple-600'
        iconBgColor='bg-purple-100 dark:bg-purple-900/30'
        delay={0.3}
      />

      <AnimatedStatCard
        title='Recent Activity'
        value={activities}
        icon={Activity}
        gradient='bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700'
        iconColor='text-cyan-600'
        iconBgColor='bg-cyan-100 dark:bg-cyan-900/30'
        delay={0.4}
      />

      <AnimatedStatCard
        title='Overdue'
        value={overdue}
        icon={AlertCircle}
        gradient='bg-gradient-to-br from-red-500 via-red-600 to-red-700'
        iconColor='text-red-600'
        iconBgColor='bg-red-100 dark:bg-red-900/30'
        delay={0.5}
      />
    </StaggerContainer>
  );
};
