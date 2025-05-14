import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X } from 'lucide-react';
import { toast } from 'sonner';
import { AttachmentDialog } from '@/components/tasks/attachment-dialog';
import { Task } from '@/types/task';

interface TaskDetailViewProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetailView({ task, onClose }: TaskDetailViewProps) {
  const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/tasks/${task._id}/attachments`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();

      // Update the task with the new attachment
      const updatedTask = {
        ...task,
        attachments: [...(task.attachments || []), data.attachment],
      };

      // Trigger a refresh of the task data
      window.dispatchEvent(
        new CustomEvent('taskUpdated', { detail: updatedTask })
      );

      setIsAttachmentDialogOpen(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className='fixed inset-0 z-50 bg-background/80 backdrop-blur-sm'>
      <div className='fixed inset-y-0 right-0 w-full max-w-2xl bg-background shadow-lg'>
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-lg font-semibold'>{task.name}</h2>
          <Button variant='ghost' size='icon' onClick={onClose}>
            <X className='h-4 w-4' />
          </Button>
        </div>

        <div className='p-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsAttachmentDialogOpen(true)}
            className='flex items-center gap-2'
          >
            <Paperclip className='h-4 w-4' />
            Add Attachment
          </Button>

          <AttachmentDialog
            isOpen={isAttachmentDialogOpen}
            onClose={() => setIsAttachmentDialogOpen(false)}
            onUpload={handleFileUpload}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        </div>
      </div>
    </div>
  );
}
