'use client';

import { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  Plus,
  MoreHorizontal,
  Circle,
  CircleCheck,
  CircleX,
} from 'lucide-react';

import { TaskRow } from '@/components/tasks/task-row';
import { IList, IStatusDefinition, ITask } from '@/types';
import { useGetStatuses } from '@/hooks/list';
import { useTaskMutations } from '@/hooks/task';
import { useGlobalStateStore } from '@/stores';
import { TCreateTask } from '@/validations';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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

  const { createTask, reorderTasks } = useTaskMutations();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const [tasksByStatus, setTasksByStatus] = useState<Record<string, ITask[]>>(
    {}
  );

  useEffect(() => {
    if (statuses.length > 0) {
      const initialExpanded = Object.fromEntries(
        statuses.map(status => [status._id, true])
      );
      setExpandedGroups(initialExpanded);

      const initialTasksByStatus = statuses.reduce((acc, status) => {
        acc[status._id] = tasks.filter(task => task.status?._id === status._id);
        return acc;
      }, {} as Record<string, ITask[]>);
      setTasksByStatus(initialTasksByStatus);
    }
  }, [statuses, tasks]);

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

    createTask(
      {
        data: newTask,
        params: {
          spaceId: list.space as string,
          listId: list._id as string,
        },
      },
      {
        onSuccess: newTask => {
          setTasksByStatus(prev => ({
            ...prev,
            [status._id]: [...(prev[status._id] || []), newTask],
          }));
        },
      }
    );
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      if (destination.index === source.index) {
        return;
      }

      const statusId = source.droppableId;
      const tasksInGroup: ITask[] = Array.from(tasksByStatus[statusId] || []);
      const [movedTask] = tasksInGroup.splice(source.index, 1);
      tasksInGroup.splice(destination.index, 0, movedTask);

      setTasksByStatus(prev => ({
        ...prev,
        [statusId]: tasksInGroup,
      }));

      const orderedTaskIds = tasksInGroup.map(t => t._id);

      reorderTasks({
        listId: list._id as string,
        orderedTaskIds: orderedTaskIds,
        params: {
          workspaceId: list.workspace as string,
          spaceId: list.space as string,
          listId: list._id as string,
        },
      });
    } else {
      console.log('Moving between groups not implemented in list view yet');
    }
  };

  if (isLoadingStatuses) {
    return <div>Loading statuses...</div>;
  }

  return (
    <div className='flex flex-col h-full text-sm'>
      <div className='flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10'>
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
            <Input
              type='text'
              placeholder='Search...'
              className='h-9 px-3 py-1 rounded-md border border-input bg-background text-sm w-40'
            />
          </div>
          <Button variant='ghost' size='icon' className='h-9 w-9'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className='flex flex-col gap-4  overflow-auto'>
          {statuses.map(status => (
            <div key={status._id} className=' px-4 '>
              <div
                className='flex items-center px-4 py-1.5 cursor-pointer  group'
                onClick={() => toggleGroup(status._id)}
              >
                <ChevronDown
                  className={cn(
                    'h-4 w-4 mr-1 text-gray-400 transition-transform group-hover:text-gray-600',
                    expandedGroups[status._id] ? 'rotate-0' : '-rotate-90'
                  )}
                />

                <div
                  className={cn(
                    'flex items-center gap-2 px-2 py-1 rounded-md',
                    status.type === 'in_progress' && 'bg-indigo-500 text-white',
                    status.type === 'done' && 'bg-green-500 text-white',
                    status.type === 'review' && 'bg-blue-500 text-white',
                    status.type === 'custom' && 'bg-gray-500 text-white',
                    status.type === 'closed' && 'bg-red-500 text-white',
                    status.type === 'open' && 'bg-gray-500 text-white'
                  )}
                >
                  <div>
                    {status.type === 'in_progress' && (
                      <Circle className='h-4 w-4 text-white' />
                    )}
                    {status.type === 'done' && (
                      <CircleCheck className='h-4 w-4 text-white' />
                    )}
                    {status.type === 'review' && (
                      <CircleCheck className='h-4 w-4 text-white  ' />
                    )}
                    {status.type === 'custom' && (
                      <Circle className='h-4 w-4 text-white' />
                    )}
                    {status.type === 'closed' && (
                      <CircleX className='h-4 w-4 text-white' />
                    )}
                    {status.type === 'open' && (
                      <Circle className='h-4 w-4 text-white' />
                    )}
                  </div>
                  <span className='font-medium text-white flex-grow truncate mr-2'>
                    {status.status}
                  </span>
                </div>

                <span className='ml-2 text-gray-500 text-sm'>
                  {tasksByStatus[status._id]?.length || 0}
                </span>
                <Button
                  variant='ghost'
                  size='icon'
                  className='ml-2 h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  onClick={e => {
                    e.stopPropagation();
                    console.log('Status options clicked for:', status._id);
                  }}
                >
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='ml-auto h-8 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  onClick={e => {
                    e.stopPropagation();
                    handleAddTask(status);
                  }}
                >
                  Add Task
                </Button>
              </div>

              {expandedGroups[status._id] && (
                <Droppable droppableId={status._id} type='TASK'>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        'transition-colors',
                        snapshot.isDraggingOver ? 'bg-indigo-50' : 'bg-white'
                      )}
                    >
                      <div className='flex items-center px-4 py-2 text-sm text-gray-500 border-t border-gray-200 bg-white'>
                        <div className='flex-1'>Name</div>
                        <div className='w-[200px] flex-shrink-0'>Assignee</div>
                        <div className='w-[120px] flex-shrink-0'>Due date</div>
                        <div className='w-[100px] flex-shrink-0'>Priority</div>
                        <div className='w-[40px] flex justify-end flex-shrink-0'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                          >
                            <Plus className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>

                      {(tasksByStatus[status._id] || []).map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(providedDraggable, snapshotDraggable) => (
                            <div
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              {...providedDraggable.dragHandleProps}
                              style={providedDraggable.draggableProps.style}
                              className={cn(
                                'border-t border-gray-200',
                                snapshotDraggable.isDragging
                                  ? 'bg-indigo-100 shadow-md'
                                  : ''
                              )}
                            >
                              <TaskRow
                                task={task}
                                onClick={() => openTaskModal(task._id)}
                                className='flex items-center px-4'
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <div className='px-4 py-1.5 border-t border-gray-200'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-7 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          onClick={() => handleAddTask(status)}
                        >
                          <Plus className='h-4 w-4 mr-1' />
                          Add Task
                        </Button>
                      </div>
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          ))}

          <div className='px-4 py-2 border-t border-gray-200'>
            <Button
              variant='ghost'
              size='sm'
              className='h-7 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              onClick={() => console.log('New Status clicked')}
            >
              <Plus className='h-4 w-4 mr-1' />
              New Status
            </Button>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};
