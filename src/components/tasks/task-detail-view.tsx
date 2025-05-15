/* eslint-disable @next/next/no-img-element */
'use client';

// Import the new components
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  CalendarIcon,
  User,
  Tag,
  Plus,
  ChevronDown,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { ITaskUser, Priority } from '@/types';
import { useGlobalStateStore } from '@/stores';
import { useGetTask,  useTaskMutations } from '@/hooks';
import { useGetStatuses } from '@/hooks/list';
import { useParams } from 'next/navigation';
import { UserAvatar } from '../ui';
import { SubtaskForm } from './subtask-form';

import {
  PRIORITY_OPTIONS,
  NO_PRIORITY,
  PriorityId,
  NO_PRIORITY_ID,
} from '@/constants';
import { DocumentViewer } from './document-viewer';
import { TaskAttachments } from './task-attachments';
import { TaskDetailsRightBar } from './task-details-right-bar';

export const TaskDetailView = () => {
  const { closeTaskModal, isTaskModalOpen, selectedTaskId, openTaskModal } =
    useGlobalStateStore();
  const [editingTitle, setEditingTitle] = useState(false);

  const { data: task } = useGetTask(selectedTaskId as string);
  const [title, setTitle] = useState(task?.name || '');
  const [description, setDescription] = useState(task?.description || '');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    task?.due_date ? new Date(task?.due_date) : undefined
  );
  const [selectedPriorityId, setSelectedPriorityId] = useState<
    PriorityId | typeof NO_PRIORITY_ID | null
  >(task?.priority as PriorityId | null);
  const [commentText, setCommentText] = useState('');
  const [addingSubtask, setAddingSubtask] = useState(false);

 
  const params = useParams();
  const workspaceId = params.w_id as string;

  const { updateTask, uploadAttachment, isUploadingAttachment } =
    useTaskMutations();

  const { data: statuses = [] } = useGetStatuses({
    workspaceId,
    spaceId: task?.space as string,
    listId: task?.list as string,
  });

  const [selectedDocument, setSelectedDocument] = useState<{
    url: string;
    filename: string;
  } | null>(null);

  useEffect(() => {
    setTitle(task?.name || '');
    setDescription(task?.description || '');
    setSelectedPriorityId(task?.priority as PriorityId | null);
    setSelectedDate(task?.due_date ? new Date(task?.due_date) : undefined);
  }, [task]);

  const handleTitleSave = () => {
    if (task && title.trim()) {
      updateTask({
        taskId: task._id,
        data: { name: title },
        params: {
          spaceId: task.space,
          listId: task.list as string,
          workspaceId: workspaceId,
        },
      });
      setEditingTitle(false);
    }
  };

  const handleDescriptionSave = () => {
    if (task) {
      updateTask({
        taskId: task._id,
        data: { description },
        params: {
          spaceId: task.space,
          listId: task.list as string,
          workspaceId: workspaceId,
        },
      });
    }
  };

  const handleStatusChange = (statusId: string) => {
    if (task && task.status._id !== statusId) {
      updateTask({
        taskId: task._id,
        data: { status: statusId },
        params: {
          spaceId: task.space,
          listId: task.list as string,
          workspaceId: workspaceId,
        },
      });
    }
  };

  const handlePriorityChange = (
    priorityId: PriorityId | typeof NO_PRIORITY_ID
  ) => {
    setSelectedPriorityId(priorityId === NO_PRIORITY_ID ? null : priorityId);
    if (task) {
      updateTask({
        taskId: task._id,
        data: {
          priority:
            priorityId === NO_PRIORITY_ID ? null : (priorityId as Priority),
        },
        params: {
          spaceId: task.space,
          listId: task.list as string,
          workspaceId: workspaceId,
        },
      });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (task) {
      updateTask({
        taskId: task._id,
        data: {
          due_date: date ? date.toISOString() : null,
        },
        params: {
          spaceId: task.space,
          listId: task.list as string,
          workspaceId: workspaceId,
        },
      });
    }
  };

  const handleFileUpload = async (filesToUpload: File[]) => {
    if (task && filesToUpload.length > 0) {
      console.log('Uploading files from dialog:', filesToUpload);
      await uploadAttachment(
        {
          taskId: task._id,
          files: filesToUpload,
          params: {
            workspaceId,
            spaceId: task.space,
            listId: task.list as string,
          },
        },
        {
          onSuccess: () => {
            // Success is handled by the mutation hook
          },
        }
      );
    }
  };

  const handleCommentSubmit = () => {
    if (task && commentText.trim()) {
      console.log('Submitting comment:', commentText);
      setCommentText('');
    }
  };

  const subtasks = task?.subtasks || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const taskComments: any[] = [];

  // const currentPriorityDetails = getPriorityDetails(selectedPriorityId);

  if (!task) return null;

  // Handler for navigating to parent task
  const handleGoToParentTask = () => {
    if (task.parentTask) {
      openTaskModal(task.parentTask);
    }
  };

  return (
    <Dialog open={isTaskModalOpen} onOpenChange={closeTaskModal}>
      <DialogContent className='max-w-[1400px] p-0 h-[90vh] flex flex-col overflow-hidden'>
        {/* Top bar with optional back arrow */}
        <div className='flex items-center justify-between p-4 border-b'>
          <div className='flex items-center gap-2'>
            {task.parentTask && (
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 mr-2 hover:bg-gray-200 focus:bg-gray-300 transition-colors'
                onClick={handleGoToParentTask}
                aria-label='Go to parent task'
              >
                <ArrowLeft className='h-5 w-5' />
              </Button>
            )}
            <Button variant='outline' size='sm' className='gap-1'>
              <span>Task</span>
              <ChevronDown className='h-3 w-3' />
            </Button>
            <div className='text-sm text-gray-500'>{task.space}</div>
          </div>
          <div className='flex items-center pr-16 gap-2'>
            <Button variant='outline' size='sm'>
              Share
            </Button>
          </div>
        </div>

        <div className='flex-1 overflow-auto flex'>
          <div className='flex-1 p-6 overflow-auto'>
            <div className='mb-6'>
              {editingTitle ? (
                <div className='flex items-center gap-2'>
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={e => e.key === 'Enter' && handleTitleSave()}
                    className='text-2xl font-semibold h-auto py-1'
                    autoFocus
                  />
                  <Button onClick={handleTitleSave} size='sm'>
                    Save
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      setTitle(task.name);
                      setEditingTitle(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <h1
                  className='text-2xl font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded'
                  onClick={() => setEditingTitle(true)}
                >
                  {title || 'Untitled Task'}
                </h1>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4 mb-6'>
              <div>
                <Label className='text-sm text-gray-500 mb-1'>Status</Label>
                <Select
                  value={task.status._id}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className='w-full'>
                    <div className='flex items-center gap-2'>
                      <SelectValue placeholder='Select status' />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {(statuses || []).map(status => (
                      <SelectItem key={status._id} value={status._id}>
                        <div className='flex items-center gap-2'>
                          <div
                            className='w-3 h-3 rounded-full'
                            style={{ backgroundColor: status.color }}
                          />
                          <span>{status.status}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className='text-sm text-gray-500 mb-1'>Priority</Label>
                <Select
                  value={selectedPriorityId ?? NO_PRIORITY_ID}
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger className='w-full'>
                    <div className='flex items-center gap-2'>
                      <SelectValue placeholder='Select priority' />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_PRIORITY_ID}>
                      <div className='flex items-center gap-2'>
                        <NO_PRIORITY.icon className='h-4 w-4' />
                        <span>{NO_PRIORITY.name}</span>
                      </div>
                    </SelectItem>
                    {PRIORITY_OPTIONS.map(priority => (
                      <SelectItem key={priority.id} value={priority.id}>
                        <div className='flex items-center gap-2'>
                          <priority.icon
                            className='h-4 w-4'
                            style={{ color: priority.color }}
                          />
                          <span>{priority.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className='text-sm text-gray-500 mb-1'>Assignees</Label>
                <div className='flex'>
                  {task.assignees.length > 0 ? (
                    <div className='flex -space-x-2'>
                      {task.assignees.map(assignee => (
                        <UserAvatar
                          key={assignee._id as string}
                          user={assignee as ITaskUser}
                        />
                      ))}
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-8 w-8 ml-2'
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant='outline'
                      className='flex items-center gap-2'
                    >
                      <User className='h-4 w-4' />
                      <span>Assign</span>
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <Label className='text-sm text-gray-500 mb-1'>Due Date</Label>
                <div className='flex items-center gap-2'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className='flex items-center gap-2 w-full justify-start'
                      >
                        <CalendarIcon className='h-4 w-4' />
                        <span>
                          {selectedDate
                            ? format(selectedDate, 'PPP')
                            : 'Set date'}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label className='text-sm text-gray-500 mb-1'>Tags</Label>
                <div className='flex'>
                  {task.tags.length > 0 ? (
                    <div className='flex flex-wrap gap-1'>
                      {task.tags.map(tag => (
                        <div
                          key={tag.name}
                          className='px-2 py-1 rounded-md text-xs'
                          style={{
                            backgroundColor: tag.color || '#e2e8f0',
                            color: tag.color ? 'white' : 'black',
                          }}
                        >
                          {tag.name}
                        </div>
                      ))}
                      <Button variant='outline' size='icon' className='h-6 w-6'>
                        <Plus className='h-3 w-3' />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant='outline'
                      className='flex items-center gap-2'
                    >
                      <Tag className='h-4 w-4' />
                      <span>Add tag</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className='mb-6'>
              <Label className='text-sm text-gray-500 mb-1'>Description</Label>
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder='Add a description...'
                className='min-h-[150px]'
                onBlur={handleDescriptionSave}
              />
            </div>

            <div className='mb-6'>
              <div className='text-sm text-gray-500 mb-1'>Custom Fields</div>
              <Button variant='outline' className='flex items-center gap-2'>
                <Plus className='h-4 w-4' />
                <span>Create Custom Field</span>
              </Button>
            </div>

            <div className='mb-6'>
              <div className='flex items-center justify-between mb-1'>
                <div className='text-sm text-gray-500'>Subtasks</div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setAddingSubtask(true)}
                >
                  <Plus className='h-4 w-4 mr-1' />
                  New Task
                </Button>
              </div>

              {addingSubtask && (
                <SubtaskForm
                  parentTaskId={task._id}
                  workspaceId={workspaceId}
                  spaceId={task.space}
                  listId={task.list as string}
                  onCancel={() => setAddingSubtask(false)}
                />
              )}

              <div className='border rounded-md p-3'>
                {subtasks.length > 0 ? (
                  <div className='space-y-1'>
                    {subtasks.map(subtask => (
                      <div
                        key={subtask._id}
                        className='flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors group'
                        onClick={() => openTaskModal(subtask._id)}
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ')
                            openTaskModal(subtask._id);
                        }}
                        aria-label={`Open subtask ${subtask.name}`}
                      >
                        <div
                          className='w-4 h-4 rounded-full mr-2 flex items-center justify-center'
                          style={{ backgroundColor: subtask.status.color }}
                        >
                          {subtask.status.type === 'in_progress' && (
                            <div className='w-1.5 h-1.5 rounded-full bg-white' />
                          )}
                          {subtask.status.type === 'done' && (
                            <svg
                              className='w-2.5 h-2.5 text-white'
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
                        <span className='flex-1 text-sm'>{subtask.name}</span>
                        <ChevronRight className='h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity' />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-sm text-gray-400'>No subtasks yet</div>
                )}
              </div>
            </div>

            <div className='mb-6'>
              <TaskAttachments
                attachments={task?.attachments || []}
                onUpload={handleFileUpload}
                isUploading={isUploadingAttachment}
              />
            </div>
          </div>

          <TaskDetailsRightBar
            task={task}
            commentText={commentText}
            onCommentChange={setCommentText}
            onCommentSubmit={handleCommentSubmit}
            taskComments={taskComments}
          />
        </div>

        <DocumentViewer
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          fileUrl={selectedDocument?.url || ''}
          fileName={selectedDocument?.filename || ''}
        />
      </DialogContent>
    </Dialog>
  );
};
