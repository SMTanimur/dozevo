'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, MoreHorizontal } from 'lucide-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { ITask, IStatusDefinition, StatusType } from '@/types'; // Assuming IList might be needed for context
import { useGetTasks, useTaskMutations } from '@/hooks/task';
import { useGetStatuses } from '@/hooks/list';
import TaskCard from './task-card'; // Import TaskCard
import { TCreateTask } from '@/validations';
import { cn } from '@/lib';
import { Input } from '@/components/ui/input'; // Added Input import
import { Switch } from '@/components/ui/switch'; // Added Switch import
import { Label } from '@/components/ui/label'; // Added Label import

// Assume workspaceId, spaceId, and listId are passed as props or derived from context
interface TaskBoardViewProps {
  workspaceId: string;
  spaceId: string;
  listId: string;
}

// Define type for the local state
type TasksByStatusMap = Record<string, ITask[]>;

export default function TaskBoardView({
  workspaceId,
  spaceId,
  listId,
}: TaskBoardViewProps) {
  // Removed unused openTaskModal
  // const { openTaskModal } = useGlobalStateStore();

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const filtersApplied = searchTerm !== '' || showArchived;

  // Fetch tasks and statuses
  const { data: tasksResponse, isLoading: isLoadingTasks } = useGetTasks({
    listId: listId,
    spaceId: spaceId,
    filters: {
      search: searchTerm,
      archived: showArchived,
    },
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tasks = tasksResponse?.data || [];

  const { data: statuses = [], isLoading: isLoadingStatuses } = useGetStatuses({
    workspaceId,
    spaceId,
    listId,
  });
  const { updateTask, createTask, reorderTasks } = useTaskMutations();

  // Local state for tasks grouped by status
  const [localTasksByStatus, setLocalTasksByStatus] =
    useState<TasksByStatusMap>({});

  // Effect to initialize and sync local state with fetched data
  useEffect(() => {
    if (tasks && statuses.length > 0) {
      const newTasksByStatus = statuses.reduce((acc, status) => {
        const statusId = status._id as string;
        acc[statusId] = tasks.filter(task => task.status?._id === statusId);
        return acc;
      }, {} as TasksByStatusMap);
      setLocalTasksByStatus(newTasksByStatus);
    }
  }, [tasks, statuses]); // Depend on tasks and statuses

  const handleAddTask = (status: IStatusDefinition) => {
    const newTask: TCreateTask = {
      name: 'New Task',
      status: status._id as string,
      listId: listId,
    };
    // Note: Creating tasks might require refreshing local state too, or relying on invalidation
    createTask({
      data: newTask,
      params: { spaceId, listId },
    });
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // 1. Basic validation and exit conditions
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Find the globally sourced task (from original 'tasks' array for correct data)
    const taskToMove = tasks.find(t => t._id === draggableId);
    if (!taskToMove) {
      console.error('Draggable task not found in original tasks array');
      return;
    }

    const sourceStatusId = source.droppableId;
    const destinationStatusId = destination.droppableId;
    const destinationIndex = destination.index;

    // 2. Prepare data for local state update (using simplified type for mutation)
    let finalTasksByStatus: TasksByStatusMap | null = null;
    setLocalTasksByStatus(currentTasksByStatus => {
      const sourceColumn = [...(currentTasksByStatus[sourceStatusId] || [])];
      const destinationColumn =
        sourceStatusId === destinationStatusId
          ? sourceColumn
          : [...(currentTasksByStatus[destinationStatusId] || [])];

      const taskIndexInSource = sourceColumn.findIndex(
        t => t._id === draggableId
      );
      if (taskIndexInSource === -1) {
        console.error('Task not found in local source column for removal');
        return currentTasksByStatus;
      }
      const [removedTaskLocally] = sourceColumn.splice(taskIndexInSource, 1);

      const taskForInsertion = { ...removedTaskLocally };

      // Handle status change if columns differ
      if (sourceStatusId !== destinationStatusId) {
        const newStatus = statuses.find(s => s._id === destinationStatusId);
        if (!newStatus) {
          console.error('Destination status not found');
          return currentTasksByStatus;
        }
        taskForInsertion.status = newStatus; // Update status for insertion
        // We still need to update the individual task's status if it moves column
        updateTask({
          taskId: taskToMove._id,
          data: { status: newStatus._id as string }, // Only update status
          params: { workspaceId, spaceId, listId },
        });
      }

      // Insert the task into the destination column at the correct index
      destinationColumn.splice(destinationIndex, 0, taskForInsertion);

      // Create the final state map
      finalTasksByStatus = {
        ...currentTasksByStatus,
        [sourceStatusId]: sourceColumn,
        [destinationStatusId]: destinationColumn,
      };
      return finalTasksByStatus; // Return the new state
    });

    // 3. Trigger the backend mutation if local state update was successful
    if (finalTasksByStatus) {
      // Get the final ordered list of task IDs from the updated state
      const destinationTasks: ITask[] =
        finalTasksByStatus[destinationStatusId] || [];
      const orderedTaskIds = destinationTasks.map(task => task._id);

      // Call the bulk reorder mutation
      reorderTasks({
        listId: listId, // Assuming tasks in board view belong to the main listId prop
        orderedTaskIds: orderedTaskIds,
        params: { workspaceId, spaceId, listId }, // Pass context for invalidation
      });

      // If the task moved between columns, we also need to reorder the source column
      if (sourceStatusId !== destinationStatusId) {
        const sourceTasks: ITask[] = finalTasksByStatus[sourceStatusId] || [];
        const sourceOrderedTaskIds = sourceTasks.map(task => task._id);
        reorderTasks({
          listId: listId,
          orderedTaskIds: sourceOrderedTaskIds,
          params: { workspaceId, spaceId, listId },
        });
      }
    } else {
      console.error('Local state update failed, mutation skipped.');
    }
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
            variant={filtersApplied ? 'secondary' : 'outline'}
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
          <div className='flex items-center space-x-2'>
            <Switch
              id='archived-tasks-board'
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
            <Label htmlFor='archived-tasks-board'>Archived</Label>
          </div>
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
              placeholder='Search tasks...'
              className='h-9 px-3 py-1 rounded-md border border-input bg-background text-sm'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant='ghost' size='icon' className='h-9 w-9'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='flex-1 overflow-auto p-4'>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className='flex items-start gap-4 h-full'>
            {statuses.map(status => (
              <Droppable key={status._id} droppableId={status._id as string}>
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'min-w-[300px] max-w-[350px] flex flex-col  rounded-lg',
                      status.type === StatusType.DONE && 'bg-green-100',
                      status.type === StatusType.IN_PROGRESS && 'bg-blue-100',
                      status.type === StatusType.OPEN && 'bg-gray-100',
                      status.type === StatusType.CLOSED && 'bg-red-100',
                      status.type === StatusType.REVIEW && 'bg-yellow-100'
                    )}
                  >
                    <div className='flex items-center justify-between p-3 border-b bg-white rounded-lg'>
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
                          {localTasksByStatus[status._id as string]?.length ||
                            0}
                        </span>
                      </div>
                      <div className='flex items-center'>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>

                    <div className='flex-1 overflow-auto p-2 space-y-2'>
                      {(localTasksByStatus[status._id as string] || []).map(
                        (task, index) => (
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
                                  mutationParams={{
                                    workspaceId,
                                    spaceId,
                                    listId,
                                  }}
                                />
                              </div>
                            )}
                          </Draggable>
                        )
                      )}
                      {provided.placeholder}
                    </div>

                    <div className='p-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='w-full justify-start text-gray-500'
                        onClick={() =>
                          handleAddTask(status as IStatusDefinition)
                        }
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
