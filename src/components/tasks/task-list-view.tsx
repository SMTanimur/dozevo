'use client';

import { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, MoreHorizontal } from 'lucide-react';

import { TaskRow } from '@/components/tasks/task-row';
import { IList, IStatusDefinition, ITask } from '@/types';
import { useGetStatuses } from '@/hooks/list';
import { useTaskMutations } from '@/hooks/task';
import { useGlobalStateStore } from '@/stores';
import { TCreateTask } from '@/validations';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { TaskSkeleton } from '@/components';

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
  const [tasksByStatus, setTasksByStatus] = useState<Record<string, ITask[]>>(
    {}
  );

  useEffect(() => {
    if (statuses.length > 0) {
      const initialTasksByStatus = statuses.reduce((acc, status) => {
        acc[status._id] = tasks.filter(task => task.status?._id === status._id);
        return acc;
      }, {} as Record<string, ITask[]>);
      setTasksByStatus(initialTasksByStatus);
    }
  }, [statuses, tasks]);

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
    return <TaskSkeleton />;
  }

  return (
    <div className='flex flex-col h-full text-sm bg-gray-50 '>
      <div className='flex items-center justify-between p-4 m-4 border-b sticky top-0 bg-white z-10 rounded-t-2xl shadow-sm'>
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

      <ScrollArea className='h-[calc(100vh-17rem)]'>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className='flex flex-col gap-8 m-4 mt-4 pb-4'>
            {statuses.map(status => (
              <div
                key={status._id}
                className='bg-white rounded-2xl shadow-md border border-gray-100 p-0'
              >
                <div className='flex items-center justify-between px-6 py-4 border-b rounded-t-2xl bg-gradient-to-r from-gray-50 to-white'>
                  <div className='flex items-center gap-2'>
                    <span
                      className='rounded px-3 py-1 text-xs font-bold'
                      style={{ background: status.color, color: '#fff' }}
                    >
                      {status.status}
                    </span>
                    <span className='text-gray-400 text-xs'>
                      {tasksByStatus[status._id]?.length || 0} tasks
                    </span>
                  </div>
                  <Button
                    className='rounded-full bg-primary text-white shadow hover:bg-primary-dark transition'
                    onClick={() => handleAddTask(status)}
                  >
                    + Add Task
                  </Button>
                </div>
                <Droppable droppableId={status._id} type='TASK'>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        'transition-colors',
                        snapshot.isDraggingOver ? 'bg-indigo-50' : 'bg-white',
                        'rounded-b-2xl'
                      )}
                    >
                      <div className='grid grid-cols-[minmax(0,1fr)_200px_120px_100px] items-center px-6 py-2 text-xs text-gray-500 border-b bg-white rounded-t-2xl'>
                        <div>Name</div>
                        <div>Assignee</div>
                        <div>Due date</div>
                        <div>Priority</div>
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
                                'border-b border-gray-100 bg-white hover:bg-gray-50 transition group',
                                snapshotDraggable.isDragging
                                  ? 'bg-indigo-100 shadow-md'
                                  : ''
                              )}
                            >
                              <TaskRow
                                task={task}
                                onClick={() => openTaskModal(task._id)}
                                className='group py-2 hover:bg-gray-50 cursor-pointer relative grid grid-cols-[minmax(0,1fr)_200px_120px_100px] items-center px-6'
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <div className='px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-7 px-2 text-primary font-semibold hover:text-primary-dark hover:bg-primary/10 rounded-lg transition'
                          onClick={() => handleAddTask(status)}
                        >
                          <Plus className='h-4 w-4 mr-1' />
                          Add Task
                        </Button>
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </ScrollArea>
    </div>
  );
};
