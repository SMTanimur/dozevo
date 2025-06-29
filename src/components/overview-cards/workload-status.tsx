import React from 'react';
import { Card } from '../ui';
import { PieChart } from 'lucide-react';

interface WorkloadStatusProps {
  workloadByStatus?: Record<string, unknown>[];
}

export const WorkloadStatus = ({ workloadByStatus }: WorkloadStatusProps) => {
  return (
    <Card className='p-4 h-full'>
      <h2 className='text-lg drag-handle font-medium mb-4'>
        Workload by Status
      </h2>
      <div className='space-y-3'>
        {workloadByStatus && workloadByStatus.length > 0 ? (
          workloadByStatus.map((item: Record<string, unknown>) => (
            <div
              key={item.status as string}
              className='flex items-center justify-between'
            >
              <div className='flex items-center gap-2'>
                <div
                  className='w-3 h-3 rounded-full'
                  style={{
                    backgroundColor: (item.color as string) || '#9CA3AF',
                  }}
                />
                <span className='text-sm'>{item.status as string}</span>
              </div>
              <span className='text-sm font-medium'>
                {item.count as number}
              </span>
            </div>
          ))
        ) : (
          <div className='flex justify-center items-center h-32 text-muted-foreground'>
            <div className='text-center'>
              <PieChart className='h-8 w-8 mx-auto mb-2' />
              <span className='text-sm'>No workload data</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
