import { Card } from '@/components/ui/card';
import { Clock, List, CheckSquare } from 'lucide-react';

interface RecentCardProps {
  recentTasks?: Record<string, unknown>[];
}

export const RecentCard = ({ recentTasks }: RecentCardProps) => {
  const getTaskIcon = (status?: string) => {
    if (!status) return <CheckSquare className='h-4 w-4 text-gray-500' />;

    const statusLower = status.toLowerCase();
    if (statusLower.includes('complete') || statusLower.includes('done')) {
      return <CheckSquare className='h-4 w-4 text-green-500' />;
    } else if (statusLower.includes('progress')) {
      return <Clock className='h-4 w-4 text-blue-500' />;
    } else {
      return <List className='h-4 w-4 text-gray-500' />;
    }
  };

  return (
    <Card className='p-4 h-full'>
      <h2 className='text-lg drag-handle font-medium mb-4'>Recent</h2>
      <div className='space-y-3'>
        {recentTasks && recentTasks.length > 0 ? (
          recentTasks.map((task: Record<string, unknown>) => {
            const status = task.status as Record<string, unknown>;
            return (
              <div key={task._id as string} className='flex items-center gap-2'>
                {getTaskIcon(status?.status as string)}
                <span className='truncate'>{task.name as string}</span>
                <span className='text-gray-500 text-sm'>• in Tasks</span>
              </div>
            );
          })
        ) : (
          <div className='text-gray-500 text-sm'>No recent tasks</div>
        )}
      </div>
    </Card>
  );
};
