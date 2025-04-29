'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, MoreHorizontal } from 'lucide-react';

import { TaskRow } from '@/components/tasks/task-row';
import { IList, IStatusDefinition, ITask } from '@/types';
import { useGetStatuses } from '@/hooks/list';
import { useTaskMutations } from '@/hooks/task';
import { useGlobalStateStore } from '@/stores';
import { TCreateTask } from '@/validations';

type TaskListViewProps = {
  list: IList;
  tasks: ITask[];
};
export const TaskListView = ({ list, tasks }: TaskListViewProps) => {
  const { openTaskModal } = useGlobalStateStore();
  const { data: statuses = [], isLoading: isLoadingStatuses } = useGetStatuses({
    workspaceId: list?.workspace as string,
    spaceId: list?.space as string,
    listId: list?._id as string,
  });

  const { createTask } = useTaskMutations();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    if (statuses.length > 0) {
      setExpandedGroups(
        Object.fromEntries(statuses.map(status => [status._id, true]))
      );
    }
  }, [statuses]);

  const toggleGroup = (statusId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [statusId]: !prev[statusId],
    }));
  };

  const handleAddTask = (status: IStatusDefinition) => {
    const newTask: TCreateTask = {
      name: 'New Task',
      status: status._id,
      listId: list._id,
      
    };

    createTask({
      data: newTask,
      params: {
        spaceId: list.space as string,
        listId: list._id as string,
      },
    });
  };

  const tasksByStatus = statuses.reduce((acc, status) => {
    acc[status._id] = tasks.filter(task => task.status?._id === status._id);
    return acc;
  }, {} as Record<string, ITask[]>);

  if (isLoadingStatuses) {
    return <div>Loading statuses...</div>;
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center justify-between p-4 border-b'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <span>Group: Status</span>
            <ChevronDown className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <span>Subtasks</span>
            <ChevronDown className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <span>Columns</span>
            <ChevronDown className='h-4 w-4' />
          </Button>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <span>Filter</span>
            <ChevronDown className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <span>Sort</span>
            <ChevronDown className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <span>Closed</span>
            <ChevronDown className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <span>Assignee</span>
            <ChevronDown className='h-4 w-4' />
          </Button>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search...'
              className='h-9 px-3 py-1 rounded-md border border-input bg-background text-sm'
            />
          </div>
          <Button variant='ghost' size='icon' className='h-9 w-9'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='flex-1 overflow-auto'>
        {statuses.map(status => (
          <div key={status._id} className='border-b'>
            <div
              className='flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50'
              onClick={() => toggleGroup(status._id)}
            >
              <div
                className='w-5 h-5 rounded-full mr-2 flex items-center justify-center'
                style={{ backgroundColor: status.color }}
              >
                {status.type === 'in_progress' && (
                  <div className='w-2 h-2 rounded-full bg-white' />
                )}
                {status.type === 'done' && (
                  <svg
                    className='w-3 h-3 text-white'
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
              <span className='font-medium'>{status.status}</span>
              <span className='ml-2 text-gray-500 text-sm'>
                {tasksByStatus[status._id]?.length || 0}
              </span>
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${
                  expandedGroups[status._id] ? 'rotate-180' : ''
                }`}
              />
              <Button
                variant='ghost'
                size='sm'
                className='ml-auto'
                onClick={e => {
                  e.stopPropagation();
                  handleAddTask(status);
                }}
              >
                <Plus className='h-4 w-4' />
                <span className='ml-1'>Add Task</span>
              </Button>
              <Button variant='ghost' size='icon' className='ml-2 h-8 w-8'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </div>

            {expandedGroups[status._id] && (
              <div>
                <div className='grid grid-cols-[1fr,200px,120px,100px,40px] px-4 py-2 text-sm text-gray-500 border-y'>
                  <div>Name</div>
                  <div>Assignee</div>
                  <div>Due date</div>
                  <div>Priority</div>
                  <div></div>
                </div>

                {(tasksByStatus[status._id] || []).map(task => (
                  <TaskRow
                    key={task._id}
                    task={task}
                    onClick={() => openTaskModal(task._id)}
                  />
                ))}

                <div className='px-4 py-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-500'
                    onClick={() => handleAddTask(status)}
                  >
                    <Plus className='h-4 w-4 mr-1' />
                    Add Task
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
