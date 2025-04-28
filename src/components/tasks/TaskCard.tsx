'use client';

import React from 'react';
import { ITask, ITaskUser } from '@/types/task';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  CalendarDays,
  Flag,
  MessageSquare,
  Paperclip,
  AlignLeft,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: ITask;
  onClick: () => void;
  className?: string;
}

// Helper to format date concisely
const formatDate = (
  dateString: string | Date | null | undefined
): string | null => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    if (date.getFullYear() !== new Date().getFullYear()) {
      options.year = 'numeric';
    }
    return date.toLocaleDateString('en-US', options);
  } catch {
    return null;
  }
};

// Helper to get initials
const getInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName?.[0] ?? '';
  const last = lastName?.[0] ?? '';
  return `${first}${last}`.toUpperCase() || '??';
};

// Type guard to check if an assignee is an ITaskUser object
function isTaskUser(
  assignee: string | ITaskUser | null | undefined
): assignee is ITaskUser {
  return typeof assignee === 'object' && assignee !== null && '_id' in assignee;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, className }) => {
  const dueDate = formatDate(task.dueDate);
  const hasDescription = !!task.description;
  const subtaskCount = 0;
  const commentCount = 0;
  const attachmentCount = 0;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status?.type !== 'done' &&
    task.status?.type !== 'closed';

  const assigneeObjects: ITaskUser[] = task.assignees?.filter(isTaskUser) ?? [];

  // Assign task.priority to a variable for clarity and type checking
  const priorityInfo = task.priority;

  return (
    <div
      className={cn(
        'bg-white p-3 rounded-md shadow-sm border border-gray-200/80 hover:border-gray-300 hover:shadow-md transition-all mb-2 cursor-pointer group',
        className
      )}
      onClick={onClick}
      role='button'
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <h4 className='font-medium text-sm mb-2 leading-snug'>{task.name}</h4>

      <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 mb-2'>
        {assigneeObjects.length > 0 && (
          <div className='flex -space-x-2 overflow-hidden'>
            {assigneeObjects.slice(0, 3).map(assignee => (
              <Avatar
                key={assignee._id}
                className='h-5 w-5 border border-white'
              >
                <AvatarImage
                  src={assignee.avatar}
                  alt={assignee.firstName ?? ''}
                />
                <AvatarFallback className='text-[8px]'>
                  {getInitials(assignee.firstName, assignee.lastName)}
                </AvatarFallback>
              </Avatar>
            ))}
            {assigneeObjects.length > 3 && (
              <span className='flex items-center justify-center h-5 w-5 rounded-full bg-gray-200 text-[8px] text-gray-600 border border-white'>
                +{assigneeObjects.length - 3}
              </span>
            )}
          </div>
        )}

        {dueDate && (
          <div
            className={cn(
              'flex items-center gap-1',
              isOverdue ? 'text-red-600 font-medium' : ''
            )}
          >
            <CalendarDays className='h-3 w-3' />
            <span>{dueDate}</span>
          </div>
        )}

        {/* Use the priorityInfo variable which holds ITaskPriority | null */}
        {priorityInfo && (
          <Badge
            variant='outline'
            className='px-1.5 py-0 text-[10px] font-normal'
            style={{
              borderColor: priorityInfo.color, // Access color from priorityInfo
              color: priorityInfo.color, // Access color from priorityInfo
              backgroundColor: `${priorityInfo.color}1A`,
            }}
          >
            <Flag className='h-2.5 w-2.5 mr-1' />
            {priorityInfo.name} {/* Access priority from priorityInfo */}
          </Badge>
        )}
      </div>

      <div className='flex items-center space-x-2 text-xs text-gray-400 group-hover:text-gray-600 transition-colors'>
        {hasDescription && (
          <div title='Has description'>
            <AlignLeft className='h-3 w-3' />
          </div>
        )}
        {subtaskCount > 0 && (
          <div
            className='flex items-center gap-0.5'
            title={`${subtaskCount} subtasks`}
          >
            <svg
              className='h-3 w-3'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M14.5 10.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z' />
              <path d='M14.5 10.5h5.5v11H4v-11H9.5' />
            </svg>
            <span>{subtaskCount}</span>
          </div>
        )}
        {commentCount > 0 && (
          <div
            className='flex items-center gap-0.5'
            title={`${commentCount} comments`}
          >
            <MessageSquare className='h-3 w-3' />
            <span>{commentCount}</span>
          </div>
        )}
        {attachmentCount > 0 && (
          <div
            className='flex items-center gap-0.5'
            title={`${attachmentCount} attachments`}
          >
            <Paperclip className='h-3 w-3' />
            <span>{attachmentCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};


