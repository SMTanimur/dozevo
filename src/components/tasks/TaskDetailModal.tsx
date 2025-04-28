'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGetTask } from '@/hooks/task';
import { ITask } from '@/types/task';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Flag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TaskDetailModalProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  taskId,
  isOpen,
  onClose,
}) => {
  const {
    data: task,
    isLoading,
    error,
  } = useGetTask(taskId ?? '', { enabled: !!taskId });

  const typedTask = task as ITask | undefined;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const formatDate = (
    dateString: string | Date | null | undefined
  ): string | null => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        dateStyle: 'medium',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw] h-[80vh] flex flex-col p-0 gap-0'>
        <DialogHeader className='p-4 border-b flex flex-row justify-between items-center space-y-0'>
          <DialogTitle className='text-base font-medium'>
            {isLoading && <Skeleton className='h-5 w-24' />}
            {typedTask && <span>{typedTask.name}</span>}
            {!typedTask && !isLoading && <span>Task Details</span>}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant='ghost'
              size='icon'
              onClick={onClose}
              className='h-7 w-7'
            >
              <X className='h-4 w-4' />
              <span className='sr-only'>Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className='flex-1 overflow-hidden'>
          {isLoading && taskId && (
            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='md:col-span-2 space-y-4'>
                  <Skeleton className='h-8 w-3/4' />
                  <Skeleton className='h-24 w-full' />
                  <Skeleton className='h-6 w-1/4 mt-4' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <div className='space-y-6'>
                  <Skeleton className='h-10 w-1/2' />
                  <Skeleton className='h-10 w-3/4' />
                  <Skeleton className='h-10 w-1/2' />
                  <Skeleton className='h-10 w-3/4' />
                </div>
              </div>
            </div>
          )}
          {error && taskId && (
            <div className='flex items-center justify-center h-full text-red-500 p-6'>
              Error loading task: {error.message}
            </div>
          )}
          {!isLoading && !error && typedTask && (
            <ScrollArea className='h-full'>
              <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6'>
                <div className='md:col-span-2 space-y-6'>
                  <Input
                    key={`name-${typedTask._id}`}
                    defaultValue={typedTask.name}
                    className='text-xl font-semibold border-0 focus-visible:ring-1 focus-visible:ring-offset-0 p-1 h-auto -ml-1 hover:bg-gray-100 focus-visible:bg-gray-100'
                  />
                  <div>
                    <label className='text-sm font-medium mb-1 block'>
                      Description
                    </label>
                    <Textarea
                      key={`desc-${typedTask._id}`}
                      placeholder='Add description...'
                      defaultValue={typedTask.description || ''}
                      className='min-h-[120px] focus-visible:ring-1 focus-visible:ring-offset-0'
                    />
                  </div>
                  <div className='mt-4'>
                    <h4 className='font-semibold mb-2 text-sm'>Subtasks</h4>
                    <div className='text-sm text-gray-500 p-4 border rounded-md bg-gray-50/50'>
                      Subtasks section coming soon...
                    </div>
                  </div>
                  <div className='mt-4'>
                    <h4 className='font-semibold mb-2 text-sm'>Activity</h4>
                    <div className='text-sm text-gray-500 p-4 border rounded-md bg-gray-50/50'>
                      Activity & Comments section coming soon...
                    </div>
                  </div>
                </div>

                <div className='space-y-4 pt-1'>
                  <div>
                    <label className='text-xs font-medium text-gray-500 block mb-1 uppercase tracking-wider'>
                      Status
                    </label>
                    {typedTask.status ? (
                      <Badge
                        variant='outline'
                        className='py-0.5 px-2 font-normal'
                        style={{
                          borderColor: typedTask.status.color,
                          color: typedTask.status.color,
                          backgroundColor: `${typedTask.status.color}1A`,
                        }}
                      >
                        {typedTask.status.name}
                      </Badge>
                    ) : (
                      <span className='text-sm text-gray-500'>-</span>
                    )}
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 block mb-1 uppercase tracking-wider'>
                      Assignees
                    </label>
                    <div className='text-sm'>
                      {typedTask.assignees && typedTask.assignees.length > 0 ? (
                        typedTask.assignees
                          .map(a => {
                            if (
                              typeof a === 'object' &&
                              a !== null &&
                              'firstName' in a
                            ) {
                              return a.firstName;
                            }
                            return null;
                          })
                          .filter(Boolean)
                          .join(', ')
                      ) : (
                        <span className='text-gray-400'>Unassigned</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 block mb-1 uppercase tracking-wider'>
                      Priority
                    </label>
                    {typedTask.priority ? (
                      <Badge
                        variant='outline'
                        className='py-0.5 px-1.5 font-normal text-xs'
                        style={{
                          borderColor: typedTask.priority.color,
                          color: typedTask.priority.color,
                          backgroundColor: `${typedTask.priority.color}1A`,
                        }}
                      >
                        <Flag className='h-3 w-3 mr-1' />
                        {typedTask.priority.name}
                      </Badge>
                    ) : (
                      <span className='text-sm text-gray-500'>-</span>
                    )}
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 block mb-1 uppercase tracking-wider'>
                      Due Date
                    </label>
                    <span className='text-sm'>
                      {typedTask.dueDate ? (
                        formatDate(typedTask.dueDate)
                      ) : (
                        <span className='text-gray-400'>Not set</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
