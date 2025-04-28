'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useGetTasks } from '@/hooks/task';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
// Corrected import path
import { TaskCard } from '@/components';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus } from 'lucide-react';
// Import the actual response DTO if available, otherwise define a placeholder
// Assuming TaskResponseDto exists and aligns with fetched data
import { ITask } from '@/types/task';
import { StatusDefinition } from '@/types/space';
import { Skeleton } from '@/components/ui/skeleton';
// TODO: Replace with actual API call/hook for space details
// import { useGetSpace } from '@/hooks/space';

interface BoardViewProps {
  onTaskClick: (taskId: string) => void;
}

// --- Simulate fetching space statuses ---
const useGetSpaceStatuses = (
  spaceId: string | null
): {
  statuses: StatusDefinition[];
  isLoading: boolean;
  error: Error | null;
} => {
  const [statuses, setStatuses] = useState<StatusDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!spaceId) {
      setIsLoading(false);
      setStatuses([]);
      return;
    }
    setIsLoading(true);
    const fetchStatuses = async () => {
      try {
        // Corrected mock data
        const mockStatuses: StatusDefinition[] = [
          {
            clickUpId: undefined,
            status: 'To Do',
            orderindex: 0,
            color: '#d3d3d3',
            type: 'open',
          },
          {
            clickUpId: undefined,
            status: 'In Progress',
            orderindex: 1,
            color: '#aadaff',
            type: 'custom',
          },
          {
            clickUpId: undefined,
            status: 'Review',
            orderindex: 2,
            color: '#f5d0a9',
            type: 'custom',
          },
          {
            clickUpId: undefined,
            status: 'Done',
            orderindex: 3,
            color: '#a8e6cf',
            type: 'done',
          },
          {
            clickUpId: undefined,
            status: 'Closed',
            orderindex: 4,
            color: '#cccccc',
            type: 'closed',
          },
        ];
        await new Promise(resolve => setTimeout(resolve, 500));
        // Assuming 'status' is the correct property name for display
        setStatuses(mockStatuses.sort((a, b) => a.orderindex - b.orderindex));
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch statuses')
        );
        setStatuses([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatuses();
  }, [spaceId]);

  return { statuses, isLoading, error };
};
// --- End Simulation ---

