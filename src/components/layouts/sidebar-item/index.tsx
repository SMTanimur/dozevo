'use client';

import { ReactNode, useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Icon, Input } from '@/components/ui';
import { icons } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSpaceMutations } from '@/hooks';
import { ISpace } from '@/types';
import { EditState } from '@/components/layouts/workspace/sidebar-space-item';

export interface SidebarItemProps {
  href: string;
  icon: keyof typeof icons;
  space: ISpace;
  editListOpen?: EditState | null;
  setEditListOpen?: React.Dispatch<React.SetStateAction<EditState | null>>;
  isActive?: boolean;
  isCollapsed?: boolean;
  onExpand?: () => void;
  indent?: boolean;
  variant?: 'default' | 'accent';
  actions?: ReactNode;
}

export function SidebarItem({
  href,
  icon,
  space,
  editListOpen,
  setEditListOpen,
  isActive = false,
  isCollapsed = false,
  indent = false,
  onExpand,
  variant = 'default',
  actions,
}: SidebarItemProps) {
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();
  const [editedName, setEditedName] = useState(space.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const { updateSpace } = useSpaceMutations();

  const handleUpdateAndClose = useCallback(() => {
    if (
      setEditListOpen &&
      editedName.trim() !== space.name &&
      editedName.trim() !== ''
    ) {
      updateSpace({
        data: { name: editedName.trim() },
        workspaceId: space.workspace,
        spaceId: space._id,
      });
    } else {
      setEditedName(space.name);
    }
    if (setEditListOpen) {
      setEditListOpen(null);
    }
  }, [
    editedName,
    space.name,
    space._id,
    space.workspace,
    setEditListOpen,
    updateSpace,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editListOpen?.id === space._id &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        handleUpdateAndClose();
      }
    };

    if (editListOpen?.id === space._id) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editListOpen, space._id, inputRef, handleUpdateAndClose]);

  const IconComponent = () => {
    if (icon) {
      return (
        <Icon
          name={icon as keyof typeof icons}
          className='h-3 w-3 text-white'
        />
      );
    }
    return (
      <span className='text-xs text-white'>
        {space.name.charAt(0).toUpperCase()}
      </span>
    );
  };

  const item = (
    <div
      className={cn(
        'group flex w-full cursor-pointer z-50 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted',
        isActive && variant === 'default' && 'bg-muted text-foreground',
        isActive &&
          variant === 'accent' &&
          'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
        indent && !isCollapsed && 'ml-4',
        editListOpen?.id === space._id && 'bg-transparent border border-border'
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => {
        if (!editListOpen && onExpand) {
          router.push(href);
          onExpand();
        }
      }}
    >
      <div className='flex items-center gap-2 shrink-0 group  justify-center'>
        {editListOpen?.id !== space._id && isHovering ? (
          <Icon
            name='ChevronDown'
            className='h-6 w-6'
            onClick={e => {
              e.stopPropagation();
              onExpand?.();
            }}
          />
        ) : (
          <div
            className='flex h-6 w-6   items-center justify-center rounded-sm'
            style={{ backgroundColor: space.color ? space.color : '#ec4899' }}
          >
            <IconComponent />
          </div>
        )}
        {editListOpen?.id !== space._id && (
          <span className='truncate'>{space.name}</span>
        )}
      </div>

      {!isCollapsed && editListOpen?.id !== space._id && (
        <>
          {actions && (
            <div className='ml-auto flex items-center gap-1'>{actions}</div>
          )}
        </>
      )}
      {editListOpen?.id === space._id && (
        <div className='ml-auto flex w-full items-center gap-1'>
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
                setEditedName(space.name);
                if (setEditListOpen)
                  setEditListOpen({ id: null, isOpen: false });
              }
            }}
            autoFocus
          />
        </div>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{item}</TooltipTrigger>
          <TooltipContent
            side='right'
            align='start'
            className='flex items-center gap-2'
          >
            {space.name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return item;
}
