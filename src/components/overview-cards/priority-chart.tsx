'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { AnimatedChartCard } from './animated-chart-card';

interface PriorityChartProps {
  data: Array<{ name: string; value: number; fill: string }>;
  delay?: number;
}

export const PriorityChart: React.FC<PriorityChartProps> = ({
  data,
  delay = 0,
}) => {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
    undefined
  );

  return (
    <AnimatedChartCard
      title='Task Priority Distribution'
      description='Tasks grouped by priority level'
      gradient='bg-gradient-to-r from-amber-500 via-orange-500 to-red-500'
      delay={delay}
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
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
          />
          <Bar
            dataKey='value'
            radius={[8, 8, 0, 0]}
            animationBegin={delay * 1000}
            animationDuration={1000}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill}
                strokeWidth={activeIndex === index ? 3 : 0}
                stroke='#fff'
                style={{
                  filter: activeIndex === index ? 'brightness(1.2)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </AnimatedChartCard>
  );
};
