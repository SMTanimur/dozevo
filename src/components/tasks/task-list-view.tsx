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
  Sparkles,
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
import { TaskSkeleton } from '@/components';
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
  }, [statuses, filteredTasks]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    const sourceStatusId = source.droppableId;
    const destStatusId = destination.droppableId;
    if (sourceStatusId === destStatusId) {
      if (destination.index === source.index) {
        return;
      }
      const tasksInGroup: ITask[] = Array.from(
        tasksByStatus[sourceStatusId] || []
      );
      const [movedTask] = tasksInGroup.splice(source.index, 1);
      tasksInGroup.splice(destination.index, 0, movedTask);
      setTasksByStatus(prev => ({
        ...prev,
        [sourceStatusId]: tasksInGroup,
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
      // Moving between statuses
      const sourceTasks = Array.from(tasksByStatus[sourceStatusId] || []);
      const destTasks = Array.from(tasksByStatus[destStatusId] || []);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      if (!movedTask) return;
      // Update the status locally
      const updatedTask = {
        ...movedTask,
        status: { ...movedTask.status, _id: destStatusId },
      };
      destTasks.splice(destination.index, 0, updatedTask);
      setTasksByStatus(prev => ({
        ...prev,
        [sourceStatusId]: sourceTasks,
        [destStatusId]: destTasks,
      }));
      // Update the backend: status and order
      updateTask({
        taskId: movedTask._id,
        data: { status: destStatusId },
        params: {
          spaceId: list.space as string,
          listId: list._id as string,
          workspaceId: list.workspace as string,
        },
      });
      // Reorder both columns
      reorderTasks({
        listId: list._id as string,
        orderedTaskIds: destTasks.map(t => t._id),
        params: {
          workspaceId: list.workspace as string,
          spaceId: list.space as string,
          listId: list._id as string,
        },
      });
      reorderTasks({
        listId: list._id as string,
        orderedTaskIds: sourceTasks.map(t => t._id),
        params: {
          workspaceId: list.workspace as string,
          spaceId: list.space as string,
          listId: list._id as string,
        },
      });
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
            variant={filtersApplied ? 'secondary' : 'outline'}
            size='sm'
            className='flex items-center gap-2'
          >
            <span>Filter</span>
            {filtersApplied && (
              <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
            )}
            <ChevronDown className='h-4 w-4' />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2'
              >
                <span>Status</span>
                {selectedStatusIds.length > 0 &&
                  `(${selectedStatusIds.length})`}
                <ChevronDown className='h-4 w-4' />
              </Button>
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
                  {status.status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className='flex items-center space-x-2'>
            <Switch
              id='archived-tasks-list'
              checked={showArchived}
              onCheckedChange={handleShowArchivedChange}
            />
            <Label htmlFor='archived-tasks-list'>Archived</Label>
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
              className='h-9 px-3 py-1 rounded-md border border-input bg-background text-sm w-40'
              value={searchTerm}
              onChange={handleSearchChange}
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
                  <Button className='rounded-full bg-primary text-white shadow hover:bg-primary-dark transition'>
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
