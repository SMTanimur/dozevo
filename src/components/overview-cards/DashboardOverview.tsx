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
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { DashboardData } from '@/hooks/dashboard/useGetDashboard';
import { Skeleton } from '@/components/ui/skeleton';

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

    return Object.entries(activityByDay).map(([date, count]) => ({
      date,
      count,
    }));
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

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884d8',
    '#82ca9d',
  ];

  if (isLoading) {
    return <DashboardOverviewSkeleton />;
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {/* Task Status Distribution */}
      <Card className='col-span-1'>
        <CardHeader>
          <CardTitle>Task Status</CardTitle>
          <CardDescription>Distribution of tasks by status</CardDescription>
        </CardHeader>
        <CardContent className='h-80'>
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
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className='col-span-1'>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Activity over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent className='h-80'>
          <ChartContainer
            config={{
              activity: { color: '#8884d8' },
            }}
          >
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type='monotone'
                dataKey='count'
                stroke='#8884d8'
                name='Activities'
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Workspace Structure */}
      <Card className='col-span-1'>
        <CardHeader>
          <CardTitle>Workspace Structure</CardTitle>
          <CardDescription>Spaces and lists in your workspace</CardDescription>
        </CardHeader>
        <CardContent className='h-80'>
          <ChartContainer
            config={{
              spaces: { color: '#0088FE' },
              lists: { color: '#00C49F' },
            }}
          >
            <BarChart data={workspaceData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend />
              <Bar dataKey='spaces' fill='#0088FE' name='Spaces' />
              <Bar dataKey='lists' fill='#00C49F' name='Lists' />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Task Summary Card */}
      <Card className='col-span-1 md:col-span-2 lg:col-span-3'>
        <CardHeader>
          <CardTitle>Task Summary</CardTitle>
          <CardDescription>Overview of your tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='bg-primary/10 p-4 rounded-lg'>
              <div className='text-sm text-muted-foreground'>Total Tasks</div>
              <div className='text-2xl font-bold'>
                {data?.assignedTasks?.length || 0}
              </div>
            </div>
            <div className='bg-green-500/10 p-4 rounded-lg'>
              <div className='text-sm text-muted-foreground'>Spaces</div>
              <div className='text-2xl font-bold'>
                {data?.navigationTree?.[0]?.spaces?.length || 0}
              </div>
            </div>
            <div className='bg-blue-500/10 p-4 rounded-lg'>
              <div className='text-sm text-muted-foreground'>Lists</div>
              <div className='text-2xl font-bold'>
                {data?.navigationTree?.[0]?.spaces?.reduce(
                  (acc, space) => acc + space.lists.length,
                  0
                ) || 0}
              </div>
            </div>
            <div className='bg-yellow-500/10 p-4 rounded-lg'>
              <div className='text-sm text-muted-foreground'>
                Recent Activities
              </div>
              <div className='text-2xl font-bold'>
                {data?.recentActivity?.length || 0}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardOverviewSkeleton() {
  return (
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
      <Card className='col-span-1 md:col-span-2 lg:col-span-3'>
        <CardHeader>
          <Skeleton className='h-6 w-[150px]' />
          <Skeleton className='h-4 w-[200px]' />
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className='h-20 w-full' />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
