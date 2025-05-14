'use client';

import React, { useState } from 'react';
import { formatDate } from '@/lib/utils';
import {
  Calendar,
  Flag,
  CornerDownRight,
  ChevronDown,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ITask } from '@/types';
import { UserAvatar } from '../ui';
import { getPriorityDetails, PriorityId } from '@/constants';
import { cn } from '@/lib/utils';
import { useGlobalStateStore } from '@/stores';

interface TaskRowProps {
  task: ITask;
  onClick: () => void;
  level?: number;
  className?: string;
}

export const TaskRow = ({
  task,
  onClick,
  level = 0,
  className,
}: TaskRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { openTaskModal } = useGlobalStateStore();
  const priorityDetails = getPriorityDetails(
    task.priority as PriorityId | null | undefined
  );

  const isSubtask = !!task.parentTask;
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  const handleExpandToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <React.Fragment>
      <div
        className={cn(
          'group py-2 hover:bg-gray-50 cursor-pointer relative grid grid-cols-[minmax(0,1fr)_200px_120px_100px] items-center px-6',
          className
        )}
        onClick={onClick}
      >
        {/* Name column */}
        <div className='flex items-center gap-2 min-w-0'>
          {isSubtask && (
            <CornerDownRight className='h-4 w-4 text-gray-400 mr-1 flex-shrink-0' />
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
          {hasSubtasks ? (
            <button
              onClick={handleExpandToggle}
              className='p-0.5 rounded hover:bg-gray-200'
            >
              {isExpanded ? (
                <ChevronDown className='h-3.5 w-3.5 text-gray-500' />
              ) : (
                <ChevronRight className='h-3.5 w-3.5 text-gray-500' />
              )}
            </button>
          ) : (
            <div className='w-[18px]'></div>
          )}
          <span className='truncate' title={task.name}>
            {task.name}
          </span>
        </div>
        {/* Assignee column */}
        <div className='flex items-center'>
          {task.assignees.length > 0 ? (
            <div className='flex -space-x-2'>
              {task.assignees.map(assignee => (
                <UserAvatar key={assignee._id} user={assignee} size='sm' />
              ))}
            </div>
          ) : (
            <Button
              variant='ghost'
              size='sm'
              className='text-gray-400 px-2 h-7'
            >
              <UserPlus className='h-3.5 w-3.5 mr-1' />
              <span>Assign</span>
            </Button>
          )}
        </div>
        {/* Due date column */}
        <div className='flex items-center text-xs text-gray-500 gap-1'>
          <Calendar className='h-4 w-4' />
          {task.due_date ? formatDate(task.due_date) : 'Set date'}
        </div>
        {/* Priority column */}
        <div className='flex items-center text-xs gap-1'>
          {priorityDetails ? (
            <>
              <priorityDetails.icon
                className='h-4 w-4'
                style={{ color: priorityDetails.color }}
              />
              <span style={{ color: priorityDetails.color }}>
                {priorityDetails.name}
              </span>
            </>
          ) : (
            <Flag className='h-4 w-4 text-gray-300' />
          )}
        </div>
      </div>
      {hasSubtasks && isExpanded && task.subtasks && (
        <div className='subtask-container ml-8'>
          {task.subtasks.map(subtask => (
            <TaskRow
              key={subtask._id}
              task={subtask}
              onClick={() => openTaskModal(subtask._id)}
              level={level + 1}
              className={className}
            />
          ))}
        </div>
      )}
    </React.Fragment>
  );
};
