'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ITask, Priority } from '@/types';
import {
  Calendar,
  CornerDownRight,
  Network,
  ChevronRight,
  ChevronDown,
  User,
  Flag,
  X,
} from 'lucide-react';
import { UserAvatar } from '../ui';
import { useGlobalStateStore } from '@/stores';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { PRIORITIES, getPriorityDetails, PriorityId } from '@/constants';
import { useTaskMutations } from '@/hooks/task';
import {
  DueDatePopoverContent,
  formatRelativeDate,
} from './due-date-popover-content';

interface TaskCardProps {
  task: ITask;
  level?: number;
  mutationParams: {
    workspaceId: string;
    spaceId: string;
    listId: string;
  };
}

export default function TaskCard({
  task,
  level = 0,
  mutationParams,
}: TaskCardProps) {
  const { openTaskModal } = useGlobalStateStore();
  const { updateTask } = useTaskMutations();
  const [isExpanded, setIsExpanded] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.due_date ? new Date(task.due_date) : undefined
  );

  const isSubtask = !!task.parentTask;
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const currentPriority = getPriorityDetails(task.priority as PriorityId);

  const handleExpandToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleDateSelect = (selectedDate: Date | undefined | null) => {
    const newDate = selectedDate === null ? null : selectedDate;
    setDueDate(newDate ?? undefined);
    updateTask({
      taskId: task._id,
      data: { due_date: newDate ? newDate.toISOString() : null },
      params: mutationParams,
    });
  };

  const handlePrioritySelect = (priority: Priority | null) => {
    updateTask({
      taskId: task._id,
      data: { priority: priority },
      params: mutationParams,
    });
  };

  const indentationStyle = { marginLeft: `${level * 1.5}rem` };

  return (
    <React.Fragment>
      <div
        className={`bg-white rounded-md shadow-sm border border-gray-200 mb-1 ${
          !isSubtask ? '' : 'border-l-2 border-blue-200'
        }`}
        style={isSubtask ? indentationStyle : undefined}
      >
        <TooltipProvider delayDuration={200}>
          <div className='p-3'>
            <div
              className='text-sm font-medium mb-2 flex items-center gap-1 cursor-pointer hover:text-blue-600'
              onClick={() => openTaskModal(task._id)}
              title={task.name}
            >
              {isSubtask && (
                <CornerDownRight className='h-3 w-3 text-gray-400 flex-shrink-0 mr-1' />
              )}
              <span className='truncate'>{task.name}</span>
            </div>

            <div className='flex items-center gap-1 text-xs text-gray-500'>
              <Popover>
                <Tooltip>
                  <PopoverTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6 rounded-full'
                      >
                        {task.assignees && task.assignees.length > 0 ? (
                          <UserAvatar user={task.assignees[0]} size='sm' />
                        ) : (
                          <User className='h-3.5 w-3.5' />
                        )}
                      </Button>
                    </TooltipTrigger>
                  </PopoverTrigger>
                  <TooltipContent>Assignee</TooltipContent>
                </Tooltip>
                <PopoverContent className='w-60 p-0'>
                  <div className='p-2'>
                    <Input
                      placeholder='Search or enter email...'
                      className='text-xs'
                    />
                  </div>
                  <div className='p-2 text-center text-gray-400 text-xs'>
                    User list placeholder
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <Tooltip>
                  <PopoverTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        variant={'outline'}
                        size='sm'
                        className={cn(
                          'h-6 px-2 text-xs justify-start text-left font-normal rounded-md',
                          !dueDate && 'text-muted-foreground'
                        )}
                      >
                        <Calendar className='mr-1 h-3.5 w-3.5' />
                        <span>{formatRelativeDate(dueDate)}</span>
                      </Button>
                    </TooltipTrigger>
                  </PopoverTrigger>
                  <TooltipContent>Due date</TooltipContent>
                </Tooltip>
                <PopoverContent className='w-auto p-0'>
                  <DueDatePopoverContent
                    selectedDate={dueDate}
                    onDateSelect={handleDateSelect}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <Tooltip>
                  <PopoverTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6 rounded-full'
                      >
                        {currentPriority ? (
                          <currentPriority.icon
                            className='h-3.5 w-3.5'
                            style={{ color: currentPriority.color }}
                          />
                        ) : (
                          <Flag className='h-3.5 w-3.5' />
                        )}
                      </Button>
                    </TooltipTrigger>
                  </PopoverTrigger>
                  <TooltipContent>Priority</TooltipContent>
                </Tooltip>
                <PopoverContent className='w-40 p-0'>
                  <div className='py-1'>
                    {Object.values(PRIORITIES).map(
                      (p: (typeof PRIORITIES)[keyof typeof PRIORITIES]) => (
                        <Button
                          key={p.id}
                          variant='ghost'
                          size='sm'
                          className='w-full justify-start text-sm font-normal px-2 py-1.5'
                          onClick={() => handlePrioritySelect(p.id as Priority)}
                        >
                          <p.icon
                            className='mr-2 h-4 w-4'
                            style={{ color: p.color }}
                          />
                          {p.name}
                        </Button>
                      )
                    )}
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full justify-start text-sm font-normal px-2 py-1.5 text-red-600 hover:text-red-700'
                      onClick={() => handlePrioritySelect(null)}
                    >
                      <X className='mr-2 h-4 w-4' />
                      Clear
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {!isSubtask && hasSubtasks && (
            <div
              className='px-3 pb-2 pt-1 text-xs text-gray-600 flex items-center cursor-pointer hover:text-gray-900'
              onClick={handleExpandToggle}
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
        </TooltipProvider>
      </div>

      {hasSubtasks && isExpanded && (
        <div className='subtasks-container'>
          {task.subtasks &&
            task.subtasks.map(subtask => (
              <TaskCard
                key={subtask._id}
                task={subtask}
                mutationParams={mutationParams}
                level={level + 1}
              />
            ))}
        </div>
      )}
    </React.Fragment>
  );
}
