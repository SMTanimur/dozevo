'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { ITask } from '@/types';
import {
  Calendar,
  CornerDownRight,
  Network,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { UserAvatar } from '../ui';

interface TaskCardProps {
  task: ITask;
  onClick: () => void;
  level?: number;
}

export default function TaskCard({ task, onClick, level = 0 }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSubtask = !!task.parentTask;
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  const handleExpandToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const indentationStyle = { paddingLeft: `${level * 1.5}rem` };

  return (
    <div
      className={`bg-white rounded-md shadow-sm border border-gray-200 mb-1 ${
        !isSubtask ? '' : 'border-l-2 border-blue-200'
      }`}
    >
      <div
        className='p-3 cursor-pointer hover:bg-gray-50 transition-colors'
        onClick={onClick}
        style={indentationStyle}
      >
        <div className='text-sm font-medium mb-2 flex items-center gap-1'>
          {isSubtask && (
            <CornerDownRight className='h-3 w-3 text-gray-400 flex-shrink-0' />
          )}
          <span>{task.name}</span>
        </div>

        <div className='flex items-center justify-between text-xs text-gray-500'>
          <div className='flex items-center gap-2'>
            {task.dueDate && (
              <div className='flex items-center'>
                <Calendar className='h-3 w-3 mr-1' />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>

          <div className='flex items-center'>
            {task.assignees.length > 0 && (
              <div className='flex -space-x-2'>
                {task.assignees.map(assignee => (
                  <UserAvatar key={assignee._id} user={assignee} size='sm' />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {hasSubtasks && (
        <div
          className='px-3 pb-2 pt-1 text-xs text-gray-600 flex items-center cursor-pointer hover:text-gray-900'
          onClick={handleExpandToggle}
          style={indentationStyle}
        >
          {isExpanded ? (
            <ChevronDown className='h-3.5 w-3.5 mr-1' />
          ) : (
            <ChevronRight className='h-3.5 w-3.5 mr-1' />
          )}
          <Network className='h-3.5 w-3.5 mr-1' />
          <span>
            {task.subtasks && task.subtasks.length} subtask
            {task.subtasks && task.subtasks.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {hasSubtasks && isExpanded && (
        <div className='pb-1'>
          {task.subtasks &&
            task.subtasks.map(subtask => (
              <TaskCard
                key={subtask._id}
                task={subtask}
                onClick={() => onClick()}
                level={level + 1}
              />
            ))}
        </div>
      )}
    </div>
  );
}
