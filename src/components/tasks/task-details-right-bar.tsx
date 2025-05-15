import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, ChevronDown, Paperclip, Link } from 'lucide-react';
import { UserAvatar } from '../ui';
import { CommentItem } from './comments';
import { IComment, ITask } from '@/types';

interface TaskDetailsRightBarProps {
  task: ITask;
  commentText: string;
  onCommentChange: (text: string) => void;
  onCommentSubmit: () => void;
  taskComments: IComment[]; // Replace 'any' with your comment type
}

export const TaskDetailsRightBar = ({
  task,
  commentText,
  onCommentChange,
  onCommentSubmit,
  taskComments,
}: TaskDetailsRightBarProps) => {
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  return (
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
                  changed status from <span className='font-medium'>TO DO</span>{' '}
                  to <span className='font-medium'>{task.status.status}</span>
                </div>
                <div className='text-xs text-gray-400'>
                  {new Date(task.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {taskComments.map(comment => (
            <CommentItem key={comment._id} comment={comment} />
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
              onChange={e => onCommentChange(e.target.value)}
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
                onClick={onCommentSubmit}
                disabled={!commentText.trim()}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
