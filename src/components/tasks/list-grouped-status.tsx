import React, { useEffect, useState } from 'react';
import { IList, ITask, IStatusDefinition } from '@/types';
import { useGetStatuses } from '@/hooks/list';
import { useTaskMutations } from '@/hooks/task';
import { useGlobalStateStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskRow } from './task-row';
import { cn } from '@/lib/utils';
import { StatusSetupEmptyState } from './status-setup-empty-state';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

interface ListGroupedStatusProps {
  list: IList;
  tasks: ITask[];
}

export const ListGroupedStatus: React.FC<ListGroupedStatusProps> = ({
  list,
  tasks,
}) => {
  const { openTaskModal } = useGlobalStateStore();
  const { data: statuses = [], isLoading: isLoadingStatuses } = useGetStatuses({
    workspaceId: list?.workspace as string,
    spaceId: list?.space as string,
    listId: list?._id as string,
  });
  const { createTask, reorderTasks, updateTask } = useTaskMutations();
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
    createTask({
      data: {
        name: 'New Task',
        status: status._id,
        listId: list._id,
      },
      params: {
        spaceId: list.space as string,
        listId: list._id as string,
      },
    });
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    const sourceStatusId = source.droppableId;
    const destStatusId = destination.droppableId;
    if (sourceStatusId === destStatusId) {
      if (destination.index === source.index) return;
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
    return <div className='p-6 text-muted-foreground'>Loading statuses...</div>;
  }

  if (statuses.length === 0) {
    return <StatusSetupEmptyState list={list} />;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className='flex flex-col gap-8 p-4'>
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
                <Plus className='h-4 w-4 mr-1' /> Add Task
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
                  {(!tasksByStatus[status._id] ||
                    tasksByStatus[status._id].length === 0) && (
                    <div className='px-6 py-4 text-gray-300 text-sm'>
                      No tasks
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
