/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Button } from '@/components/ui';

import { Pencil, FileText, ListTodo } from 'lucide-react';
import React, { useState } from 'react';

import { CreateListModal } from '@/components/modals';

interface CreateItemOptionsProps {
  itemType: 'space' | 'list';
  spaceId?: string;
  listId?: string;
}

export const CreateItemOptions = ({
  itemType,
  listId,
  spaceId,
}: CreateItemOptionsProps) => {
  const [showCreateListModal, setShowCreateListModal] = useState(false);

  return (
    <>
      <div className='grid gap-4 px-3 py-2'>
        <div className='space-y-2'>
          <h4 className='font-medium leading-none'>Create</h4>
          <p className='text-sm text-muted-foreground'>
            Start a new document or project
          </p>
        </div>
        <div className='grid gap-2'>
          <div className='grid grid-cols-1 gap-2'>
            <Button
              variant='outline'
              className=' !py-8'
              onClick={() => setShowCreateListModal(true)}
            >
              <div className='flex items-start'>
                <ListTodo className='mr-2 mt-1 h-5 w-5 text-blue-500' />
                <div className='flex flex-col items-start'>
                  <span className='font-medium'>List</span>
                  <span className='text-xs text-muted-foreground'>
                    Track tasks, projects, people & more
                  </span>
                </div>
              </div>
            </Button>

            <div className='border-t my-2'></div>

            <Button variant='outline' className='justify-start  !py-8'>
              <div className='flex items-start'>
                <FileText className='mr-2 mt-1 h-5 w-5 text-blue-400' />
                <div className='flex flex-col items-start'>
                  <span className='font-medium'>Doc</span>
                  <span className='text-xs text-muted-foreground'>
                    Write notes, docs & wikis
                  </span>
                </div>
              </div>
            </Button>

            <Button variant='outline' className='justify-start !py-8'>
              <div className='flex items-start'>
                <Pencil className='mr-2 mt-1 h-5 w-5 text-amber-500' />
                <div className='flex flex-col items-start'>
                  <span className='font-medium'>Whiteboard</span>
                  <span className='text-xs text-muted-foreground'>
                    Collaborate visually with your team
                  </span>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
      <CreateListModal
        isOpen={showCreateListModal}
        onClose={() => setShowCreateListModal(false)}
        spaceId={spaceId as string}
      />
    </>
  );
};
