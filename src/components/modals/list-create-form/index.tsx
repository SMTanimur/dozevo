import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';

import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Checkbox,
} from '@/components/ui';

import { createlistSchema, TCreateList } from '@/validations';
import { BaseModal } from '../base-modal';

import { useListMutations } from '@/hooks/list';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId: string;
}

export function CreateListModal({
  isOpen,
  onClose,
  spaceId,
}: CreateListModalProps) {
  const { w_id } = useParams<{ w_id: string }>();

  const { createList, isCreatingList } = useListMutations();
  const form = useForm<TCreateList>({
    resolver: zodResolver(createlistSchema),
    defaultValues: {
      name: '',
      space: spaceId ?? '',
      private: false,
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  console.log({ errors: form.formState.errors });

  const onSubmit: SubmitHandler<TCreateList> = (values: TCreateList) => {
   
    if (w_id) {
      const mutationData = {
        workspaceId: w_id,
        data: values,
      };

      createList(mutationData, {
        onSuccess: () => {
          handleClose();
        },
      });
    } else {
      console.error('Workspace ID is missing');
    }
  };

  return (
    <BaseModal
      open={isOpen}
      onChangeOpenModal={(open: boolean) => !open && handleClose()}
      size='medium'
    >
      <BaseModal.Header description='A List represents a collection of items, each with its own name, description, and status.'>
        Create a List
      </BaseModal.Header>
      <BaseModal.Content>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='flex flex-col gap-2 items-start'>
              <FormLabel> name</FormLabel>
              <div className='flex items-center gap-2 w-full'>
                {/* List Name */}
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
            <div className='flex justify-end '>
              <Button type='submit' disabled={isCreatingList}>
                {isCreatingList ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </BaseModal.Content>
    </BaseModal>
  );
}
