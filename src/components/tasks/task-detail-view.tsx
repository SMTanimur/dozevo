/* eslint-disable @next/next/no-img-element */
'use client';

// Import the new components
import { useState, useEffect, useRef } from 'react';
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
  MessageSquare,
  Link,
  Paperclip,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { ITaskUser, Priority } from '@/types';
import { useGlobalStateStore } from '@/stores';
import { useGetTask, useGetTasks, useTaskMutations } from '@/hooks';
import { useGetStatuses } from '@/hooks/list';
import { useParams } from 'next/navigation';
import { UserAvatar } from '../ui';
import { SubtaskForm } from './subtask-form';
import SubtaskItem from './subtask-item';
import { CommentItem } from './comments';
import {
  PRIORITY_OPTIONS,
  NO_PRIORITY,
  PriorityId,
  NO_PRIORITY_ID,
} from '@/constants';
import { DocumentViewer } from './document-viewer';
import { TaskAttachments } from './task-attachments';

export const TaskDetailView = () => {
  const { closeTaskModal, isTaskModalOpen, selectedTaskId } =
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

  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const { data: spaceTasksData } = useGetTasks({
    spaceId: task?.space as string,
  });
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

  const subtasks = task
    ? (spaceTasksData?.data || []).filter(t => t.parentTask === task._id)
    : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const taskComments: any[] = [];

  // const currentPriorityDetails = getPriorityDetails(selectedPriorityId);

  if (!task) return null;

  return (
    <Dialog open={isTaskModalOpen} onOpenChange={closeTaskModal}>
      <DialogContent className='max-w-7xl p-0 h-[90vh] flex flex-col overflow-hidden'>
        <div className='flex items-center justify-between p-4 border-b'>
          <div className='flex items-center gap-2'>
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
              <TaskAttachments
                attachments={task?.attachments || []}
                onUpload={handleFileUpload}
                isUploading={isUploadingAttachment}
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
                      <SubtaskItem key={subtask._id} task={subtask} />
                    ))}
                  </div>
                ) : (
                  <div className='text-sm text-gray-400'>No subtasks yet</div>
                )}
              </div>
            </div>
          </div>

          <div className='w-[350px] border-l flex flex-col'>
            <div className='p-4 border-b flex items-center justify-between'>
              <h3 className='font-medium'>Activity</h3>
              <div className='flex items-center gap-1'>
                <Button variant='ghost' size='sm' className='h-7 px-2'>
                  <MessageSquare className='h-3.5 w-3.5 mr-1' />
                  {taskComments.length}
                </Button>
                <Button variant='ghost' size='icon' className='h-7 w-7'>
                  <ChevronDown className='h-3.5 w-3.5' />
                </Button>
              </div>
            </div>

            <div className='flex-1 overflow-auto p-4'>
              <div className='space-y-4'>
                <div className='flex gap-2'>
                  <UserAvatar user={task.creator} size='sm' />
                  <div className='flex-1'>
                    <div className='text-xs text-gray-500'>
                      <span className='font-medium text-gray-700'>
                        {task.creator.firstName} {task.creator.lastName}
                      </span>{' '}
                      created this task
                    </div>
                    <div className='text-xs text-gray-400'>
                      {new Date(task.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {task.status.type !== 'open' && (
                  <div className='flex gap-2'>
                    <UserAvatar user={task.creator} size='sm' />
                    <div className='flex-1'>
                      <div className='text-xs text-gray-500'>
                        <span className='font-medium text-gray-700'>
                          {task.creator.firstName} {task.creator.lastName}
                        </span>{' '}
                        changed status from{' '}
                        <span className='font-medium'>TO DO</span> to{' '}
                        <span className='font-medium'>
                          {task.status.status}
                        </span>
                      </div>
                      <div className='text-xs text-gray-400'>
                        {new Date(task.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {taskComments.map(comment => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            </div>

            <div className='p-4 border-t'>
              <div className='flex gap-2'>
                <UserAvatar user={task.creator} size='sm' />
                <div className='flex-1'>
                  <textarea
                    ref={commentInputRef}
                    className='w-full border rounded-md p-2 text-sm'
                    placeholder='Write a comment...'
                    rows={3}
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                  />
                  <div className='flex justify-between mt-2'>
                    <div className='flex gap-1'>
                      <Button variant='ghost' size='icon' className='h-7 w-7'>
                        <Paperclip className='h-4 w-4' />
                      </Button>
                      <Button variant='ghost' size='icon' className='h-7 w-7'>
                        <Link className='h-4 w-4' />
                      </Button>
                    </div>
                    <Button
                      size='sm'
                      onClick={handleCommentSubmit}
                      disabled={!commentText.trim()}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
