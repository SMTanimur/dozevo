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
      height='h-72'
    >
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' opacity={0.3} />
          <XAxis dataKey='name' stroke='#9ca3af' style={{ fontSize: '12px' }} />
          <YAxis stroke='#9ca3af' style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
            }}
          />
          <Legend />
          <Bar
            dataKey='spaces'
            fill='#3b82f6'
            name='Spaces'
            radius={[8, 8, 0, 0]}
            animationBegin={delay * 1000}
            animationDuration={1000}
          />
          <Bar
            dataKey='lists'
            fill='#10b981'
            name='Lists'
            radius={[8, 8, 0, 0]}
            animationBegin={delay * 1000 + 200}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </AnimatedChartCard>
  );
};
