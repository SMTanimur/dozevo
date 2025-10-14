'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import TaskCard from './task-card';
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

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { destination, source, draggableId } = result;

      // Basic validation
      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      const sourceStatusId = source.droppableId;
      const destinationStatusId = destination.droppableId;

      // Store the updated state to use for reordering
      let updatedState: TasksByStatusMap = {};

      // Optimistically update UI
      setLocalTasksByStatus(prev => {
        const newState = { ...prev };
        const sourceColumn = [...(prev[sourceStatusId] || [])];
        const destColumn =
          sourceStatusId === destinationStatusId
            ? sourceColumn
            : [...(prev[destinationStatusId] || [])];

        // Find and remove task from source
        const taskIndex = sourceColumn.findIndex(t => t._id === draggableId);
        if (taskIndex === -1) return prev;

        const [movedTask] = sourceColumn.splice(taskIndex, 1);

        // Update task status if changing columns
        if (sourceStatusId !== destinationStatusId) {
          const newStatus = statuses.find(s => s._id === destinationStatusId);
          if (newStatus) {
            movedTask.status = newStatus;
          }
        }

        // Insert into destination
        destColumn.splice(destination.index, 0, movedTask);

        newState[sourceStatusId] = sourceColumn;
        newState[destinationStatusId] = destColumn;

        // Store the updated state for reordering
        updatedState = newState;

        return newState;
      });

      try {
        // Update backend
        if (sourceStatusId !== destinationStatusId) {
          await updateTask({
            taskId: draggableId,
            data: { status: destinationStatusId },
            params: { workspaceId, spaceId, listId },
          });
        }

        // Reorder in destination column using the captured state
        const destColumn = updatedState[destinationStatusId] || [];
        if (destColumn.length > 0) {
          await reorderTasks({
            listId: listId,
            orderedTaskIds: destColumn.map(t => t._id),
            params: { workspaceId, spaceId, listId },
          });
        }

        // Also reorder source column if different
        if (sourceStatusId !== destinationStatusId) {
          const sourceColumn = updatedState[sourceStatusId] || [];
          if (sourceColumn.length > 0) {
            await reorderTasks({
              listId: listId,
              orderedTaskIds: sourceColumn.map(t => t._id),
              params: { workspaceId, spaceId, listId },
            });
          }
        }
      } catch (error) {
        console.error('Failed to update task:', error);
        // Revert on error
        const revertedState = statuses.reduce((acc, status) => {
          acc[status._id as string] = tasks.filter(
            task => task.status?._id === status._id
          );
          return acc;
        }, {} as TasksByStatusMap);
        setLocalTasksByStatus(revertedState);
      }
    },
    [statuses, tasks, updateTask, reorderTasks, workspaceId, spaceId, listId]
  );

  if (isLoadingTasks || isLoadingStatuses) {
    return (
      <div className='flex items-center justify-center h-64'>
        <motion.div
          className='flex flex-col items-center gap-3'
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full'
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span className='text-sm font-medium text-slate-600 dark:text-slate-400'>
            Loading board...
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl'
      >
        <div className='flex items-center gap-3'>
          <motion.div
            className='p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30'
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Sparkles className='h-4 w-4 text-white' />
          </motion.div>
          <div className='flex items-center gap-2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-2 h-9 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  >
                    <span className='text-sm font-medium'>Status</span>
                    <ChevronDown className='h-3.5 w-3.5' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Group by status</TooltipContent>
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
                      'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  )}
                >
                  <Filter className='h-3.5 w-3.5' />
                  <span className='text-sm font-medium'>Filter</span>
                  {filtersApplied && (
                    <span className='ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded'>
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
                  className='flex items-center gap-2 h-9 rounded-lg border-slate-200 dark:border-slate-700'
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
                  className='flex items-center gap-2 h-9 rounded-lg border-slate-200 dark:border-slate-700'
                >
                  <User className='h-3.5 w-3.5' />
                  <span className='text-sm font-medium'>Assignee</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filter by assignee</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className='flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'>
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
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400' />
            <Input
              type='text'
              placeholder='Search tasks...'
              className='h-9 pl-9 pr-3 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm w-[200px] focus:w-[240px] transition-all'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <Button
            variant='ghost'
            size='icon'
            className='h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800'
          >
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </div>
      </motion.div>

      {/* Board Content */}
      <div className='flex-1 overflow-auto p-6'>
        <DragDropContext onDragEnd={handleDragEnd}>
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
                          'flex flex-col h-full rounded-2xl border transition-all duration-300',
                          snapshot.isDraggingOver
                            ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/10 shadow-lg shadow-blue-500/20'
                            : 'border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm',
                          'hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50'
                        )}
                      >
                        {/* Column Header */}
                        <div className='flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50'>
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
                            <span className='font-semibold text-slate-700 dark:text-slate-300'>
                              {status.status}
                            </span>
                            <motion.span
                              className='ml-auto px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
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
                            className='h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800'
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
                                    {...provided.dragHandleProps}
                                    style={{
                                      ...provided.draggableProps.style,
                                      transform: snapshot.isDragging
                                        ? `${provided.draggableProps.style?.transform} rotate(3deg)`
                                        : provided.draggableProps.style
                                            ?.transform,
                                    }}
                                    className={cn(
                                      'transition-all duration-200',
                                      snapshot.isDragging &&
                                        'shadow-2xl shadow-blue-500/50 scale-105 opacity-95'
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        snapshot.isDragging &&
                                          'bg-white dark:bg-slate-800 rounded-xl ring-2 ring-blue-400 dark:ring-blue-500'
                                      )}
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
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </AnimatePresence>
                          {provided.placeholder}
                        </div>

                        {/* Add Task Button */}
                        <div className='p-3 border-t border-slate-200/50 dark:border-slate-700/50'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='w-full justify-start text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg'
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
                className='w-full h-12 justify-start rounded-xl border-dashed border-2 border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all'
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
