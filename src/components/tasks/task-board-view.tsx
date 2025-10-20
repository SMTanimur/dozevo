'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  Plus,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpDown,
  User,
  Sparkles,
  GripVertical,
} from 'lucide-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { ITask, IStatusDefinition } from '@/types';
import { useGetTasks, useTaskMutations } from '@/hooks/task';
import { useGetStatuses } from '@/hooks/list';
import TaskCard from './task-card'; // Import TaskCard
import { TCreateTask } from '@/validations';
import { cn } from '@/lib';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  }, [tasks, statuses]);

  const handleAddTask = async (status: IStatusDefinition) => {
    const newTask: TCreateTask = {
      name: 'New Task',
      status: status._id as string,
      listId: listId,
    };

    try {
      await createTask({
        data: newTask,
        params: { spaceId, listId },
      });
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleDragStart = (result: { draggableId: string }) => {
    console.log('Drag started:', result.draggableId);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // 1. Basic validation and exit conditions
    if (!destination) {
      // If dropped outside a valid drop zone, do nothing
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      // If dropped in the same position, do nothing
      return;
    }

    // Find the globally sourced task (from original 'tasks' array for correct data)
    const taskToMove = tasks.find(t => t._id === draggableId);
    if (!taskToMove) {
      console.error('Draggable task not found in original tasks array');
      return;
    }

    console.log('Drag operation:', {
      taskId: draggableId,
      from: source.droppableId,
      to: destination.droppableId,
      fromIndex: source.index,
      toIndex: destination.index,
    });

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
        return currentTasksByStatus;
      }
      const [removedTaskLocally] = sourceColumn.splice(taskIndexInSource, 1);

      const taskForInsertion = { ...removedTaskLocally };

      // Handle status change if columns differ
      if (sourceStatusId !== destinationStatusId) {
        const newStatus = statuses.find(s => s._id === destinationStatusId);
        if (!newStatus) {
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

    try {
      // Update status if column changed
      if (sourceStatusId !== destinationStatusId) {
        const newStatus = statuses.find(s => s._id === destinationStatusId);
        if (newStatus) {
          console.log('Updating task status:', {
            taskId: taskToMove._id,
            newStatus: newStatus._id,
          });

          await Promise.race([
            updateTask({
              taskId: taskToMove._id,
              data: { status: newStatus._id as string },
              params: { workspaceId, spaceId, listId },
            }),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error('Status update timeout')),
                10000
              )
            ),
          ]);
        }
      }

      // Reorder tasks in destination column
      const destinationTasks = localTasksByStatus[destinationStatusId] || [];
      const orderedTaskIds = destinationTasks.map(task => task._id);

      console.log('Reordering destination column:', {
        destinationStatusId,
        orderedTaskIds,
      });

      await Promise.race([
        reorderTasks({
          listId: listId,
          orderedTaskIds: orderedTaskIds,
          params: { workspaceId, spaceId, listId },
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Reorder timeout')), 10000)
        ),
      ]);

      // If moved between columns, also reorder source column
      if (sourceStatusId !== destinationStatusId) {
        const sourceTasks = localTasksByStatus[sourceStatusId] || [];
        const sourceOrderedTaskIds = sourceTasks.map(task => task._id);

        console.log('Reordering source column:', {
          sourceStatusId,
          sourceOrderedTaskIds,
        });

        await Promise.race([
          reorderTasks({
            listId: listId,
            orderedTaskIds: sourceOrderedTaskIds,
            params: { workspaceId, spaceId, listId },
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Source reorder timeout')), 10000)
          ),
        ]);
      }

      console.log('Drag operation completed successfully');
    } catch (error: unknown) {
      console.error('Failed to update task order:', error);
      console.error('Error details:', {
        taskId: draggableId,
        sourceStatusId,
        destinationStatusId,
        error: error instanceof Error ? error.message : String(error),
      });

      // Revert local state on error
      const newTasksByStatus = statuses.reduce((acc, status) => {
        const statusId = status._id as string;
        acc[statusId] = tasks.filter(task => task.status?._id === statusId);
        return acc;
      }, {} as TasksByStatusMap);
      setLocalTasksByStatus(newTasksByStatus);
    }
  };

  if (isLoadingTasks || isLoadingStatuses) {
    return (
      <div className='flex items-center justify-center h-64'>
        <motion.div
          className='flex flex-col items-center gap-3'
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full'
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span className='text-sm font-medium text-muted-foreground'>
            Loading board...
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full bg-gradient-to-br from-background via-background to-primary/5'>
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-xl'
      >
        <div className='flex items-center gap-3'>
          <motion.div
            className='p-2 rounded-xl bg-primary shadow-lg shadow-primary/30'
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Sparkles className='h-4 w-4 text-primary-foreground' />
          </motion.div>
          <div className='flex items-center gap-2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-2 h-9 rounded-lg'
                  >
                    <span className='text-sm font-medium'>Group: Status</span>
                    <ChevronDown className='h-3.5 w-3.5' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Group by status</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-2 h-9 rounded-lg'
                  >
                    <span className='text-sm font-medium'>Subtasks</span>
                    <ChevronDown className='h-3.5 w-3.5' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Show/hide subtasks</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={filtersApplied ? 'default' : 'outline'}
                  size='sm'
                  className={cn(
                    'flex items-center gap-2 h-9 rounded-lg',
                    filtersApplied &&
                      'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30'
                  )}
                >
                  <Filter className='h-3.5 w-3.5' />
                  <span className='text-sm font-medium'>Filter</span>
                  {filtersApplied && (
                    <span className='ml-1 px-1.5 py-0.5 text-xs bg-primary-foreground/20 rounded'>
                      1
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filter tasks</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-2 h-9 rounded-lg'
                >
                  <ArrowUpDown className='h-3.5 w-3.5' />
                  <span className='text-sm font-medium'>Sort</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sort tasks</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-2 h-9 rounded-lg'
                >
                  <User className='h-3.5 w-3.5' />
                  <span className='text-sm font-medium'>Assignee</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filter by assignee</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className='flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background'>
            <Switch
              id='archived-tasks-board'
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
            <Label
              htmlFor='archived-tasks-board'
              className='text-sm font-medium cursor-pointer'
            >
              Archived
            </Label>
          </div>

          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              type='text'
              placeholder='Search tasks...'
              className='h-9 pl-9 pr-3 rounded-lg text-sm w-[200px] focus:w-[240px] transition-all'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <Button variant='ghost' size='icon' className='h-9 w-9 rounded-lg'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </div>
      </motion.div>

      {/* Board Content */}
      <div className='flex-1 overflow-auto p-6'>
        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className='flex items-start gap-6 h-full min-h-[600px]'>
            <AnimatePresence>
              {statuses.map((status, columnIndex) => (
                <motion.div
                  key={status._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: columnIndex * 0.1 }}
                  className='min-w-[320px] max-w-[360px]'
                >
                  <Droppable
                    droppableId={status._id as string}
                    key={status._id}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          'flex flex-col h-full rounded-2xl border transition-all duration-300 bg-card/80 backdrop-blur-sm',
                          snapshot.isDraggingOver
                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 ring-2 ring-primary/30'
                            : 'border-border shadow-md hover:shadow-xl hover:shadow-primary/10'
                        )}
                      >
                        {/* Column Header */}
                        <div className='flex items-center justify-between p-4 border-b border-border'>
                          <div className='flex items-center gap-3 flex-1'>
                            <motion.div
                              className='w-2.5 h-2.5 rounded-full shadow-lg'
                              style={{
                                backgroundColor: status.color,
                                boxShadow: `0 0 12px ${status.color}40`,
                              }}
                              animate={{
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            />
                            <span className='font-semibold text-foreground'>
                              {status.status}
                            </span>
                            <motion.span
                              className='ml-auto px-2.5 py-0.5 text-xs font-bold rounded-full bg-muted text-muted-foreground'
                              key={
                                localTasksByStatus[status._id as string]
                                  ?.length || 0
                              }
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                            >
                              {localTasksByStatus[status._id as string]
                                ?.length || 0}
                            </motion.span>
                          </div>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 rounded-lg'
                          >
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </div>

                        {/* Tasks Container */}
                        <div className='flex-1 overflow-auto p-3 space-y-3 min-h-[400px]'>
                          <AnimatePresence mode='popLayout'>
                            {(
                              localTasksByStatus[status._id as string] || []
                            ).map((task, index) => (
                              <Draggable
                                key={task._id}
                                draggableId={task._id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    style={{
                                      ...provided.draggableProps.style,
                                      opacity: snapshot.isDragging ? 0.8 : 1,
                                    }}
                                    className={cn(
                                      'group relative transition-all duration-200',
                                      snapshot.isDragging && 'z-50'
                                    )}
                                  >
                                    <div className='flex items-start gap-2'>
                                      {/* Drag Handle */}
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div
                                              {...provided.dragHandleProps}
                                              className={cn(
                                                'flex items-center justify-center w-6 h-6 rounded cursor-grab active:cursor-grabbing',
                                                'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                                                'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                                                snapshot.isDragging &&
                                                  'opacity-100 text-primary'
                                              )}
                                            >
                                              <GripVertical className='h-4 w-4' />
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Drag to reorder</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>

                                      {/* Task Card */}
                                      <div className='flex-1'>
                                        <TaskCard
                                          task={task}
                                          mutationParams={{
                                            workspaceId,
                                            spaceId,
                                            listId,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </AnimatePresence>
                          {provided.placeholder}
                        </div>

                        {/* Add Task Button */}
                        <div className='p-3 border-t border-border'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg'
                            onClick={() =>
                              handleAddTask(status as IStatusDefinition)
                            }
                          >
                            <Plus className='h-4 w-4 mr-2' />
                            <span className='font-medium'>Add Task</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </Droppable>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add Column Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: statuses.length * 0.1 }}
              className='flex-shrink-0 w-[280px]'
            >
              <Button
                variant='outline'
                size='sm'
                className='w-full h-12 justify-start rounded-xl border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all'
              >
                <Plus className='h-4 w-4 mr-2' />
                <span className='font-medium'>Add Status Group</span>
              </Button>
            </motion.div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
