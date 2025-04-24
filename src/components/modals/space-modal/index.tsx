import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import {
  Button,
  Input,
  Textarea,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Checkbox,
} from '@/components/ui';
import { useSpaceMutations } from '@/hooks/space/useSpaceMutations';
import { createSpaceSchema, TCreateSpace } from '@/validations';
import { BaseModal } from '../base-modal';
import { AvatarPopoverPicker } from './AvatarPopoverPicker';

interface CreateSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSpaceModal({ isOpen, onClose }: CreateSpaceModalProps) {
  const { w_id } = useParams<{ w_id: string }>();
  const { createSpace, isCreatingSpace } = useSpaceMutations();

  const form = useForm<TCreateSpace>({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      name: '',
      description: '',
      avatar: '',
      color: '#6366f1', // Default color - indigo
      workspace: w_id ?? '',
      private: false,
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit: SubmitHandler<TCreateSpace> = values => {
    if (!w_id) {
      toast.error('Workspace ID is missing.');
      return;
    }

    // Convert FormValues to TCreateSpace
    const spaceData: TCreateSpace = {
      ...values,
      workspace: w_id,
    };

    const mutationData = {
      data: spaceData,
    };

    createSpace(mutationData, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  // Watch the name field to get its current value
  const spaceName = form.watch('name');

  return (
    <BaseModal
      open={isOpen}
      onChangeOpenModal={(open: boolean) => !open && handleClose()}
      size='medium'
    >
      <BaseModal.Header description='A Space represents teams, departments, or groups, each with its own Lists, workflows, and settings.'>
        Create a Space
      </BaseModal.Header>
      <BaseModal.Content>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Icon & Name Row */}
            <div className='flex flex-col gap-2 items-start'>
              <FormLabel>Icon & name</FormLabel>
              <div className='flex items-center gap-2 w-full'>
                <AvatarPopoverPicker
                  icon={form.watch('avatar') || ''}
                  color={form.watch('color') || '#6366f1'}
                  spaceName={spaceName}
                  onIconChange={icon => form.setValue('avatar', icon)}
                  onColorChange={color => form.setValue('color', color)}
                />

                {/* Space Name */}
                <div className='flex-1 w-full'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className='w-full'
                            placeholder='e.g. Marketing, Engineering, HR'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description{' '}
                    <span className='text-muted-foreground'>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder='Add a description...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Make Private */}
            <FormField
              control={form.control}
              name='private'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Make Private</FormLabel>
                    <p className='text-sm text-muted-foreground'>
                      Only you and invited members have access
                    </p>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Footer Actions */}
            <div className='flex justify-end pt-4 border-t'>
              <Button type='submit' disabled={isCreatingSpace}>
                {isCreatingSpace ? 'Creating...' : 'Continue'}
              </Button>
            </div>
          </form>
        </Form>
      </BaseModal.Content>
    </BaseModal>
  );
}
