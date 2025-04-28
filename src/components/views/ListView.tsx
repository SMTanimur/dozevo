'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetTasks } from '@/hooks/task';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, Flag, CalendarDays } from 'lucide-react'; // Removed GripVertical
import { ITask, ITaskUser } from '@/types/task'; // Assuming TaskResponseDto exists
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ListViewProps {
  onTaskClick: (taskId: string) => void;
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

// Type guard for assignees - specify parameter type
function isTaskUser(
  assignee: string | ITaskUser | null | undefined
): assignee is ITaskUser {
  return typeof assignee === 'object' && assignee !== null && '_id' in assignee;
}

export const ListView: React.FC<ListViewProps> = ({ onTaskClick }) => {
  const { w_id, space_id, list_id } = useParams();
  const workspaceId = w_id as string;
  const spaceId = space_id as string;
  // const listId = list_id as string; // Keep for client-side filtering

  // Fetch tasks for the whole space, filter client-side
  const {
    data: tasksResponse,
    isLoading,
    error,
  } = useGetTasks({
    workspaceId,
    spaceId,
    // Removed unsupported filters like listId, archived, limit
  });

  const allTasks: ITask[] = (tasksResponse?.data as unknown as ITask[]) ?? [];

  // Client-side filtering for the current list
  const tasks = allTasks.filter(task => {
    const taskListId =
      typeof task.list === 'string' ? task.list : task.list;
    return !list_id || taskListId === (list_id as string);
  });

  if (error)  
    return (
      <div className='p-4 text-red-600'>
        Error loading tasks: {error.message}
      </div>
    );

  return (
    <div className='p-4 h-full flex flex-col'>
      <div className='mb-4 flex justify-start'>
        <Button variant='outline' size='sm'>
          <Plus className='h-4 w-4 mr-2' />
          Add Task
        </Button>
      </div>

      <div className='flex-1 overflow-auto border rounded-md'>
        <Table className='bg-white'>
          <TableHeader className='sticky top-0 bg-gray-50 z-10'>
            <TableRow>
              <TableHead className='w-[50px]'></TableHead>
              <TableHead className='min-w-[250px]'>Task Name</TableHead>
              <TableHead className='min-w-[150px]'>Status</TableHead>
              <TableHead className='min-w-[180px]'>Assignee</TableHead>
              <TableHead className='min-w-[120px]'>Due Date</TableHead>
              <TableHead className='min-w-[120px]'>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className='h-4 w-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-4/5' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-3/5' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-6 w-6 rounded-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-3/5' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-2/5' />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading &&
              tasks.map(task => {
                // Use task.due_date based on previous findings
                const dueDate = formatDate(task.dueDate);
                const isOverdue =
                  task.dueDate &&
                  new Date(task.dueDate) < new Date() &&
                  task.status?.type !== 'done' &&
                  task.status?.type !== 'closed';
                // Filter assignees to only use objects
                const assigneeObjects =
                  task.assignees?.filter(isTaskUser) ?? [];

                return (
                  <TableRow
                    key={task._id}
                    className='cursor-pointer hover:bg-gray-50/80 group'
                    onClick={() => onTaskClick(task._id)}
                  >
                    <TableCell>
                      <Checkbox
                        onClick={e => e.stopPropagation()}
                        aria-label={`Select task ${task.name}`}
                      />
                    </TableCell>
                    <TableCell className='font-medium text-sm'>
                      {task.name}
                    </TableCell>
                    <TableCell>
                      {task.status ? (
                        <Badge
                          variant='outline'
                          className='px-2 py-0.5 text-xs font-normal'
                          style={{
                            borderColor: task.status.color,
                            color: task.status.color,
                            backgroundColor: `${task.status.color}1A`,
                          }}
                        >
                          {task.status.name}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {assigneeObjects.length > 0 ? (
                        <div className='flex items-center gap-1'>
                          <Avatar className='h-6 w-6'>
                            <AvatarImage
                              src={assigneeObjects[0].avatar}
                              alt={assigneeObjects[0].firstName ?? ''}
                            />
                            <AvatarFallback className='text-[10px]'>
                              {getInitials(
                                assigneeObjects[0].firstName,
                                assigneeObjects[0].lastName
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <span className='text-sm'>
                            {assigneeObjects[0].firstName}{' '}
                            {assigneeObjects[0].lastName}
                            {assigneeObjects.length > 1 &&
                              ` + ${assigneeObjects.length - 1}`}
                          </span>
                        </div>
                      ) : (
                        <span className='text-sm text-gray-400'>
                          Unassigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {dueDate ? (
                        <div
                          className={cn(
                            'flex items-center gap-1.5 text-sm',
                            isOverdue
                              ? 'text-red-600 font-medium'
                              : 'text-gray-700'
                          )}
                        >
                          <CalendarDays className='h-3.5 w-3.5' />
                          <span>{dueDate}</span>
                        </div>
                      ) : (
                        <span className='text-sm text-gray-400'>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {task.priority ? (
                        <Badge
                          variant='outline'
                          className='px-1.5 py-0.5 text-xs font-normal'
                          style={{
                            borderColor: task.priority.color,
                            color: task.priority.color,
                            backgroundColor: `${task.priority.color}1A`,
                          }}
                        >
                          <Flag className='h-2.5 w-2.5 mr-1' />
                          {task.priority.name}
                        </Badge>
                      ) : (
                        <span className='text-sm text-gray-400'>-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

            {!isLoading && (
              <TableRow className='hover:bg-transparent'>
                <TableCell colSpan={6} className='p-0'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full h-10 justify-start text-gray-500 font-normal px-4 hover:bg-gray-100'
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Add Task
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {!isLoading && tasks.length === 0 && (
          <div className='text-center py-10 text-gray-500'>
            No tasks found in this list.
          </div>
        )}
      </div>
    </div>
  );
};

