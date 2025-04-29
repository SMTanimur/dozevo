'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useGetStatuses } from '@/hooks/list';
import { useTaskMutations } from '@/hooks/task';
import { TCreateTask } from '@/validations';

interface SubtaskFormProps {
  parentTaskId: string;
  workspaceId: string;
  spaceId: string;
  listId: string;
  onCancel: () => void;
}

export const SubtaskForm = ({
  parentTaskId,
  workspaceId,
  spaceId,
  listId,
  onCancel,
}: SubtaskFormProps) => {
  const { data: statuses = [], isLoading: isLoadingStatuses } = useGetStatuses({
    workspaceId,
    spaceId,
    listId,
  });

  const { createTask } = useTaskMutations();

  const [name, setName] = useState('');
  const [selectedStatusId, setSelectedStatusId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (selectedStatusId === undefined && statuses.length > 0) {
      const defaultStatus =
        statuses.find(s => s.type === 'open') || statuses[0];
      if (defaultStatus) {
        setSelectedStatusId(defaultStatus._id);
      }
    }
  }, [statuses, selectedStatusId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedStatusId) return;

    const newSubtask: TCreateTask = {
      name,
      status: selectedStatusId,
      parentTask: parentTaskId,
      listId,
    };

    createTask({
      data: newSubtask,
      params: { spaceId, listId },
    });

    onCancel();
  };

  if (isLoadingStatuses) {
    return <div className='p-3'>Loading statuses...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className='border rounded-md p-3 mb-3'>
      <div className='flex items-center justify-between mb-3'>
        <h4 className='font-medium'>New Subtask</h4>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='h-6 w-6'
          onClick={onCancel}
        >
          <X className='h-4 w-4' />
        </Button>
      </div>

      <div className='space-y-3'>
        <div>
          <Label htmlFor='subtask-name'>Name</Label>
          <Input
            id='subtask-name'
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Enter subtask name'
            className='mt-1'
            autoFocus
          />
        </div>

        <div>
          <Label htmlFor='subtask-status'>Status</Label>
          <Select
            value={selectedStatusId ?? ''}
            onValueChange={setSelectedStatusId}
          >
            <SelectTrigger
              id='subtask-status'
              className='mt-1'
              disabled={statuses.length === 0}
            >
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status._id} value={status._id as string}>
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

        <div className='flex justify-end gap-2'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit' disabled={!name.trim() || !selectedStatusId}>
            Create Subtask
          </Button>
        </div>
      </div>
    </form>
  );
};
