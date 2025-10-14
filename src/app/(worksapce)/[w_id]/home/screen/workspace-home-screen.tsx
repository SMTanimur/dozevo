'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetDashboard } from '@/hooks';
import {
  ModernDashboardStats,
  TaskStatusChart,
  ActivityTrendChart,
  PriorityChart,
  TasksDueSoonCard,
  WorkspaceStructureChart,
  CompletionProgressCard,
} from '@/components/overview-cards';
import { AnimatedWrapper } from '@/components/common/animated-wrapper';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type WorkspaceHomeScreenProps = {
  w_id: string;
};

export const WorkspaceHomeScreen = ({ w_id }: WorkspaceHomeScreenProps) => {
  const { data, isLoading } = useGetDashboard(w_id as string, {
    enabled: !!w_id,
  });

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!data) {
      return {
        totalTasks: 0,
        completionRate: 0,
        dueSoon: 0,
        activities: 0,
        inProgress: 0,
        overdue: 0,
      };
    }

    const totalTasks = data.assignedTasks?.length || 0;
    const completedTasks =
      data.assignedTasks?.filter(
        task => task.status === 'Completed' || task.status === 'Done'
      ).length || 0;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const now = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(now.getDate() + 7);

    const dueSoon =
      data.assignedTasks?.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate > now && dueDate <= oneWeekFromNow;
      }).length || 0;

    const overdue =
      data.assignedTasks?.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return (
          dueDate < now && task.status !== 'Completed' && task.status !== 'Done'
        );
      }).length || 0;

    const inProgress =
      data.assignedTasks?.filter(task => task.status === 'In Progress')
        .length || 0;

    return {
      totalTasks,
      completionRate,
      dueSoon,
      activities: data.recentActivity?.length || 0,
      inProgress,
      overdue,
    };
  }, [data]);

  // Generate task status data for pie chart
  const taskStatusData = React.useMemo(() => {
    if (!data?.assignedTasks?.length) return [];

    const statusCounts: Record<string, number> = {};
    data.assignedTasks.forEach(task => {
      const status = task.status || 'No Status';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [data?.assignedTasks]);

  // Generate activity data
  const activityData = React.useMemo(() => {
    if (!data?.recentActivity?.length) return [];

    const activityByDay: Record<string, number> = {};

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Initialize with past 7 days
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      activityByDay[formatDate(date)] = 0;
    }

    // Count activities by day
    data.recentActivity.forEach(activity => {
      try {
        if (activity.timestamp) {
          const date = new Date(activity.timestamp);
          if (!isNaN(date.getTime())) {
            const dateStr = formatDate(date);
            if (activityByDay[dateStr] !== undefined) {
              activityByDay[dateStr] += 1;
            }
          }
        }
      } catch (error) {
        console.error('Error processing activity date:', error);
      }
    });

    return Object.entries(activityByDay).map(([date, count]) => {
      const dateObj = new Date(date);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      return {
        date: formattedDate,
        count,
      };
    });
  }, [data?.recentActivity]);

  // Generate priority data
  const priorityData = React.useMemo(() => {
    return [
      {
        name: 'High',
        value:
          data?.assignedTasks?.filter(task => task.priority === 'high')
            .length || 0,
        fill: '#ef4444',
      },
      {
        name: 'Medium',
        value:
          data?.assignedTasks?.filter(task => task.priority === 'medium')
            .length || 0,
        fill: '#f59e0b',
      },
      {
        name: 'Low',
        value:
          data?.assignedTasks?.filter(task => task.priority === 'low').length ||
          0,
        fill: '#3b82f6',
      },
      {
        name: 'None',
        value: data?.assignedTasks?.filter(task => !task.priority).length || 0,
        fill: '#9ca3af',
      },
    ];
  }, [data?.assignedTasks]);

  // Generate workspace structure data
  const workspaceData = React.useMemo(() => {
    if (!data?.navigationTree?.length) return [];

    return data.navigationTree.map(workspace => {
      const spacesCount = workspace.spaces.length;
      const listsCount = workspace.spaces.reduce(
        (acc, space) => acc + space.lists.length,
        0
      );

      return {
        name: workspace.name,
        spaces: spacesCount,
        lists: listsCount,
      };
    });
  }, [data?.navigationTree]);

  // Get tasks due soon
  const tasksDueSoon = React.useMemo(() => {
    if (!data?.assignedTasks?.length) return [];

    const now = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(now.getDate() + 7);

    return data.assignedTasks
      .filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate > now && dueDate <= oneWeekFromNow;
      })
      .slice(0, 3);
  }, [data?.assignedTasks]);

  // Calculate completion stats
  const completionStats = React.useMemo(() => {
    const totalTasks = data?.assignedTasks?.length || 0;
    const completedTasks =
      data?.assignedTasks?.filter(
        task => task.status === 'Completed' || task.status === 'Done'
      ).length || 0;
    const todoTasks =
      data?.assignedTasks?.filter(task => task.status === 'To Do').length || 0;
    const inProgressTasks =
      data?.assignedTasks?.filter(task => task.status === 'In Progress')
        .length || 0;

    return {
      totalTasks,
      completedTasks,
      todoTasks,
      inProgressTasks,
      completionRate: stats.completionRate,
    };
  }, [data?.assignedTasks, stats.completionRate]);

  if (isLoading) {
    return <WorkspaceHomeScreenSkeleton />;
  }

  return (
    <div className='flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className='relative flex items-center justify-between px-8 py-6 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl'
      >
        {/* Background decoration */}
        <div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10' />
        
        <div className='relative flex items-center gap-4'>
          <motion.div
            className='p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30'
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Sparkles className='h-5 w-5 text-white' />
          </motion.div>
          <div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-900 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent'>
              Workspace Overview
            </h1>
            <p className='text-sm text-slate-600 dark:text-slate-400 mt-0.5'>
              Track your progress and stay on top of your tasks
            </p>
          </div>
        </div>

        <div className='relative flex items-center gap-3'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className='flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-lg shadow-emerald-500/30'
          >
            <TrendingUp className='h-4 w-4 text-white' />
            <span className='text-sm font-bold text-white'>
              {stats.completionRate}% Complete
            </span>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <ScrollArea className='flex-1'>
        <div className='max-w-[1800px] mx-auto px-8 py-8 space-y-8'>
          {/* Quick Stats - Modern Cards */}
          <AnimatedWrapper variant='fadeIn' delay={0.1}>
            <ModernDashboardStats
              totalTasks={stats.totalTasks}
              completionRate={stats.completionRate}
              dueSoon={stats.dueSoon}
              activities={stats.activities}
              inProgress={stats.inProgress}
              overdue={stats.overdue}
            />
          </AnimatedWrapper>

          {/* Main Analytics Section */}
          <div className='grid gap-6 lg:grid-cols-3'>
            <TaskStatusChart data={taskStatusData} delay={0.2} />
            <ActivityTrendChart data={activityData} delay={0.3} />
            <PriorityChart data={priorityData} delay={0.4} />
          </div>

          {/* Tasks & Progress Section */}
          <div className='grid gap-6 lg:grid-cols-5'>
            <div className='lg:col-span-3'>
              <TasksDueSoonCard tasks={tasksDueSoon} delay={0.5} />
            </div>
            <div className='lg:col-span-2'>
              <CompletionProgressCard
                completionRate={completionStats.completionRate}
                totalTasks={completionStats.totalTasks}
                completedTasks={completionStats.completedTasks}
                todoTasks={completionStats.todoTasks}
                inProgressTasks={completionStats.inProgressTasks}
                delay={0.6}
              />
            </div>
          </div>

          {/* Workspace Structure */}
          {workspaceData.length > 0 && (
            <WorkspaceStructureChart data={workspaceData} delay={0.7} />
          )}

          {/* Footer spacing */}
          <div className='h-4' />
        </div>
      </ScrollArea>
    </div>
  );
};

// Loading skeleton
function WorkspaceHomeScreenSkeleton() {
  return (
    <div className='flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950'>
      <header className='flex items-center justify-between p-6 border-b'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-6 w-6 rounded-full' />
          <div>
            <Skeleton className='h-8 w-64 mb-2' />
            <Skeleton className='h-4 w-48' />
          </div>
        </div>
        <Skeleton className='h-10 w-32 rounded-full' />
      </header>

      <ScrollArea className='flex-1 p-6'>
        <div className='max-w-[1600px] mx-auto space-y-8'>
          {/* Stats Skeleton */}
          <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className='h-32 rounded-lg' />
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className='h-96 rounded-lg' />
            ))}
          </div>

          {/* Additional Skeletons */}
          <div className='grid gap-6 md:grid-cols-2'>
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className='h-80 rounded-lg' />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
