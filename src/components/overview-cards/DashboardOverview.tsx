import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
} from 'recharts';
import { DashboardData } from '@/hooks/dashboard/useGetDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  CircleCheck,
  Clock,
  ListChecks,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DashboardOverviewProps {
  data?: DashboardData;
  isLoading: boolean;
}

export function DashboardOverview({ data, isLoading }: DashboardOverviewProps) {
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

  // Generate activity data for line chart
  const activityData = React.useMemo(() => {
    if (!data?.recentActivity?.length) return [];

    const activityByDay: Record<string, number> = {};

    // Create a safer date handling function
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
      // Format date to be more readable (e.g., "Jun 24")
      const dateObj = new Date(date);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      return {
        date: formattedDate,
        count,
        // Add cumulative data for area chart
        cumulative: Math.floor(Math.random() * 10) + count, // Simulated data
      };
    });
  }, [data?.recentActivity]);

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

  // Generate task priority data
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
            .length || 2,
        fill: '#f59e0b',
      },
      {
        name: 'Low',
        value:
          data?.assignedTasks?.filter(task => task.priority === 'low').length ||
          3,
        fill: '#3b82f6',
      },
      {
        name: 'None',
        value: data?.assignedTasks?.filter(task => !task.priority).length || 0,
        fill: '#9ca3af',
      },
    ];
  }, [data?.assignedTasks]);

  // Generate task completion progress
  const taskProgress = React.useMemo(() => {
    if (!data?.assignedTasks?.length) return 0;

    const completedTasks = data.assignedTasks.filter(
      task => task.status === 'Completed' || task.status === 'Done'
    ).length;

    return Math.round((completedTasks / data.assignedTasks.length) * 100);
  }, [data?.assignedTasks]);

  // Generate task due soon data
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
      .slice(0, 3); // Take only top 3
  }, [data?.assignedTasks]);

  // Colors for charts
  const COLORS = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
  ];

  // Status colors mapping
  const STATUS_COLORS = {
    'To Do': '#3b82f6',
    'In Progress': '#f59e0b',
    Completed: '#10b981',
    Done: '#10b981',
    Blocked: '#ef4444',
    'No Status': '#9ca3af',
  };

  if (isLoading) {
    return <DashboardOverviewSkeleton />;
  }

  return (
    <div className='space-y-6'>
      {/* Header Stats */}
      <div className='grid gap-4 grid-cols-2 md:grid-cols-4'>
        <Card className='bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800'>
          <CardContent className='p-4 flex flex-col items-center justify-center'>
            <div className='text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-800 p-2 rounded-full mb-2'>
              <ListChecks size={24} />
            </div>
            <div className='text-3xl font-bold'>
              {data?.assignedTasks?.length || 0}
            </div>
            <p className='text-sm text-muted-foreground'>Total Tasks</p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-950 dark:to-green-900 dark:border-green-800'>
          <CardContent className='p-4 flex flex-col items-center justify-center'>
            <div className='text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-800 p-2 rounded-full mb-2'>
              <CircleCheck size={24} />
            </div>
            <div className='text-3xl font-bold'>{taskProgress}%</div>
            <p className='text-sm text-muted-foreground'>Completion Rate</p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-950 dark:to-amber-900 dark:border-amber-800'>
          <CardContent className='p-4 flex flex-col items-center justify-center'>
            <div className='text-amber-500 dark:text-amber-400 bg-amber-100 dark:bg-amber-800 p-2 rounded-full mb-2'>
              <Clock size={24} />
            </div>
            <div className='text-3xl font-bold'>{tasksDueSoon.length}</div>
            <p className='text-sm text-muted-foreground'>Due Soon</p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-950 dark:to-purple-900 dark:border-purple-800'>
          <CardContent className='p-4 flex flex-col items-center justify-center'>
            <div className='text-purple-500 dark:text-purple-400 bg-purple-100 dark:bg-purple-800 p-2 rounded-full mb-2'>
              <Loader2 size={24} />
            </div>
            <div className='text-3xl font-bold'>
              {data?.recentActivity?.length || 0}
            </div>
            <p className='text-sm text-muted-foreground'>Recent Activities</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {/* Task Status Distribution */}
        <Card className='col-span-1 overflow-hidden border-none shadow-md bg-white dark:bg-gray-900'>
          <CardHeader className='bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
            <CardTitle className='text-lg font-medium'>Task Status</CardTitle>
            <CardDescription className='text-blue-100'>
              Distribution of tasks by status
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-6 h-80'>
            <ChartContainer
              config={{
                status1: { color: COLORS[0] },
                status2: { color: COLORS[1] },
                status3: { color: COLORS[2] },
                status4: { color: COLORS[3] },
              }}
            >
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                  nameKey='name'
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        STATUS_COLORS[
                          entry.name as keyof typeof STATUS_COLORS
                        ] || COLORS[index % COLORS.length]
                      }
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend
                  layout='horizontal'
                  verticalAlign='bottom'
                  align='center'
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className='col-span-1 overflow-hidden border-none shadow-md bg-white dark:bg-gray-900'>
          <CardHeader className='bg-gradient-to-r from-purple-500 to-purple-600 text-white'>
            <CardTitle className='text-lg font-medium'>
              Recent Activity
            </CardTitle>
            <CardDescription className='text-purple-100'>
              Activity over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-6 h-80'>
            <ChartContainer
              config={{
                count: { color: '#8884d8' },
                cumulative: { color: '#82ca9d' },
              }}
            >
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id='colorCount' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
                    <stop offset='95%' stopColor='#8884d8' stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area
                  type='monotone'
                  dataKey='count'
                  stroke='#8884d8'
                  fillOpacity={1}
                  fill='url(#colorCount)'
                  name='Daily Activities'
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Task Priority */}
        <Card className='col-span-1 overflow-hidden border-none shadow-md bg-white dark:bg-gray-900'>
          <CardHeader className='bg-gradient-to-r from-amber-500 to-amber-600 text-white'>
            <CardTitle className='text-lg font-medium'>Task Priority</CardTitle>
            <CardDescription className='text-amber-100'>
              Distribution by priority level
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-6 h-80'>
            <ChartContainer
              config={{
                high: { color: '#ef4444' },
                medium: { color: '#f59e0b' },
                low: { color: '#3b82f6' },
                none: { color: '#9ca3af' },
              }}
            >
              <RadialBarChart
                innerRadius='30%'
                outerRadius='80%'
                data={priorityData}
                startAngle={180}
                endAngle={0}
                cx='50%'
                cy='60%'
              >
                <RadialBar
                  minAngle={15}
                  label={{ position: 'insideStart', fill: '#666' }}
                  background
                  clockWise
                  dataKey='value'
                  nameKey='name'
                />
                <Legend
                  iconSize={10}
                  layout='horizontal'
                  verticalAlign='bottom'
                  align='center'
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Workspace Structure */}
      <Card className='overflow-hidden border-none shadow-md bg-white dark:bg-gray-900'>
        <CardHeader className='bg-gradient-to-r from-green-500 to-green-600 text-white'>
          <CardTitle className='text-lg font-medium'>
            Workspace Structure
          </CardTitle>
          <CardDescription className='text-green-100'>
            Spaces and lists in your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6 h-64'>
          <ChartContainer
            config={{
              spaces: { color: '#3b82f6' },
              lists: { color: '#10b981' },
            }}
          >
            <BarChart data={workspaceData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar
                dataKey='spaces'
                fill='#3b82f6'
                name='Spaces'
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey='lists'
                fill='#10b981'
                name='Lists'
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Tasks Due Soon */}
      <Card className='overflow-hidden border-none shadow-md bg-white dark:bg-gray-900'>
        <CardHeader className='bg-gradient-to-r from-red-500 to-red-600 text-white'>
          <CardTitle className='text-lg font-medium'>Tasks Due Soon</CardTitle>
          <CardDescription className='text-red-100'>
            Tasks due in the next 7 days
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6'>
          {tasksDueSoon.length > 0 ? (
            <div className='space-y-4'>
              {tasksDueSoon.map((task, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'
                >
                  <div className='flex items-center space-x-3'>
                    <AlertTriangle className='text-amber-500' size={18} />
                    <div>
                      <p className='font-medium'>{task.title}</p>
                      <p className='text-sm text-muted-foreground'>
                        Due:{' '}
                        {new Date(task.dueDate as string).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      task.priority === 'high'
                        ? 'destructive'
                        : task.priority === 'medium'
                        ? 'default'
                        : 'outline'
                    }
                  >
                    {task.priority || 'No Priority'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-8 text-center text-muted-foreground'>
              <CircleCheck className='h-12 w-12 mb-2 text-green-500' />
              <p>No tasks due soon</p>
              <p className='text-sm'>You&apos;re all caught up!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Completion Progress */}
      <Card className='overflow-hidden border-none shadow-md bg-white dark:bg-gray-900'>
        <CardHeader className='bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'>
          <CardTitle className='text-lg font-medium'>
            Task Completion Progress
          </CardTitle>
          <CardDescription className='text-cyan-100'>
            Overall task completion rate
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-sm font-medium'>
                {taskProgress}% Complete
              </span>
              <span className='text-sm text-muted-foreground'>
                {data?.assignedTasks?.filter(
                  task => task.status === 'Completed' || task.status === 'Done'
                ).length || 0}
                /{data?.assignedTasks?.length || 0} tasks
              </span>
            </div>
            <Progress value={taskProgress} className='h-2' />
          </div>

          <div className='grid grid-cols-3 gap-4 mt-6'>
            <div className='flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg'>
              <span className='text-sm text-muted-foreground'>To Do</span>
              <span className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                {data?.assignedTasks?.filter(task => task.status === 'To Do')
                  .length || 0}
              </span>
            </div>
            <div className='flex flex-col items-center p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg'>
              <span className='text-sm text-muted-foreground'>In Progress</span>
              <span className='text-2xl font-bold text-amber-600 dark:text-amber-400'>
                {data?.assignedTasks?.filter(
                  task => task.status === 'In Progress'
                ).length || 0}
              </span>
            </div>
            <div className='flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg'>
              <span className='text-sm text-muted-foreground'>Completed</span>
              <span className='text-2xl font-bold text-green-600 dark:text-green-400'>
                {data?.assignedTasks?.filter(
                  task => task.status === 'Completed' || task.status === 'Done'
                ).length || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardOverviewSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Header Stats Skeleton */}
      <div className='grid gap-4 grid-cols-2 md:grid-cols-4'>
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent className='p-4'>
              <div className='flex flex-col items-center justify-center space-y-2'>
                <Skeleton className='h-10 w-10 rounded-full' />
                <Skeleton className='h-8 w-16' />
                <Skeleton className='h-4 w-24' />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Skeleton */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {[1, 2, 3].map(i => (
          <Card key={i} className='col-span-1'>
            <CardHeader>
              <Skeleton className='h-6 w-[150px]' />
              <Skeleton className='h-4 w-[200px]' />
            </CardHeader>
            <CardContent className='h-80'>
              <Skeleton className='h-full w-full' />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Cards Skeleton */}
      {[1, 2, 3].map(i => (
        <Card key={`extra-${i}`}>
          <CardHeader>
            <Skeleton className='h-6 w-[150px]' />
            <Skeleton className='h-4 w-[200px]' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {[1, 2, 3].map(j => (
                <Skeleton key={j} className='h-16 w-full' />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
