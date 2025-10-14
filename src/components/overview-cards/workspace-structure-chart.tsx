'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AnimatedChartCard } from './animated-chart-card';

interface WorkspaceStructureChartProps {
  data: Array<{ name: string; spaces: number; lists: number }>;
  delay?: number;
}

export const WorkspaceStructureChart: React.FC<
  WorkspaceStructureChartProps
> = ({ data, delay = 0 }) => {
  return (
    <AnimatedChartCard
      title='Workspace Structure'
      description='Spaces and lists in your workspace'
      gradient='bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500'
      delay={delay}
      height='h-[350px]'
    >
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray='3 3'
            stroke='#e5e7eb'
            opacity={0.2}
            vertical={false}
          />
          <XAxis
            dataKey='name'
            stroke='#64748b'
            style={{ fontSize: '13px', fontWeight: 500 }}
            tickLine={false}
          />
          <YAxis
            stroke='#64748b'
            style={{ fontSize: '12px' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              padding: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '10px',
              fontSize: '13px',
              fontWeight: 500,
            }}
          />
          <Bar
            dataKey='spaces'
            fill='#3b82f6'
            name='Spaces'
            radius={[10, 10, 0, 0]}
            animationBegin={delay * 1000}
            animationDuration={1000}
          />
          <Bar
            dataKey='lists'
            fill='#10b981'
            name='Lists'
            radius={[10, 10, 0, 0]}
            animationBegin={delay * 1000 + 200}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </AnimatedChartCard>
  );
};
