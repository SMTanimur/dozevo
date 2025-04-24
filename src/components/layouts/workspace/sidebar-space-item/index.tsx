'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { icons, MoreHorizontal, Plus } from 'lucide-react';

import { ISpace } from '@/types';
import { SidebarItem } from '../../sidebar-item';
import Link from 'next/link';
import { CreateListModal } from '@/components/modals';
import { ListItem } from '../list-item';

import { ListItemPlus } from '@/components/list-item-plus';

interface SidebarSpaceItemProps {
  space: ISpace;
  isActive?: boolean;
  isCollapsed?: boolean;
}

export function SidebarSpaceItem({
  space,
  isActive = false,
  isCollapsed = false,
}: SidebarSpaceItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const hasLists = space.lists && space.lists.length > 0;

  const handleExpand = () => {
    if (isCollapsed) {
      setIsExpanded(true);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <div className='group w-full  relative flex items-center'>
        <SidebarItem
          href={`/${space.workspace}/s/${space._id}`}
          color={space.color}
          icon={space.avatar as keyof typeof icons}
          label={space.name}
          isActive={isActive}
          onExpand={handleExpand}
          isCollapsed={isCollapsed}
          actions={
            !isCollapsed ? (
              <>
                <Button variant='ghost' size='icon' className='h-6 w-6'>
                  <MoreHorizontal className='h-3 w-3' />
                </Button>
                <ListItemPlus itemPlusType='space' space={space} />
              </>
            ) : null
          }
        />
      </div>

      {isExpanded && !isCollapsed && (
        <div className='mt-1 pl-3 space-y-1 w-full overflow-hidden'>
          {hasLists ? (
            space.lists?.map(list => (
              <ListItem
                key={list._id}
                href={`/${space.workspace}/s/${space._id}/l/${list._id}`}
                color={list.color}
                icon={list.icon as keyof typeof icons}
                label={list.name}
                isCollapsed={isCollapsed}
                actions={
                  !isCollapsed ? (
                    <>
                      <Button variant='ghost' size='icon' className='h-6 w-6'>
                        <MoreHorizontal className='h-3 w-3' />
                      </Button>
                      <Button variant='ghost' size='icon' className='h-6 w-6'>
                        <Plus className='h-3 w-3' />
                      </Button>
                    </>
                  ) : null
                }
              />
            ))
          ) : (
            <div className='py-2 text-center text-sm text-muted-foreground'>
              <p className='mb-2'>
                Create a
                <button
                  onClick={() => setShowCreateListModal(true)}
                  className='mx-1 text-primary hover:underline'
                >
                  List
                </button>
                or
                <Link
                  href={`/space/${space._id}/doc/new`}
                  className='mx-1 text-primary hover:underline'
                >
                  Doc
                </Link>
              </p>
            </div>
          )}
        </div>
      )}

      <CreateListModal
        isOpen={showCreateListModal}
        onClose={() => setShowCreateListModal(false)}
        spaceId={space._id}
      />
    </div>
  );
}
