'use client';

import { ISpace } from '@/types';
import React, { useState } from 'react';
import { Button, Popover, PopoverContent, PopoverTrigger } from '../../ui';
import { FileText, ListTodo, Pencil, Plus } from 'lucide-react';
import { CreateListModal } from '../../modals';

export enum ListItemType {}
interface ListItemPlusProps {
  itemPlusType: 'space' | 'list';
  space: ISpace;
}

export const ListItemPlus = ({ itemPlusType, space }: ListItemPlusProps) => {
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6 cursor-pointer'
            isTooltip
            tooltipContent={
              itemPlusType === 'space'
                ? 'Create Lists, Docs and more'
                : 'Create Tasks, Notes and more'
            }
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <Plus className='h-3 w-3' />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' side='right' className='ml-8 rounded-lg'>
          <div className='grid gap-4'>
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
        </PopoverContent>
      </Popover>
      <CreateListModal
        isOpen={showCreateListModal}
        onClose={() => setShowCreateListModal(false)}
        spaceId={space._id}
      />
    </>
  );
};