export const BoardView: React.FC<BoardViewProps> = ({ onTaskClick }) => {
  const { w_id, space_id, list_id } = useParams();
  const workspaceId = w_id as string;
  const spaceId = space_id as string;
  // const listId = list_id as string; // Removed as it's not a param for useGetTasks

  const {
    statuses: spaceStatuses,
    isLoading: isLoadingStatuses,
    error: errorStatuses,
  } = useGetSpaceStatuses(spaceId);

  // Removing unsupported filter params (listId, archived)
  const {
    data: tasksResponse,
    isLoading: isLoadingTasks,
    error: errorTasks,
  } = useGetTasks({
    workspaceId,
    spaceId,
    // listId,
    // archived: false,
    // limit: 100,
  });

  // Use the assumed TaskResponseDto type from the hook
  const tasks: ITask[] = (tasksResponse?.data as unknown as ITask[]) ?? [];
  const isLoading = isLoadingStatuses || isLoadingTasks;
  const error = errorStatuses || errorTasks;

  // TODO: Filter tasks by list_id on the client-side
  // Need to know which property on TaskResponseDto holds the list ID (e.g., task.list?._id or task.list)
  const tasksForCurrentList = tasks.filter(task => {
    // Assuming list ID might be nested or directly on the task object
    const taskListId = typeof task.list === 'string' ? task.list : task.list;
    return !list_id || taskListId === list_id; // Show all if no list_id in params, otherwise filter
  });

  // Group by status name (assuming StatusDefinition has 'status' prop for name)
  const tasksByStatus: { [key: string]: ITask[] } = React.useMemo(() => {
    if (isLoading || error || !spaceStatuses) return {};

    const grouped = spaceStatuses.reduce((acc, statusDef) => {
      // Use statusDef.status as the key
      acc[statusDef.status] = [];
      return acc;
    }, {} as { [key: string]: ITask[] });

    // Group tasks intended for the current list
    tasksForCurrentList.forEach(task => {
      // Access status name from the task's status object
      const taskStatusName = task.status?.name;
      if (taskStatusName && grouped.hasOwnProperty(taskStatusName)) {
        grouped[taskStatusName].push(task);
      } else if (grouped.hasOwnProperty('To Do')) {
        grouped['To Do'].push(task);
      }
    });

    // Sort by orderIndex (camelCase)
    Object.values(grouped).forEach(taskList => {
      taskList.sort(
        (a, b) =>
          (a.orderIndex ?? 0) - (b.orderIndex ?? 0) ||
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });

    return grouped;
  }, [tasksForCurrentList, spaceStatuses, isLoading, error]);

  if (error)
    return (
      <div className='p-4 text-red-600'>
        Error loading board data: {error.message}
      </div>
    );

  return (
    <div className='p-4 h-full flex flex-col'>
      <ScrollArea className='flex-1 -mx-4'>
        <div className='flex space-x-4 px-4 pb-4 h-full min-h-[calc(100vh-18rem)]'>
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className='w-72 flex-shrink-0'>
                <Skeleton className='h-8 w-3/4 mb-3' />
                <Skeleton className='h-20 w-full mb-2' />
                <Skeleton className='h-16 w-full mb-2' />
                <Skeleton className='h-18 w-full mb-2' />
              </div>
            ))}

          {!isLoading &&
            spaceStatuses?.map(statusDef => (
              <div
                key={statusDef.status}
                className='w-72 bg-gray-100/80 rounded-lg shadow-sm flex flex-col flex-shrink-0 h-full'
              >
                <div className='p-3 flex justify-between items-center sticky top-0 bg-gray-100/80 rounded-t-lg z-10 border-b border-gray-200/80'>
                  <div className='flex items-center gap-2'>
                    <span
                      className='w-2.5 h-2.5 rounded-full'
                      style={{ backgroundColor: statusDef.color }}
                      title={statusDef.type}
                    ></span>
                    <h3
                      className='font-semibold text-sm flex items-center gap-2 uppercase tracking-wide'
                      style={{
                        color: statusDef.color
                          ? darkenColor(statusDef.color, 0.2)
                          : undefined,
                      }}
                    >
                      {statusDef.status}
                    </h3>
                    <span className='text-gray-400 text-xs font-normal'>
                      {tasksByStatus[statusDef.status]?.length ?? 0}
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-6 w-6 p-0 text-gray-500 hover:text-gray-800'
                    >
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-6 w-6 p-0 text-gray-500 hover:text-gray-800'
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
                <ScrollArea className='flex-1'>
                  <div className='p-2 space-y-2'>
                    {tasksByStatus[statusDef.status]?.map(task => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onClick={() => onTaskClick(task._id)}
                      />
                    ))}
                    <Button
                      variant='ghost'
                      className='w-full justify-start mt-1 text-gray-500 hover:bg-gray-200/70 hover:text-gray-700'
                      size='sm'
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Add Task
                    </Button>
                  </div>
                </ScrollArea>
              </div>
            ))}

          {!isLoading && (
            <Button
              variant='ghost'
              className='w-72 flex-shrink-0 h-10 self-start mt-[0.8rem] flex items-center justify-center bg-gray-100/50 hover:bg-gray-200/50 text-gray-500 border-2 border-dashed border-gray-300/70'
            >
              <Plus className='h-4 w-4 mr-2' />
              New Status
            </Button>
          )}
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </div>
  );
};

function darkenColor(hex: string, percent: number): string {
  if (!hex || !hex.startsWith('#')) return hex;
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  const factor = 1 - percent;
  r = Math.max(0, Math.min(255, Math.floor(r * factor)));
  g = Math.max(0, Math.min(255, Math.floor(g * factor)));
  b = Math.max(0, Math.min(255, Math.floor(b * factor)));
  const rr = r.toString(16).padStart(2, '0');
  const gg = g.toString(16).padStart(2, '0');
  const bb = b.toString(16).padStart(2, '0');
  return `#${rr}${gg}${bb}`;
}


