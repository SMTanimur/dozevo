'use client';

import { useState } from 'react';

import { icons } from 'lucide-react';

import { ISpace } from '@/types';
import { SidebarItem } from '../../sidebar-item';
import Link from 'next/link';
import { CreateListModal } from '@/components/modals';
import { ListItem } from '../list-item';

import { ItemSettings, ListItemPlus } from '@/components';

interface SidebarSpaceItemProps {
  space: ISpace;
  isActive?: boolean;
  isCollapsed?: boolean;
}

export type EditState = { id: string | null; isOpen: boolean };

export function SidebarSpaceItem({
  space,
  isActive = false,
  isCollapsed = false,
}: SidebarSpaceItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const hasLists = space.lists && space.lists.length > 0;
  const [editState, setEditState] = useState<EditState | null>(null);
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
          space={space as ISpace}
          icon={space.avatar as keyof typeof icons}
          isActive={isActive}
          editListOpen={editState}
          setEditListOpen={setEditState}
          onExpand={handleExpand}
          isCollapsed={isCollapsed}
          actions={
            !isCollapsed ? (
              <>
                <ItemSettings
                  itemType='space'
                  item={space}
                  setEditListOpen={setEditState}
                  spaceId={space._id}
                />
                <ListItemPlus itemPlusType='space' space={space} />
              </>
            ) : null
          }
        />
      </div>

      {isExpanded && (
        <div className='mt-1 pl-3 space-y-1 w-full overflow-hidden'>
          {hasLists ? (
            space.lists?.map(list => (
              <ListItem
                key={list._id}
                list={list}
                href={`/${space.workspace}/s/${space._id}/l/${list._id}`}
                color={list.color}
                icon={list.icon as keyof typeof icons}
                label={list.name}
                isCollapsed={isCollapsed}
                editState={editState}
                setEditState={setEditState}
                actions={
                  <>
                    <ItemSettings
                      itemType='list'
                      item={list}
                      setEditListOpen={setEditState}
                      spaceId={space._id}
                      listId={list._id}
                    />
                  </>
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
