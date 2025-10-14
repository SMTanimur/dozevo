'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AnimatedChartCard } from './animated-chart-card';

interface ActivityTrendChartProps {
  data: Array<{ date: string; count: number }>;
  delay?: number;
}

export const ActivityTrendChart: React.FC<ActivityTrendChartProps> = ({
  data,
  delay = 0,
}) => {
  return (
    <AnimatedChartCard
      title='Activity Trend'
      description='Your activity over the last 7 days'
      gradient='bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600'
      delay={delay}
    >
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id='colorActivity' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#8b5cf6' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#8b5cf6' stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' opacity={0.3} />
          <XAxis dataKey='date' stroke='#9ca3af' style={{ fontSize: '12px' }} />
          <YAxis stroke='#9ca3af' style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
            }}
            labelStyle={{ color: 'white' }}
          />
          <Area
            type='monotone'
            dataKey='count'
            stroke='#8b5cf6'
            strokeWidth={3}
            fillOpacity={1}
            fill='url(#colorActivity)'
            animationBegin={delay * 1000}
            animationDuration={1500}
            name='Activities'
          />
        </AreaChart>
      </ResponsiveContainer>
    </AnimatedChartCard>
  );
};
