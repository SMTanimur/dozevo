'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { AnimatedChartCard } from './animated-chart-card';

interface TaskStatusChartProps {
  data: Array<{ name: string; value: number }>;
  delay?: number;
}

const STATUS_COLORS: Record<string, string> = {
  'To Do': '#3b82f6',
  'In Progress': '#f59e0b',
  Completed: '#10b981',
  Done: '#10b981',
  Blocked: '#ef4444',
  Review: '#8b5cf6',
  'No Status': '#9ca3af',
};

const RADIAN = Math.PI / 180;

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: CustomLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Don't show label for very small slices

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
      className='font-semibold text-xs'
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const TaskStatusChart: React.FC<TaskStatusChartProps> = ({
  data,
  delay = 0,
}) => {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
    undefined
  );

  return (
    <AnimatedChartCard
      title='Task Status Distribution'
      description='Overview of tasks by status'
      gradient='bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600'
      delay={delay}
    >
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            innerRadius={60}
            fill='#8884d8'
            dataKey='value'
            nameKey='name'
            animationBegin={delay * 1000}
            animationDuration={1000}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.name] || '#9ca3af'}
                strokeWidth={activeIndex === index ? 4 : 2}
                stroke={activeIndex === index ? '#fff' : 'transparent'}
                style={{
                  filter: activeIndex === index ? 'brightness(1.2)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
            }}
          />
          <Legend
            layout='horizontal'
            verticalAlign='bottom'
            align='center'
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </AnimatedChartCard>
  );
};
