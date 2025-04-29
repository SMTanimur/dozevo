'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, MoreHorizontal } from 'lucide-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { ITask, IStatusDefinition } from '@/types'; // Assuming IList might be needed for context
import { useGetTasks, useTaskMutations } from '@/hooks/task';
import { useGetStatuses } from '@/hooks/list';
import { useGlobalStateStore } from '@/stores';
import TaskCard from './task-card'; // Import TaskCard
import { TCreateTask } from '@/validations';

// Assume workspaceId, spaceId, and listId are passed as props or derived from context
interface TaskBoardViewProps {
  workspaceId: string;
  spaceId: string;
  listId: string;
}

export default function TaskBoardView({
  workspaceId,
  spaceId,
  listId,
}: TaskBoardViewProps) {
  const { openTaskModal } = useGlobalStateStore();

  // Fetch tasks and statuses
  const { data, isLoading: isLoadingTasks } = useGetTasks({
    listId: listId,
    spaceId: spaceId,
  });


  const { data: statuses = [], isLoading: isLoadingStatuses } = useGetStatuses({
    workspaceId,
    spaceId,
    listId,
  });
  const { updateTask, createTask } = useTaskMutations();

  const handleAddTask = (status: IStatusDefinition) => {
    const newTask: TCreateTask = {
      name: 'New Task',
      status: status._id as string, // Pass status ID
      listId: listId,
    };
    createTask({
      data: newTask,
      params: { spaceId, listId },
    });
  };
  // Group tasks by status ID
  const tasksByStatus = statuses.reduce(
    (acc, status) => { // Let TS infer types from initial value and statuses array
      // Assuming status._id will always be defined here based on context,
      // but added optional chaining for safety if needed in the future.
      // Type inference should resolve the overload mismatch.
      acc[status._id as string] = data?.data?.filter(task => task.status?._id === status._id) || [];
      return acc;
    },
    {} as Record<string, ITask[]>
  );

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const task = data?.data?.find(t => t._id === draggableId);
    if (!task) return;

    const newStatus = statuses.find(s => s._id === destination.droppableId);
    if (!newStatus) return;

    // Update the task with the new status ID
    updateTask({
      taskId: task._id,
      data: { status: newStatus._id },
    });
  };

  if (isLoadingTasks || isLoadingStatuses) {
    return <div>Loading board...</div>; // Or a spinner
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

      <div className='flex-1 overflow-auto p-4'>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className='flex gap-4 h-full'>
            {statuses.map(status => (
              <Droppable key={status._id} droppableId={status._id as string}>
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className='flex-1 min-w-[300px] max-w-[350px] flex flex-col bg-gray-50 rounded-md'
                  >
                    <div className='flex items-center justify-between p-3 border-b bg-white rounded-t-md'>
                      <div className='flex items-center'>
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
                          {tasksByStatus[status._id as string]?.length || 0}
                        </span>
                      </div>
                      <div className='flex items-center'>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>

                    <div className='flex-1 overflow-auto p-2 space-y-2'>
                      {(tasksByStatus[status._id as string] || []).map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.8 : 1,
                              }}
                            >
                              <TaskCard
                                task={task}
                                onClick={() => openTaskModal(task._id)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>

                    <div className='p-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='w-full justify-start text-gray-500'
                        onClick={() => handleAddTask(status as IStatusDefinition)}
                      >
                        <Plus className='h-4 w-4 mr-1' />
                        Add Task
                      </Button>
                    </div>
                  </div>
                )}
              </Droppable>
            ))}

            <div className='flex-shrink-0 w-[200px]'>
              <Button
                variant='outline'
                size='sm'
                className='w-full justify-start'
              >
                <Plus className='h-4 w-4 mr-1' />
                Add group
              </Button>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
