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
  Clock,
  User,
  Tag,
  MessageSquare,
  Link,
  Paperclip,
  Plus,
  X,
  ChevronDown,
  Flag,
} from 'lucide-react';
import { ITask, ITaskPriority } from '@/types';
import { useGlobalStateStore } from '@/stores';
import { useGetTasks, useTaskMutations } from '@/hooks';
import { useGetStatuses } from '@/hooks/list';
import { useParams } from 'next/navigation';
import { UserAvatar } from '../ui';
import { SubtaskForm } from './subtask-form';
import SubtaskItem from './subtask-item';
import { CommentItem } from './comments';

type TaskDetailViewProps = {
  task: ITask;
};
export const TaskDetailView = ({ task }: TaskDetailViewProps) => {
  const [editingTitle, setEditingTitle] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedPriority, setSelectedPriority] =
    useState<ITaskPriority | null>(null);
  const [commentText, setCommentText] = useState('');
  const [addingSubtask, setAddingSubtask] = useState(false);
  const { selectedTaskId,closeTaskModal,isTaskModalOpen } = useGlobalStateStore();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const { data: tasks } = useGetTasks({ spaceId: task?.space });
  const {w_id}=useParams()
  const { updateTask } = useTaskMutations();

  
  const { data: statuses } = useGetStatuses({
    workspaceId: w_id as string,
    spaceId: task.space,
    listId: task.list as string,
  });
  useEffect(() => {
    if (selectedTaskId) {
      const selectedTask = tasks?.data?.find(t => t._id === selectedTaskId);
      if (selectedTask) {
        setTitle(selectedTask.name);
        setDescription(selectedTask.description || '');
        setSelectedPriority(selectedTask.priority);
        setSelectedDate(
          selectedTask.dueDate ? new Date(selectedTask.dueDate) : undefined
        );
      }
    }
  }, [selectedTaskId, tasks]);

  const handleTitleSave = () => {
    if (task && title.trim()) {
      updateTask({
        data: {
          ...task,
          name: title,
          description: description,
          priority: selectedPriority,
          dueDate: selectedDate,
          status: task.status._id,
          assignees: task.assignees.map(a => a._id),
        },
        taskId: task._id,
      });
      setEditingTitle(false);
    }
  };

  const handleDescriptionSave = () => {
    if (task) {
      updateTask({
        data: {
     
          description: description,
        },
        taskId: task._id,
      });
    }
  };

  const handleStatusChange = (statusId: string) => {
    if (task) {
      const newStatus = statuses?.find(s => s._id === statusId);
      if (newStatus) {
        updateTask({
          data: {
         
            status: newStatus._id,
          },
          taskId: task._id,
        });
      }
    }
  };

  const handlePriorityChange = (priorityId: string) => {
    if (task) {
      const newPriority = priorities.find(p => p.id === priorityId) || null;
      setSelectedPriority(newPriority);
      updateTask({
        data: {
          priority: newPriority,
        },
        taskId: task._id,
      });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (task) {
      setSelectedDate(date);
      updateTask({
        data: {
          due_date: date ? date.toISOString() : null,
        },
        taskId: task._id,
      });
    }
  };

  const handleCommentSubmit = () => {
    if (task && commentText.trim()) {
      // addComment(task._id, commentText);
      setCommentText('');
    }
  };

  // Get subtasks for the current task
  const subtasks = task
    ? tasks?.data?.filter(t => t.parentTask && t.parentTask._id === task._id)
    : [];

  // Get comments for the current task
  // const taskComments = task ? comments[task._id] || [] : [];\
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const taskComments:any[] = [];

  if (!task) return null;

  return (
    <Dialog open={isTaskModalOpen} onOpenChange={closeTaskModal}>
      <DialogContent className='max-w-4xl p-0 h-[90vh] flex flex-col overflow-hidden'>
        <div className='flex items-center justify-between p-4 border-b'>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' className='gap-1'>
              <span>Task</span>
              <ChevronDown className='h-3 w-3' />
            </Button>
            <div className='text-sm text-gray-500'>
             {task.space}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm'>
              Share
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              onClick={closeTaskModal}
            >
              <X className='h-4 w-4' />
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
                    className='text-2xl font-semibold h-auto py-1'
                    autoFocus
                  />
                  <Button onClick={handleTitleSave}>Save</Button>
                  <Button
                    variant='ghost'
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
                  {task.name}
                </h1>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4 mb-6'>
              <div>
                <Label className='text-sm text-gray-500 mb-1'>Status</Label>
                <Select
                  defaultValue={task.status.id}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className='w-full'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-3 h-3 rounded-full'
                        style={{ backgroundColor: task.status.color }}
                      />
                      <SelectValue placeholder='Select status' />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {statuses?.map(status => (
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
                  defaultValue={task.priority?.id || 'none'}
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger className='w-full'>
                    <div className='flex items-center gap-2'>
                      {selectedPriority && (
                        <Flag
                          className='h-4 w-4'
                          style={{ color: selectedPriority.color }}
                        />
                      )}
                      <SelectValue placeholder='Select priority' />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>No Priority</SelectItem>
                    {priorities.map(priority => (
                      <SelectItem key={priority.id} value={priority.id}>
                        <div className='flex items-center gap-2'>
                          <Flag
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
                        <UserAvatar key={assignee._id} user={assignee} />
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
                  <Button variant='outline' size='icon' className='h-9 w-9'>
                    <Clock className='h-4 w-4' />
                  </Button>
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
                  onCancel={() => setAddingSubtask(false)}
                />
              )}

              <div className='border rounded-md p-3'>
                {subtasks?.length > 0 ? (
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
                        <span className='font-medium'>{task.status.name}</span>
                      </div>
                      <div className='text-xs text-gray-400'>
                        {new Date(task.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Display comments */}
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
      </DialogContent>
    </Dialog>
  );
};
