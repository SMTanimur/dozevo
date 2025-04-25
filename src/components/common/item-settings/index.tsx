'use client';

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { cn } from '@/lib';
import { IList, ISpace } from '@/types';
import {
  Pencil,
  Plus,
  Palette,
  Settings,
  Copy,
  Archive,
  Trash2,
  Share2,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import React, { useState } from 'react';
import { ColorIconPicker } from '../color-icon-picker';
import { useSpaceMutations } from '@/hooks';
import { useListMutations } from '@/hooks/list';
import { useParams } from 'next/navigation';

interface ItemSettingsProps {
  itemType: 'space' | 'list';
  spaceId?: string;
  item: ISpace | IList;
}

export const ItemSettings = ({
  itemType,
  item,
  spaceId,
}: ItemSettingsProps) => {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const { w_id } = useParams();
  const { updateSpace } = useSpaceMutations();
  const { updateList } = useListMutations();

  const handleColorChange = (color: string) => {
    if (itemType === 'space') {
      updateSpace({
        spaceId: item._id,
        data: { color: color },
        workspaceId: item.workspace,
      });
    } else if (itemType === 'list') {
      updateList({
        listId: item._id,
        spaceId: spaceId as string,
        data: { color: color },
        workspaceId: w_id as string,
      });
    }
  };

  const handleIconChange = (icon: string) => {
    if (itemType === 'space') {
      updateSpace({
        spaceId: item._id,
        data: { avatar: icon },
        workspaceId: item.workspace,
      });
    } else if (itemType === 'list') {
      updateList({
        listId: item._id,
        spaceId: spaceId as string,
        data: { icon: icon },
        workspaceId: w_id as string,
      });
    }
  };

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
              itemType === 'space'
                ? 'Space setting'
                : itemType === 'list'
                ? 'List setting'
                : 'Setting'
            }
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <MoreHorizontal className='h-3 w-3' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-64 p-0' align='start'>
          <div className='flex flex-col'>
            <div className='px-3 pt-2'>
              <MenuItem icon={<Pencil className='h-4 w-4' />} label='Rename' />
            </div>

            <div className='h-px bg-gray-200 my-2' />
            <div className='px-3'>
              <MenuItemWithSubmenu
                icon={<Plus className='h-4 w-4' />}
                label='Create new'
              />

              <MenuItemWithSubmenu
                icon={<Palette className='h-4 w-4' />}
                label='Color & Icon'
                onOpenChange={setColorPickerOpen}
                open={colorPickerOpen}
                submenuContent={
                  <ColorIconPicker
                    initialColor={item.color as string}
                    initialIcon={
                      itemType === 'space'
                        ? (item as ISpace).avatar
                        : (item as IList).icon
                    }
                    onColorChange={handleColorChange}
                    onIconChange={handleIconChange}
                    onClose={() => setColorPickerOpen(false)}
                    item={item}
                  />
                }
              />

              <MenuItemWithSubmenu
                icon={<Settings className='h-4 w-4' />}
                label='Space settings'
              />

              <div className='h-px bg-gray-200 my-2' />

              <MenuItem icon={<Copy className='h-4 w-4' />} label='Duplicate' />
              <MenuItem
                icon={<Archive className='h-4 w-4' />}
                label='Archive'
              />
              <MenuItem
                icon={<Trash2 className='h-4 w-4 text-red-500' />}
                label='Delete'
                labelClassName='text-red-500'
              />
            </div>
            <div className='h-px bg-gray-200 my-2' />

            <Button className='w-full h-10 bg-pink-500 hover:bg-pink-600 text-white rounded-none rounded-b-lg flex items-center justify-center gap-2'>
              <Share2 className='h-4 w-4' />
              Sharing & Permissions
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  labelClassName?: string;
}

function MenuItem({ icon, label, onClick, labelClassName }: MenuItemProps) {
  return (
    <button
      className='flex rounded-lg items-center gap-2 px-2 py-2 hover:bg-gray-100 w-full text-left transition-colors'
      onClick={onClick}
    >
      <span className='w-5'>{icon}</span>
      <span className={cn('text-sm', labelClassName)}>{label}</span>
    </button>
  );
}

interface MenuItemWithSubmenuProps extends MenuItemProps {
  submenuContent?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function MenuItemWithSubmenu({
  icon,
  label,
  onClick,
  submenuContent,
  open,
  onOpenChange,
}: MenuItemWithSubmenuProps) {
  const controlledProps =
    open !== undefined && onOpenChange ? { open, onOpenChange } : {};

  return (
    <Popover {...controlledProps}>
      <PopoverTrigger asChild>
        <button
          className='flex rounded-lg  items-center justify-between px-2 py-2 hover:bg-gray-100 w-full text-left transition-colors'
          onClick={e => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          <div className='flex items-center gap-2'>
            <span className='w-5'>{icon}</span>
            <span className='text-sm'>{label}</span>
          </div>
          <ChevronRight className='h-4 w-4 text-gray-400' />
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-[280px] p-0' align='start' side='right'>
        {submenuContent || <div className='p-4'>Submenu content</div>}
      </PopoverContent>
    </Popover>
  );
}
