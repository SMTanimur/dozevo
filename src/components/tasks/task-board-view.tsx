'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
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
  Check,
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
import { useCreateStatus, useUpdateStatus, useDeleteStatus } from '@/hooks/list/useStatusMutations';
import { useGetWorkspace } from '@/hooks/workspace';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserAvatar } from '../ui';

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
  const [selectedAssigneeFilter, setSelectedAssigneeFilter] = useState<string | null>(null);

  // State for sorting
  const [sortBy, setSortBy] = useState<'name' | 'due_date' | 'priority' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // State for adding status
  const [isAddStatusOpen, setIsAddStatusOpen] = useState(false);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusColor, setNewStatusColor] = useState('#3b82f6'); // default blue
  const [assigneeSearch, setAssigneeSearch] = useState('');

  const filtersApplied = searchTerm !== '' || showArchived || selectedAssigneeFilter !== null || sortBy !== null;

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

  const { data: workspace } = useGetWorkspace(workspaceId, {
    enabled: !!workspaceId,
  });

  const { mutateAsync: createStatusAsync } = useCreateStatus();
  const { mutateAsync: updateStatusAsync } = useUpdateStatus();
  const { mutateAsync: deleteStatusAsync } = useDeleteStatus();

  const { updateTask, createTask, reorderTasks } = useTaskMutations();

  // Local state for statuses (for instant drag-and-drop reordering)
  const [localStatuses, setLocalStatuses] = useState<IStatusDefinition[]>([]);

  useEffect(() => {
    if (statuses) {
      setLocalStatuses(statuses);
    }
  }, [statuses]);

  // Local state for tasks grouped by status
  const [localTasksByStatus, setLocalTasksByStatus] =
    useState<TasksByStatusMap>({});

  // Workspace members filtered by search term
  const workspaceMembers = useMemo(() => {
    if (!workspace?.members) return [];
    return workspace.members.filter(m => {
      if (!m?.user) return false;
      const fullName = `${m.user.firstName || ''} ${m.user.lastName || ''}`.toLowerCase();
      return fullName.includes(assigneeSearch.toLowerCase());
    });
  }, [workspace, assigneeSearch]);

  // Effect to initialize, filter, sort, and sync local state with fetched data
  useEffect(() => {
    if (tasks && localStatuses.length > 0) {
      // 1. Filter tasks locally by assignee
      const filteredTasks = tasks.filter(task => {
        if (!selectedAssigneeFilter) return true;
        return task.assignees?.some(a => a._id === selectedAssigneeFilter);
      });

      // 2. Sort tasks locally
      const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (!sortBy) return 0;
        let comparison = 0;
        if (sortBy === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === 'due_date') {
          const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
          const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
          comparison = dateA - dateB;
        } else if (sortBy === 'priority') {
          const getPriorityWeight = (p: string) => {
            if (p === 'low') return 1;
            if (p === 'normal') return 2;
            if (p === 'high') return 3;
            if (p === 'critical') return 4;
            return 0;
          };
          comparison = getPriorityWeight(a.priority) - getPriorityWeight(b.priority);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });

      // 3. Group by status
      const newTasksByStatus = localStatuses.reduce((acc, status) => {
        const statusId = status._id as string;
        acc[statusId] = sortedTasks.filter(task => task.status?._id === statusId);
        return acc;
      }, {} as TasksByStatusMap);
      setLocalTasksByStatus(newTasksByStatus);
    }
  }, [tasks, localStatuses, selectedAssigneeFilter, sortBy, sortOrder]);

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

  const handleCreateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatusName.trim()) return;

    try {
      await createStatusAsync({
        workspaceId,
        spaceId,
        listId,
        data: {
          status: newStatusName.trim(),
          color: newStatusColor,
          listId: listId,
          orderIndex: statuses.length, // satisfies NestJS class-validator DTO
          orderindex: statuses.length, // satisfies Mongoose database schema
          type: 'custom',
        } as any,
      });
      setNewStatusName('');
      setIsAddStatusOpen(false);
    } catch (error) {
      console.error('Failed to create status:', error);
    }
  };

  const handleMoveStatus = async (statusId: string, direction: 'left' | 'right') => {
    const currentIndex = statuses.findIndex(s => s._id === statusId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= statuses.length) return;

    const currentStatus = statuses[currentIndex];
    const targetStatus = statuses[targetIndex];

    const currentOrder = currentStatus.orderindex ?? currentIndex;
    const targetOrder = targetStatus.orderindex ?? targetIndex;

    try {
      await Promise.all([
        updateStatusAsync({
          workspaceId,
          spaceId,
          listId,
          statusId: currentStatus._id as string,
          data: {
            orderIndex: targetOrder,
            orderindex: targetOrder,
          } as any,
        }),
        updateStatusAsync({
          workspaceId,
          spaceId,
          listId,
          statusId: targetStatus._id as string,
          data: {
            orderIndex: currentOrder,
            orderindex: currentOrder,
          } as any,
        }),
      ]);
    } catch (error) {
      console.error('Failed to reorder statuses:', error);
    }
  };

  const handleDeleteStatus = async (statusId: string) => {
    try {
      await deleteStatusAsync({
        workspaceId,
        spaceId,
        listId,
        statusId,
      });
    } catch (error) {
      console.error('Failed to delete status:', error);
    }
  };

  const handleDragStart = (result: { draggableId: string }) => {
    console.log('Drag started:', result.draggableId);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

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

    // Handle column reordering
    if (type === 'COLUMN') {
      const reorderedStatuses = Array.from(localStatuses);
      const [removed] = reorderedStatuses.splice(source.index, 1);
      reorderedStatuses.splice(destination.index, 0, removed);
      setLocalStatuses(reorderedStatuses);

      try {
        await Promise.all(
          reorderedStatuses.map((status, index) =>
            updateStatusAsync({
              workspaceId,
              spaceId,
              listId,
              statusId: status._id as string,
              data: {
                orderIndex: index,
                orderindex: index,
              } as any,
            })
          )
        );
      } catch (error) {
        console.error('Failed to save columns order:', error);
        // revert local state on error
        setLocalStatuses(statuses);
      }
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
            <span className='text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full uppercase tracking-wider'>
              Group: Status
            </span>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <TooltipProvider>
            {/* Sort Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={sortBy ? 'default' : 'outline'}
                  size='sm'
                  className={cn(
                    'flex items-center gap-2 h-9 rounded-lg',
                    sortBy && 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                  )}
                >
                  <ArrowUpDown className='h-3.5 w-3.5' />
                  <span className='text-sm font-medium'>
                    {sortBy ? `Sort: ${sortBy === 'due_date' ? 'Due Date' : sortBy === 'priority' ? 'Priority' : 'Name'}` : 'Sort'}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-48 p-1 bg-card border border-border shadow-lg rounded-xl overflow-hidden'>
                <div className='p-1.5 text-xs font-semibold text-muted-foreground border-b border-border'>
                  Sort Tasks By
                </div>
                <div className='space-y-1 p-1'>
                  {[
                    { id: 'name', label: 'Task Name' },
                    { id: 'due_date', label: 'Due Date' },
                    { id: 'priority', label: 'Priority Level' },
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => {
                        if (sortBy === option.id) {
                          setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy(option.id as any);
                          setSortOrder('asc');
                        }
                      }}
                      className='w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs font-medium hover:bg-muted transition-colors cursor-pointer text-foreground'
                    >
                      <span>{option.label}</span>
                      {sortBy === option.id && (
                        <span className='text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase'>
                          {sortOrder}
                        </span>
                      )}
                    </button>
                  ))}
                  {sortBy && (
                    <button
                      onClick={() => {
                        setSortBy(null);
                      }}
                      className='w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-left text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-t border-border mt-1 pt-1.5'
                    >
                      Clear Sort
                    </button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Assignee Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={selectedAssigneeFilter ? 'default' : 'outline'}
                  size='sm'
                  className={cn(
                    'flex items-center gap-2 h-9 rounded-lg',
                    selectedAssigneeFilter && 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                  )}
                >
                  <User className='h-3.5 w-3.5' />
                  <span className='text-sm font-medium'>
                    {selectedAssigneeFilter
                      ? 'Assignee (1)'
                      : 'Assignee'}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-60 p-0 bg-card border border-border shadow-lg rounded-xl overflow-hidden'>
                <div className='p-2 border-b border-border bg-muted/20'>
                  <Input
                    placeholder='Filter by assignee...'
                    className='text-xs h-8 focus-visible:ring-1 focus-visible:ring-primary'
                    value={assigneeSearch}
                    onChange={e => setAssigneeSearch(e.target.value)}
                  />
                </div>
                <div className='max-h-48 overflow-y-auto p-1'>
                  {workspaceMembers.length > 0 ? (
                    workspaceMembers.map(member => (
                      <button
                        key={(member.user as any)._id}
                        onClick={() => {
                          if (selectedAssigneeFilter === (member.user as any)._id) {
                            setSelectedAssigneeFilter(null);
                          } else {
                            setSelectedAssigneeFilter((member.user as any)._id);
                          }
                        }}
                        className='w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-left text-xs font-medium hover:bg-muted transition-colors cursor-pointer text-foreground'
                      >
                        <div className='flex items-center gap-2 truncate'>
                          <UserAvatar user={member.user as any} size='sm' />
                          <span className='truncate'>
                            {member.user.firstName} {member.user.lastName}
                          </span>
                        </div>
                        {selectedAssigneeFilter === (member.user as any)._id && (
                          <Check className='h-3.5 w-3.5 text-primary flex-shrink-0' />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className='p-4 text-center text-muted-foreground text-xs'>
                      No members found
                    </div>
                  )}
                  {selectedAssigneeFilter && (
                    <button
                      onClick={() => setSelectedAssigneeFilter(null)}
                      className='w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-left text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-t border-border mt-1 pt-1.5'
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
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
      <div className='flex-1 overflow-x-auto overflow-y-hidden p-6 custom-scrollbar pb-8'>
        {/* Custom scrollbars and styling */}
        <style dangerouslySetInnerHTML={{ __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(100, 116, 139, 0.05);
            border-radius: 99px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(100, 116, 139, 0.25);
            border-radius: 99px;
            border: 1px solid transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(100, 116, 139, 0.45);
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />

        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className='flex items-start gap-6 h-full min-h-[600px]'
              >
                {localStatuses.map((status, columnIndex) => (
                  <Draggable
                    key={status._id}
                    draggableId={status._id as string}
                    index={columnIndex}
                  >
                    {(providedDraggable, snapshotDraggable) => (
                      <div
                        ref={providedDraggable.innerRef}
                        {...providedDraggable.draggableProps}
                        className={cn(
                          'min-w-[320px] max-w-[360px] flex flex-col h-full rounded-2xl border transition-shadow duration-300 bg-card/80 backdrop-blur-sm',
                          snapshotDraggable.isDragging
                            ? 'shadow-2xl border-primary ring-2 ring-primary/20 scale-[1.01]'
                            : 'border-border shadow-md hover:shadow-xl hover:shadow-primary/10'
                        )}
                      >
                        {/* Column Header (acts as drag handle) */}
                        <div
                          {...providedDraggable.dragHandleProps}
                          className='flex items-center justify-between p-4 border-b border-border cursor-grab active:cursor-grabbing select-none'
                        >
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
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground'
                                onClick={(e) => e.stopPropagation()} // Prevent drag triggering on menu click!
                              >
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-40 p-1 bg-card border border-border shadow-lg rounded-xl overflow-hidden' align='end'>
                              <div className='p-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border'>
                                Column Actions
                              </div>
                              <div className='space-y-1 p-1'>
                                {columnIndex > 0 && (
                                  <button
                                    onClick={() => handleMoveStatus(status._id as string, 'left')}
                                    className='w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs font-medium hover:bg-muted transition-colors cursor-pointer text-foreground'
                                  >
                                    Move Left
                                  </button>
                                )}
                                {columnIndex < localStatuses.length - 1 && (
                                  <button
                                    onClick={() => handleMoveStatus(status._id as string, 'right')}
                                    className='w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs font-medium hover:bg-muted transition-colors cursor-pointer text-foreground'
                                  >
                                    Move Right
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteStatus(status._id as string)}
                                  className='w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-t border-border mt-1 pt-1.5'
                                >
                                  Delete Status
                                </button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* Tasks Droppable container */}
                        <Droppable
                          droppableId={status._id as string}
                          key={status._id}
                        >
                          {(providedDroppableZone, snapshotDroppableZone) => (
                            <div
                              ref={providedDroppableZone.innerRef}
                              {...providedDroppableZone.droppableProps}
                              className={cn(
                                'flex-1 overflow-y-auto p-3 space-y-3 min-h-[400px] custom-scrollbar pr-1.5 transition-colors duration-200',
                                snapshotDroppableZone.isDraggingOver && 'bg-primary/5'
                              )}
                            >
                              {(
                                localTasksByStatus[status._id as string] || []
                              ).map((task, index) => (
                                <Draggable
                                  key={task._id}
                                  draggableId={task._id}
                                  index={index}
                                >
                                  {(providedDraggableCard, snapshotDraggableCard) => {
                                    const cardElement = (
                                      <div
                                        ref={providedDraggableCard.innerRef}
                                        {...providedDraggableCard.draggableProps}
                                        {...providedDraggableCard.dragHandleProps}
                                        style={{
                                          ...providedDraggableCard.draggableProps.style,
                                        }}
                                        className={cn(
                                          'group relative select-none rounded-xl mb-3 outline-none',
                                          !snapshotDraggableCard.isDragging && 'transition-all duration-200',
                                          snapshotDraggableCard.isDragging && 'z-50 shadow-2xl scale-[1.03] rotate-[0.5deg]'
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
                                    );

                                    if (snapshotDraggableCard.isDragging && typeof window !== 'undefined') {
                                      return ReactDOM.createPortal(cardElement, document.body);
                                    }
                                    return cardElement;
                                  }}
                                </Draggable>
                              ))}
                              {providedDroppableZone.placeholder}
                            </div>
                          )}
                        </Droppable>

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
                  </Draggable>
                ))}
                {provided.placeholder}

                {/* Add Column Button */}
                <div
                  className='flex-shrink-0 w-[280px]'
                >
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setIsAddStatusOpen(true)}
                    className='w-full h-12 justify-start rounded-xl border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all'
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    <span className='font-medium'>Add Status Group</span>
                  </Button>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Create Status Group Dialog */}
      <Dialog open={isAddStatusOpen} onOpenChange={setIsAddStatusOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl p-6 bg-card border border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Add Status Group
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateStatus} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="status-name" className="text-sm font-semibold">
                Status Name
              </Label>
              <Input
                id="status-name"
                type="text"
                placeholder="e.g. In Review, Testing, On Hold"
                value={newStatusName}
                onChange={e => setNewStatusName(e.target.value)}
                autoFocus
                className="w-full h-10 px-3 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Status Color
              </Label>
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {[
                  '#3b82f6', // Blue
                  '#10b981', // Green
                  '#f59e0b', // Amber/Orange
                  '#ef4444', // Red
                  '#8b5cf6', // Purple
                  '#ec4899', // Pink
                  '#6b7280', // Gray
                ].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewStatusColor(color)}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all cursor-pointer',
                      newStatusColor === color ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddStatusOpen(false)}
                className="rounded-lg px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-lg px-5 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md shadow-primary/20"
              >
                Add Status
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
