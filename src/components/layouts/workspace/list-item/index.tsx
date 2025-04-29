'use client';

import { ReactNode, useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

import { Icon, Input } from '@/components/ui';
import { icons } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { IList } from '@/types';
import { EditState } from '@/components';
import { useListMutations } from '@/hooks/list';

interface ListItemProps {
  href: string;
  icon: keyof typeof icons;
  label: string;
  color: string;
  list: IList;
  isActive?: boolean;
  isCollapsed?: boolean;
  indent?: boolean;
  variant?: 'default' | 'accent';
  actions?: ReactNode;
  editState?: EditState | null;
  setEditState?: React.Dispatch<React.SetStateAction<EditState | null>>;
}

export function ListItem({
  href,
  icon,
  label,
  color,
  list,
  isActive = false,
  isCollapsed = false,
  variant = 'default',
  actions,
  editState,
  setEditState,
}: ListItemProps) {
  const router = useRouter();
  const params = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editedName, setEditedName] = useState(label);
  const { updateList } = useListMutations();

  useEffect(() => {
    setEditedName(label);
  }, [label]);

  const handleUpdateAndClose = useCallback(() => {
    const workspaceId = params.w_id as string;
    const spaceId = list.space;
    const listId = list._id;

    if (
      setEditState &&
      editedName.trim() !== label &&
      editedName.trim() !== '' &&
      workspaceId &&
      spaceId
    ) {
      updateList({
        workspaceId,
        spaceId,
        listId,
        data: { name: editedName.trim() },
      });
    } else {
      setEditedName(label);
    }
    setEditState?.(null);
  }, [
    editedName,
    label,
    list._id,
    list.space,
    params.w_id,
    setEditState,
    updateList,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editState?.id === list._id &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        handleUpdateAndClose();
      }
    };

    if (editState?.id === list._id) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editState, list._id, inputRef, handleUpdateAndClose]);

  const IconComponent = () => {
    if (icon) {
      return (
        <Icon
          name={icon as keyof typeof icons}
          className={`h-3 w-3 text-${color}`}
          style={{ color: color }}
        />
      );
    }
    return (
      <Icon
        name='List'
        className={`h-4 w-4 !text-${color}`}
        style={{ color: color }}
      />
    );
  };

  const isEditing = editState?.id === list._id;

  return (
    <div
      className={cn(
        'flex w-full items-center group gap-2 overflow-hidden rounded-md px-3 py-2 text-sm font-medium transition-colors',
        !isEditing && 'hover:bg-muted',
        isActive && variant === 'default' && 'bg-muted text-foreground',
        isActive &&
          variant === 'accent' &&
          'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
        isEditing && 'bg-transparent border border-border'
      )}
      onClick={() => {
        if (!isEditing) {
          router.push(href);
        }
      }}
    >
      {isEditing ? (
        <div className='flex items-center gap-2 w-full'>
          <Input
            ref={inputRef}
            type='text'
            value={editedName}
            className='w-full h-8'
            onChange={e => setEditedName(e.target.value)}
            onBlur={handleUpdateAndClose}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleUpdateAndClose();
              }
              if (e.key === 'Escape') {
                setEditedName(label);
                setEditState?.(null);
              }
            }}
            autoFocus
          />
        </div>
      ) : (
        <>
          <div className='flex shrink-0 items-center gap-2 justify-center'>
            <div className='flex h-6 w-6 items-center justify-center rounded-sm hover:bg-gray-200'>
              <IconComponent />
            </div>
            <span className='truncate'>{label}</span>
          </div>

          {!isCollapsed && (
            <>
              {actions && (
                <div className={cn('ml-auto items-center gap-1')}>
                  {actions}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
