import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useGetTaskTrends, TaskTrend } from '@/hooks/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TaskTrendsCardProps {
  workspaceId: string;
}

export function TaskTrendsCard({ workspaceId }: TaskTrendsCardProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const { data, isLoading } = useGetTaskTrends(workspaceId, period, {
    enabled: !!workspaceId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-[150px]' />
          <Skeleton className='h-4 w-[200px]' />
        </CardHeader>
        <CardContent className='h-80'>
          <Skeleton className='h-full w-full' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='overflow-hidden border-none shadow-md bg-white dark:bg-gray-900'>
      <CardHeader className='bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'>
        <div className='flex justify-between items-center'>
          <div>
            <CardTitle className='text-lg font-medium'>Task Trends</CardTitle>
            <CardDescription className='text-indigo-100'>
              Task activity over time
            </CardDescription>
          </div>
          <Tabs
            value={period}
            onValueChange={value => setPeriod(value as typeof period)}
            className='bg-indigo-600/50 rounded-lg p-1'
          >
            <TabsList className='bg-transparent border-0'>
              <TabsTrigger
                value='week'
                className='text-xs data-[state=active]:bg-white data-[state=active]:text-indigo-600'
              >
                Week
              </TabsTrigger>
              <TabsTrigger
                value='month'
                className='text-xs data-[state=active]:bg-white data-[state=active]:text-indigo-600'
              >
                Month
              </TabsTrigger>
              <TabsTrigger
                value='quarter'
                className='text-xs data-[state=active]:bg-white data-[state=active]:text-indigo-600'
              >
                Quarter
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className='pt-6 h-80'>
        <ResponsiveContainer width='100%' height='85%'>
          <AreaChart
            data={data?.data || []}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id='colorCreated' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#8884d8' stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id='colorCompleted' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#82ca9d' stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id='colorUpdated' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#ffc658' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#ffc658' stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='date'
              tick={{ fontSize: 12 }}
              tickFormatter={value => {
                // Format date to be more readable
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => {
                const formattedName = {
                  created: 'Created',
                  completed: 'Completed',
                  updated: 'Updated',
                }[name];
                return [value, formattedName];
              }}
              labelFormatter={label => {
                const date = new Date(label);
                return date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <Legend />
            <Area
              type='monotone'
              dataKey='created'
              name='Created'
              stroke='#8884d8'
              fillOpacity={1}
              fill='url(#colorCreated)'
            />
            <Area
              type='monotone'
              dataKey='completed'
              name='Completed'
              stroke='#82ca9d'
              fillOpacity={1}
              fill='url(#colorCompleted)'
            />
            <Area
              type='monotone'
              dataKey='updated'
              name='Updated'
              stroke='#ffc658'
              fillOpacity={1}
              fill='url(#colorUpdated)'
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className='grid grid-cols-3 gap-4 mt-4'>
          <div className='flex flex-col items-center p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg'>
            <span className='text-xs text-muted-foreground'>Created</span>
            <span className='text-lg font-bold text-purple-600 dark:text-purple-400'>
              {data?.summary?.totalCreated || 0}
            </span>
          </div>
          <div className='flex flex-col items-center p-2 bg-green-50 dark:bg-green-900/30 rounded-lg'>
            <span className='text-xs text-muted-foreground'>Completed</span>
            <span className='text-lg font-bold text-green-600 dark:text-green-400'>
              {data?.summary?.totalCompleted || 0}
            </span>
          </div>
          <div className='flex flex-col items-center p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg'>
            <span className='text-xs text-muted-foreground'>Updated</span>
            <span className='text-lg font-bold text-amber-600 dark:text-amber-400'>
              {data?.summary?.totalUpdated || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
