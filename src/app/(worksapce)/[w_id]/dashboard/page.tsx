'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { DashboardOverview, TaskTrendsCard } from '@/components/overview-cards';
import { useGetDashboard } from '@/hooks/dashboard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CircleCheck, Clock, ListChecks } from 'lucide-react';

export default function DashboardPage() {
  const { w_id } = useParams();
  const workspaceId = w_id as string;

  const { data, isLoading } = useGetDashboard(workspaceId, {
    enabled: !!workspaceId,
  });

  // Sample data for additional charts
  const productivityData = [
    { name: 'Monday', productivity: 85 },
    { name: 'Tuesday', productivity: 70 },
    { name: 'Wednesday', productivity: 90 },
    { name: 'Thursday', productivity: 65 },
    { name: 'Friday', productivity: 75 },
  ];

  const priorityData = [
    {
      name: 'High',
      value:
        data?.assignedTasks?.filter(task => task.priority === 'high').length ||
        5,
      color: '#ef4444',
    },
    {
      name: 'Medium',
      value:
        data?.assignedTasks?.filter(task => task.priority === 'medium')
          .length || 8,
      color: '#f59e0b',
    },
    {
      name: 'Low',
      value:
        data?.assignedTasks?.filter(task => task.priority === 'low').length ||
        12,
      color: '#3b82f6',
    },
  ];

  return (
    <ScrollArea className='h-[calc(100vh-4rem)]'>
      <div className='container mx-auto p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>Workspace Overview</h1>
          <div className='flex space-x-2'>
            <select className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm'>
              <option value='today'>Today</option>
              <option value='week'>This Week</option>
              <option value='month'>This Month</option>
              <option value='quarter'>This Quarter</option>
            </select>
            <button className='bg-primary text-white px-4 py-2 rounded-md text-sm'>
              Export Report
            </button>
          </div>
        </div>

        <Tabs defaultValue='overview' className='space-y-6'>
          <TabsList className='grid w-full grid-cols-3 mb-4'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='analytics'>Analytics</TabsTrigger>
            <TabsTrigger value='productivity'>Productivity</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-8'>
            {/* Main Dashboard Overview */}
            <DashboardOverview data={data} isLoading={isLoading} />

            {/* Task Trends Section */}
            <div className='mt-8'>
              <h2 className='text-2xl font-semibold mb-4'>Activity Analysis</h2>
              <TaskTrendsCard workspaceId={workspaceId} />
            </div>
          </TabsContent>

          <TabsContent value='analytics' className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              {/* Task Priority Distribution */}
              <Card className='overflow-hidden border-none shadow-md bg-white dark:bg-gray-900'>
                <CardHeader className='bg-gradient-to-r from-pink-500 to-pink-600 text-white'>
                  <CardTitle className='text-lg font-medium'>
                    Task Priority Distribution
                  </CardTitle>
                  <CardDescription className='text-pink-100'>
                    Tasks by priority level
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-6 h-80'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={priorityData}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        outerRadius={80}
                        fill='#8884d8'
                        dataKey='value'
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {priorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Team Productivity */}
              <Card className='overflow-hidden border-none shadow-md bg-white dark:bg-gray-900'>
                <CardHeader className='bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
                  <CardTitle className='text-lg font-medium'>
                    Team Productivity
                  </CardTitle>
                  <CardDescription className='text-blue-100'>
                    Productivity metrics by day
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-6 h-80'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={productivityData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='name' />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey='productivity'
                        name='Productivity %'
                        fill='#3b82f6'
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Additional Analytics Cards */}
            <div className='grid gap-6 md:grid-cols-3'>
              <Card className='bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-950 dark:to-green-900 dark:border-green-800'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-green-600 dark:text-green-400'>
                        Completion Rate
                      </p>
                      <h3 className='text-2xl font-bold mt-1'>87%</h3>
                      <p className='text-xs text-muted-foreground mt-1'>
                        +2.5% from last week
                      </p>
                    </div>
                    <div className='h-12 w-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center'>
                      <CircleCheck className='h-6 w-6 text-green-600 dark:text-green-400' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                        Avg. Response Time
                      </p>
                      <h3 className='text-2xl font-bold mt-1'>3.2h</h3>
                      <p className='text-xs text-muted-foreground mt-1'>
                        -0.5h from last week
                      </p>
                    </div>
                    <div className='h-12 w-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center'>
                      <Clock className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-950 dark:to-purple-900 dark:border-purple-800'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-purple-600 dark:text-purple-400'>
                        Team Engagement
                      </p>
                      <h3 className='text-2xl font-bold mt-1'>92%</h3>
                      <p className='text-xs text-muted-foreground mt-1'>
                        +5% from last week
                      </p>
                    </div>
                    <div className='h-12 w-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center'>
                      <ListChecks className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='productivity' className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <Card className='overflow-hidden border-none shadow-md bg-white dark:bg-gray-900 md:col-span-2'>
                <CardHeader className='bg-gradient-to-r from-purple-500 to-purple-600 text-white'>
                  <CardTitle className='text-lg font-medium'>
                    Team Member Performance
                  </CardTitle>
                  <CardDescription className='text-purple-100'>
                    Task completion and activity metrics by team member
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-6'>
                  <div className='space-y-6'>
                    {/* Team Member 1 */}
                    <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                      <div className='flex items-center space-x-4'>
                        <div className='h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center'>
                          <span className='font-semibold text-purple-600'>
                            JD
                          </span>
                        </div>
                        <div>
                          <p className='font-medium'>John Doe</p>
                          <p className='text-sm text-muted-foreground'>
                            Product Designer
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-4'>
                        <div className='text-right'>
                          <p className='text-sm font-medium'>Tasks Completed</p>
                          <p className='text-lg font-bold text-green-600'>
                            15/18
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm font-medium'>Productivity</p>
                          <p className='text-lg font-bold text-blue-600'>92%</p>
                        </div>
                      </div>
                    </div>

                    {/* Team Member 2 */}
                    <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                      <div className='flex items-center space-x-4'>
                        <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
                          <span className='font-semibold text-blue-600'>
                            JS
                          </span>
                        </div>
                        <div>
                          <p className='font-medium'>Jane Smith</p>
                          <p className='text-sm text-muted-foreground'>
                            Frontend Developer
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-4'>
                        <div className='text-right'>
                          <p className='text-sm font-medium'>Tasks Completed</p>
                          <p className='text-lg font-bold text-green-600'>
                            12/14
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm font-medium'>Productivity</p>
                          <p className='text-lg font-bold text-blue-600'>87%</p>
                        </div>
                      </div>
                    </div>

                    {/* Team Member 3 */}
                    <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                      <div className='flex items-center space-x-4'>
                        <div className='h-10 w-10 rounded-full bg-green-100 flex items-center justify-center'>
                          <span className='font-semibold text-green-600'>
                            RJ
                          </span>
                        </div>
                        <div>
                          <p className='font-medium'>Robert Johnson</p>
                          <p className='text-sm text-muted-foreground'>
                            Backend Developer
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-4'>
                        <div className='text-right'>
                          <p className='text-sm font-medium'>Tasks Completed</p>
                          <p className='text-lg font-bold text-green-600'>
                            9/10
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm font-medium'>Productivity</p>
                          <p className='text-lg font-bold text-blue-600'>95%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
