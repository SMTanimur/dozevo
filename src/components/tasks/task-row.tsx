'use client';

import React, { useState } from 'react';
import { formatDate } from '@/lib/utils';
import {
  MoreHorizontal,
  Calendar,
  Flag,
  CornerDownRight,
  ChevronDown,
  ChevronRight,
  UserPlus,
  PlusCircle,
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
          'group py-2 hover:bg-gray-50 cursor-pointer relative',
          className
        )}
        onClick={onClick}
      >
        <div className='flex flex-1 items-center gap-2 min-w-0 pl-4'>
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

        <div className='relative flex items-center justify-start w-[200px] flex-shrink-0'>
          <div className='transition-opacity opacity-100 group-hover:opacity-0'>
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
          <Button
            variant='ghost'
            size='icon'
            className='absolute inset-0 m-auto h-7 w-7 transition-opacity opacity-0 group-hover:opacity-100'
            onClick={e => {
              e.stopPropagation();
              console.log('Assign clicked');
            }}
          >
            <UserPlus className='h-4 w-4' />
          </Button>
        </div>

        <div className='relative flex items-center justify-start w-[120px] flex-shrink-0'>
          <div className='transition-opacity opacity-100 group-hover:opacity-0'>
            {task.due_date ? (
              <div className='flex items-center text-sm'>
                <Calendar className='h-3.5 w-3.5 mr-1 text-gray-500' />
                <span>{formatDate(task.due_date)}</span>
              </div>
            ) : (
              <Button
                variant='ghost'
                size='sm'
                className='text-gray-400 px-2 h-7'
              >
                <Calendar className='h-3.5 w-3.5 mr-1' />
                <span>Set date</span>
              </Button>
            )}
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='absolute inset-0 m-auto h-7 w-7 transition-opacity opacity-0 group-hover:opacity-100'
            onClick={e => {
              e.stopPropagation();
              console.log('Set Date clicked');
            }}
          >
            <Calendar className='h-4 w-4' />
          </Button>
        </div>

        <div className='relative flex items-center justify-start w-[100px] flex-shrink-0'>
          <div className='transition-opacity opacity-100 group-hover:opacity-0'>
            {priorityDetails ? (
              <div
                className='flex items-center text-sm'
                style={{ color: priorityDetails.color }}
              >
                <priorityDetails.icon className='h-3.5 w-3.5 mr-1' />
                <span>{priorityDetails.name}</span>
              </div>
            ) : (
              <Button
                variant='ghost'
                size='sm'
                className='text-gray-400 px-2 h-7'
              >
                <Flag className='h-3.5 w-3.5 mr-1' />
                <span>Set Priority</span>
              </Button>
            )}
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='absolute inset-0 m-auto h-7 w-7 transition-opacity opacity-0 group-hover:opacity-100'
            onClick={e => {
              e.stopPropagation();
              console.log('Set Priority clicked');
            }}
          >
            <Flag className='h-4 w-4' />
          </Button>
        </div>

        <div className='relative flex items-center justify-end w-[40px] flex-shrink-0 pr-4'>
          <Button
            variant='ghost'
            size='icon'
            className='absolute left-0 h-7 w-7 transition-opacity opacity-0 group-hover:opacity-100'
            onClick={e => {
              e.stopPropagation();
              console.log('Add Subtask clicked');
            }}
            title='Add subtask'
          >
            <PlusCircle className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8'
            onClick={e => {
              e.stopPropagation();
              // Handle more options
            }}
            title='More options'
          >
            <MoreHorizontal className='h-4 w-4' />
          </Button>
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
