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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ITask } from '@/types';
import { UserAvatar } from '../ui';
import { getPriorityDetails, PriorityId } from '@/constants';

interface TaskRowProps {
  task: ITask;
  onClick: () => void;
  level?: number;
}

export const TaskRow = ({ task, onClick, level = 0 }: TaskRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const priorityDetails = getPriorityDetails(
    task.priority as PriorityId | null | undefined
  );

  const isSubtask = !!task.parentTask;
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  const indentationStyle = { paddingLeft: `${level * 1.5 + 1}rem` };

  const handleExpandToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <React.Fragment>
      <div
        className={`grid grid-cols-[1fr,200px,120px,100px,40px] py-2 hover:bg-gray-50 cursor-pointer border-b items-center`}
        style={indentationStyle}
        onClick={onClick}
      >
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
      {hasSubtasks && isExpanded && task.subtasks && (
        <div className='subtask-container'>
          {task.subtasks.map(subtask => (
            <TaskRow
              key={subtask._id}
              task={subtask}
              onClick={onClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </React.Fragment>
  );
};
