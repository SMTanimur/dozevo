'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Search,
  Filter,
  ArrowUpDown,
  User,
  List,
} from 'lucide-react';

import { TaskRow } from '@/components/tasks/task-row';
import { IList, ITask } from '@/types';
import { useGetStatuses } from '@/hooks/list';
import { useTaskMutations } from '@/hooks/task';
import { useGlobalStateStore } from '@/stores';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TaskListViewProps = {
  list: IList;
  tasks: ITask[];
};
export const TaskListView = ({ list, tasks }: TaskListViewProps) => {
  const { openTaskModal } = useGlobalStateStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedStatusIds, setSelectedStatusIds] = useState<string[]>([]);

  const { data: statuses = [], isLoading: isLoadingStatuses } = useGetStatuses({
    workspaceId: list?.workspace as string,
    spaceId: list?.space as string,
    listId: list?._id as string,
  });

  const { reorderTasks, updateTask } = useTaskMutations();
  const [tasksByStatus, setTasksByStatus] = useState<Record<string, ITask[]>>(
    {}
  );

  // Use useMemo to prevent recalculation on every render
  const filtersApplied = useMemo(() => {
    return searchTerm !== '' || showArchived || selectedStatusIds.length > 0;
  }, [searchTerm, showArchived, selectedStatusIds]);

  // Use useMemo to prevent recalculation on every render
  const filteredTasks = useMemo(() => {
    console.log('filteredTasks useMemo recalculating', {
      tasksLength: tasks.length,
      searchTerm,
      showArchived,
      selectedStatusIdsLength: selectedStatusIds.length,
    });

    return tasks.filter(task => {
      const matchesSearch =
        !searchTerm ||
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArchived = showArchived ? true : !task.archived;
      const matchesStatus =
        selectedStatusIds.length === 0 ||
        (task.status && selectedStatusIds.includes(task.status._id));
      return matchesSearch && matchesArchived && matchesStatus;
    });
  }, [tasks, searchTerm, showArchived, selectedStatusIds]);

  // Memoize the onCheckedChange callback
  const handleShowArchivedChange = useCallback((checked: boolean) => {
    setShowArchived(checked);
  }, []);

  // Memoize the search term change callback
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  // Memoize the status selection callback
  const handleStatusChange = useCallback(
    (statusId: string, checked: boolean) => {
      setSelectedStatusIds(prev =>
        checked ? [...prev, statusId] : prev.filter(id => id !== statusId)
      );
    },
    []
  );

  useEffect(() => {
    console.log('TaskListView useEffect triggered', {
      statusesLength: statuses.length,
      filteredTasksLength: filteredTasks.length,
      tasksByStatusKeys: Object.keys(tasksByStatus).length,
    });

    if (statuses.length > 0 && filteredTasks) {
      const initialTasksByStatus = statuses.reduce((acc, status) => {
        acc[status._id] = filteredTasks.filter(
          task => task.status?._id === status._id
        );
        return acc;
      }, {} as Record<string, ITask[]>);

      // Only update if the data has actually changed
      setTasksByStatus(prev => {
        const prevKeys = Object.keys(prev);
        const newKeys = Object.keys(initialTasksByStatus);

        if (prevKeys.length !== newKeys.length) {
          console.log('TasksByStatus updated: different number of keys');
          return initialTasksByStatus;
        }

        for (const key of newKeys) {
          if (prev[key]?.length !== initialTasksByStatus[key]?.length) {
            console.log('TasksByStatus updated: different task counts');
            return initialTasksByStatus;
          }
        }

        console.log('TasksByStatus unchanged: no update needed');
        return prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statuses, filteredTasks]);

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
      const destStatusId = destination.droppableId;

      // Store updated state
      let updatedSourceTasks: ITask[] = [];
      let updatedDestTasks: ITask[] = [];

      // Optimistically update UI
      setTasksByStatus(prev => {
        const sourceTasks = Array.from(prev[sourceStatusId] || []);
        const destTasks =
          sourceStatusId === destStatusId
            ? sourceTasks
            : Array.from(prev[destStatusId] || []);

        const taskIndex = sourceTasks.findIndex(t => t._id === draggableId);
        if (taskIndex === -1) return prev;

        const [movedTask] = sourceTasks.splice(taskIndex, 1);

        // Update status if changing columns
        if (sourceStatusId !== destStatusId) {
          const newStatus = statuses.find(s => s._id === destStatusId);
          if (newStatus) {
            movedTask.status = newStatus;
          }
        }

        destTasks.splice(destination.index, 0, movedTask);

        // Store for backend update
        updatedSourceTasks = sourceTasks;
        updatedDestTasks = destTasks;

        return {
          ...prev,
          [sourceStatusId]: sourceTasks,
          [destStatusId]: destTasks,
        };
      });

      try {
        // Update status if changed
        if (sourceStatusId !== destStatusId) {
          await updateTask({
            taskId: draggableId,
            data: { status: destStatusId },
            params: {
              workspaceId: list.workspace as string,
              spaceId: list.space as string,
              listId: list._id as string,
            },
          });
        }

        // Reorder destination column
        if (updatedDestTasks.length > 0) {
          await reorderTasks({
            listId: list._id as string,
            orderedTaskIds: updatedDestTasks.map(t => t._id),
            params: {
              workspaceId: list.workspace as string,
              spaceId: list.space as string,
              listId: list._id as string,
            },
          });
        }

        // Reorder source column if different
        if (sourceStatusId !== destStatusId && updatedSourceTasks.length > 0) {
          await reorderTasks({
            listId: list._id as string,
            orderedTaskIds: updatedSourceTasks.map(t => t._id),
            params: {
              workspaceId: list.workspace as string,
              spaceId: list.space as string,
              listId: list._id as string,
            },
          });
        }
      } catch (error) {
        console.error('Failed to update task:', error);
        // Revert on error
        const revertedState = statuses.reduce((acc, status) => {
          acc[status._id] = tasks.filter(
            task => task.status?._id === status._id
          );
          return acc;
        }, {} as Record<string, ITask[]>);
        setTasksByStatus(revertedState);
      }
    },
    [statuses, tasks, updateTask, reorderTasks, list]
  );

  if (isLoadingStatuses) {
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
            Loading tasks...
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
        className='flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-10'
      >
        <div className='flex items-center gap-3'>
          <motion.div
            className='p-2 rounded-xl bg-primary shadow-lg shadow-primary/30'
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <List className='h-4 w-4 text-primary-foreground' />
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
                    className='flex items-center gap-2 h-9 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  >
                    <span className='text-sm font-medium'>Subtasks</span>
                    <ChevronDown className='h-3.5 w-3.5' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Show/hide subtasks</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-2 h-9 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  >
                    <span className='text-sm font-medium'>Columns</span>
                    <ChevronDown className='h-3.5 w-3.5' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Customize columns</TooltipContent>
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
                      {selectedStatusIds.length + (showArchived ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filter tasks</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex items-center gap-2 h-9 rounded-lg border-slate-200 dark:border-slate-700'
                    >
                      <span className='text-sm font-medium'>Status</span>
                      {selectedStatusIds.length > 0 && (
                        <span className='px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded'>
                          {selectedStatusIds.length}
                        </span>
                      )}
                      <ChevronDown className='h-3.5 w-3.5' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Filter by status</TooltipContent>
                </Tooltip>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statuses.map(status => (
                  <DropdownMenuCheckboxItem
                    key={status._id}
                    checked={selectedStatusIds.includes(status._id)}
                    onCheckedChange={checked => {
                      handleStatusChange(status._id, checked);
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-2.5 h-2.5 rounded-full'
                        style={{ backgroundColor: status.color }}
                      />
                      {status.status}
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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

          <div className='flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background'>
            <Switch
              id='archived-tasks-list'
              checked={showArchived}
              onCheckedChange={handleShowArchivedChange}
            />
            <Label
              htmlFor='archived-tasks-list'
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
              onChange={handleSearchChange}
            />
          </div>

          <Button variant='ghost' size='icon' className='h-9 w-9 rounded-lg'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </div>
      </motion.div>

      {/* Task List Content */}
      <ScrollArea className='flex-1 p-6'>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className='flex flex-col gap-6 max-w-[1800px] mx-auto'>
            <AnimatePresence>
              {statuses.map((status, statusIndex) => (
                <motion.div
                  key={status._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: statusIndex * 0.1 }}
                  className='bg-card rounded-2xl border border-border shadow-xl shadow-primary/5 overflow-hidden'
                >
                  {/* Status Header */}
                  <div className='flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30'>
                    <div className='flex items-center gap-3'>
                      <motion.div
                        className='w-2.5 h-2.5 rounded-full shadow-lg'
                        style={{
                          backgroundColor: status.color,
                          boxShadow: `0 0 12px ${status.color}40`,
                        }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                      <span className='text-base font-bold text-foreground'>
                        {status.status}
                      </span>
                      <motion.span
                        className='px-2.5 py-0.5 text-xs font-bold rounded-full bg-muted text-muted-foreground'
                        key={tasksByStatus[status._id]?.length || 0}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                      >
                        {tasksByStatus[status._id]?.length || 0}
                      </motion.span>
                    </div>
                    <Button
                      size='sm'
                      className='rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl transition-all'
                    >
                      <Plus className='h-4 w-4 mr-1' />
                      Add Task
                    </Button>
                  </div>

                  <Droppable droppableId={status._id} type='TASK'>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          'transition-all duration-300',
                          snapshot.isDraggingOver
                            ? 'bg-primary/10 ring-2 ring-primary/30'
                            : 'bg-card'
                        )}
                      >
                        {/* Table Header */}
                        <div className='grid grid-cols-[minmax(0,1fr)_200px_120px_100px] items-center px-6 py-3 text-xs font-semibold text-muted-foreground border-b border-border bg-muted/30'>
                          <div>Task Name</div>
                          <div>Assignee</div>
                          <div>Due Date</div>
                          <div>Priority</div>
                        </div>

                        {/* Tasks */}
                        {(tasksByStatus[status._id] || []).map(
                          (task, index) => (
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
                                  style={{
                                    ...providedDraggable.draggableProps.style,
                                    transform: snapshotDraggable.isDragging
                                      ? `${providedDraggable.draggableProps.style?.transform} rotate(1deg)`
                                      : providedDraggable.draggableProps.style
                                          ?.transform,
                                  }}
                                  className={cn(
                                    'border-b border-border transition-all duration-200',
                                    snapshotDraggable.isDragging
                                      ? 'bg-card shadow-2xl shadow-primary/50 ring-4 ring-primary rounded-xl scale-105 opacity-100 z-50'
                                      : 'bg-card hover:bg-accent/50'
                                  )}
                                >
                                  <TaskRow
                                    task={task}
                                    onClick={() => openTaskModal(task._id)}
                                    className='group py-3 cursor-pointer relative grid grid-cols-[minmax(0,1fr)_200px_120px_100px] items-center px-6'
                                  />
                                </div>
                              )}
                            </Draggable>
                          )
                        )}
                        {provided.placeholder}

                        {/* Add Task Footer */}
                        {(tasksByStatus[status._id] || []).length === 0 && (
                          <div className='px-6 py-12 text-center'>
                            <p className='text-sm text-muted-foreground mb-3'>
                              No tasks in this status
                            </p>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-primary hover:bg-primary/10'
                            >
                              <Plus className='h-4 w-4 mr-1' />
                              Add your first task
                            </Button>
                          </div>
                        )}

                        <div className='px-6 py-3 border-t border-border bg-muted/30'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 px-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium'
                          >
                            <Plus className='h-4 w-4 mr-1' />
                            Add Task
                          </Button>
                        </div>
                      </div>
                    )}
                  </Droppable>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </DragDropContext>
      </ScrollArea>
    </div>
  );
};
