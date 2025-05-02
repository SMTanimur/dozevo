'use client';

import { formatDate } from '@/lib/utils';
import { MoreHorizontal, Calendar, Flag, CornerDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ITask } from '@/types';
import { UserAvatar } from '../ui';
import { getPriorityDetails, PriorityId } from '@/constants';

interface TaskRowProps {
  task: ITask;
  onClick: () => void;
}

export const TaskRow = ({ task, onClick }: TaskRowProps) => {
  const priorityDetails = getPriorityDetails(
    task.priority as PriorityId | null | undefined
  );

  const isSubtask = !!task.parentTask;

  return (
    <div
      className={`grid grid-cols-[1fr,200px,120px,100px,40px] px-4 py-2 hover:bg-gray-50 cursor-pointer border-b ${
        isSubtask ? 'pl-8' : ''
      }`}
      onClick={onClick}
    >
      <div className='flex items-center gap-2'>
        {isSubtask && (
          <CornerDownRight className='h-4 w-4 text-gray-400 mr-1' />
        )}
        <div
          className='w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center'
          style={{ backgroundColor: task.status.color }}
        >
          {task.status.type === 'in_progress' && (
            <div className='w-1.5 h-1.5 rounded-full bg-white' />
          )}
          {task.status.type === 'done' && (
            <svg
              className='w-2.5 h-2.5 text-white'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          )}
        </div>
        <span>{task.name}</span>
      </div>

      <div className='flex items-center'>
        {task.assignees.length > 0 ? (
          <div className='flex -space-x-2'>
            {task.assignees.map(assignee => (
              <UserAvatar key={assignee._id} user={assignee} size='sm' />
            ))}
          </div>
        ) : (
          <Button variant='ghost' size='sm' className='text-gray-400'>
            <span>Assign</span>
          </Button>
        )}
      </div>

      <div className='flex items-center'>
        {task.dueDate ? (
          <div className='flex items-center text-sm'>
            <Calendar className='h-3.5 w-3.5 mr-1 text-gray-500' />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        ) : (
          <Button variant='ghost' size='sm' className='text-gray-400'>
            <Calendar className='h-3.5 w-3.5 mr-1' />
            <span>Set date</span>
          </Button>
        )}
      </div>

      <div className='flex items-center'>
        {priorityDetails ? (
          <div
            className='flex items-center text-sm'
            style={{ color: priorityDetails.color }}
          >
            <priorityDetails.icon className='h-3.5 w-3.5 mr-1' />
            <span>{priorityDetails.name}</span>
          </div>
        ) : (
          <Button variant='ghost' size='sm' className='text-gray-400'>
            <Flag className='h-3.5 w-3.5 mr-1' />
          </Button>
        )}
      </div>

      <div className='flex items-center justify-end'>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8'
          onClick={e => {
            e.stopPropagation();
            // Handle more options
          }}
        >
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};
