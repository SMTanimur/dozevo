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
      color: '',
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
            {/* Icon & Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g. Marketing, Engineering, HR'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
