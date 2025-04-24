'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  Home,
  Inbox,
  FileText,
  Plus,
  Settings,
  ChevronUp,
  Users,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { useGetSpaces, useGetWorkspace, useGetWorkspaces } from '@/hooks';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib';
import { SidebarSection } from '../../sidebar-section';
import { SidebarSpaceItem } from '../sidebar-space-item';
import { CreateSpaceModal } from '@/components/modals';

const getInitials = (name: string) => {
  return String(name)
    .split(' ')
    .map(n => n[0])
    .join('');
};

export function WorkspaceSidebar() {
  // TODO: Replace with actual logic to get active path
  const { w_id } = useParams();
  const isActive = (path: string) => path === `/${w_id}/home`; // Example active state
  const router = useRouter();
  const { data: workspace } = useGetWorkspace(w_id as string);
  const { data: spaces } = useGetSpaces(w_id as string, {
    enabled: !!w_id,
  });
  const { data: workspaces } = useGetWorkspaces();
  const { open } = useSidebar();
  const otherWorkspaces = workspaces?.filter(ws => ws._id !== w_id);

  // State for controlling the Create Space modal
  const [isCreateSpaceModalOpen, setIsCreateSpaceModalOpen] = useState(false);

  return (
    <>
      <Sidebar
        collapsible='icon'
        className='!flex !flex-col !justify-between h-screen'
      >
        <div>
          <SidebarHeader className='pl-3 pr-2 py-2 !flex !flex-row items-center justify-between border-b'>
            <SidebarMenu className='flex flex-row items-center justify-between'>
              <Popover>
                <PopoverTrigger asChild>
                  <SidebarMenuButton
                    size='lg'
                    className='data-[state=open]:bg-sidebar-accent justify-start w-[190px] px-2 h-auto py-1.5 '
                  >
                    <Avatar className=' h-6 w-6 !bg-cyan-600 !text-sm !rounded-lg'>
                      <AvatarImage
                        src={workspace?.avatar as string}
                        alt={workspace?.name as string}
                      />
                      <AvatarFallback className='!bg-cyan-600 text-white !text-sm'>
                        {getInitials(workspace?.name as string)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        open ? 'block font-medium truncate' : 'hidden'
                      )}
                    >
                      {workspace?.name}
                    </span>
                    <ChevronDown className='ml-auto h-4 w-4 opacity-50' />
                  </SidebarMenuButton>
                </PopoverTrigger>
                <PopoverContent
                  align={open ? 'start' : 'end'}
                  side={open ? 'bottom' : 'right'}
                  className='w-80 p-0'
                >
                  <div className='p-4'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={workspace?.avatar as string}
                          alt={workspace?.name as string}
                        />
                        <AvatarFallback>
                          {getInitials(workspace?.name as string)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-semibold'>{workspace?.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className='border-t'>
                    <SidebarMenu className='px-2 py-2'>
                      <SidebarMenuItem className='h-auto p-0'>
                        <Link
                          href='#'
                          className='flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted'
                        >
                          <Settings className='h-4 w-4' />
                          Settings
                        </Link>
                      </SidebarMenuItem>
                      <SidebarMenuItem className='h-auto p-0'>
                        <Link
                          href='#'
                          className='flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted'
                        >
                          <ChevronUp className='h-4 w-4' /> Upgrade
                        </Link>
                      </SidebarMenuItem>
                      <SidebarMenuItem className='h-auto p-0'>
                        <Link
                          href='#'
                          className='flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted'
                        >
                          <Users className='h-4 w-4' /> Manage users
                        </Link>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </div>
                  <div className='border-t px-4 py-2'>
                    <div className='mb-2 flex items-center justify-between'>
                      <h3 className='text-sm font-medium text-muted-foreground'>
                        Switch Workspaces
                      </h3>
                      <Button variant='ghost' size='icon' className='h-6 w-6'>
                        <Search className='h-4 w-4' />
                      </Button>
                    </div>
                    <div className='max-h-40 space-y-1 overflow-y-auto'>
                      {otherWorkspaces?.map(ws => (
                        <Button
                          key={ws._id}
                          variant='ghost'
                          className='flex h-auto w-full items-center justify-start gap-2 px-2 py-1.5'
                        >
                          <Avatar className='h-6 w-6 text-xs'>
                            <AvatarFallback>
                              {getInitials(ws.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex flex-col items-start'>
                            <span className='text-sm font-medium'>
                              {ws.name}
                            </span>
                            <span className='text-xs text-muted-foreground'>
                              {ws.workspaceType}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className='border-t p-2'>
                    <Button
                      variant='ghost'
                      className='w-full justify-start gap-2'
                    >
                      <Plus className='h-4 w-4' /> Create Workspace
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {open && (
                <div className='flex items-center gap-2'>
                  <SidebarTrigger />
                </div>
              )}
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent className={cn(open ? 'px-3 py-2 pr-2' : 'px-2 py-2')}>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip='Home'
                  onClick={() => router.push(`/${w_id}/home`)}
                  isActive={isActive(`/${w_id}/home`)}
                  className='gap-2 justify-start'
                >
                  <Home className='h-4 w-4' />
                  {open && <span>Home</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip='Inbox'
                  onClick={() => router.push(`/${w_id}/inbox`)}
                  isActive={isActive(`/${w_id}/inbox`)}
                  className='gap-2'
                >
                  <Inbox className='h-4 w-4' />
                  {open && <span>Inbox</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip='Docs'
                  onClick={() => router.push(`/${w_id}/docs`)}
                  isActive={isActive(`/${w_id}/docs`)}
                  className='gap-2'
                >
                  <FileText className='h-4 w-4' />
                  {open && <span>Docs</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip='Whiteboard'
                  onClick={() => router.push(`/${w_id}/whiteboard`)}
                  isActive={isActive(`/${w_id}/whiteboard`)}
                  className='gap-2'
                >
                  <FileText className='h-4 w-4' />
                  {open && <span>Whiteboard</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </div>

        {/* Spaces section */}

        <SidebarSection title='Spaces'>
          {spaces?.map(space => (
            <SidebarSpaceItem
              key={space._id}
              space={space}
              isActive={isActive(`/${w_id}/s/${space._id}`)}
              isCollapsed={!open}
            />
          ))}

          <Button
            variant='ghost'
            className='w-full cursor-pointer justify-start gap-2'
            onClick={() => setIsCreateSpaceModalOpen(true)}
          >
            <Plus className='h-4 w-4' /> {open && 'Create Space'}
          </Button>
        </SidebarSection>
      </Sidebar>

      {/* Modal rendering (outside the main Sidebar structure if needed, or inside if portal handles it) */}
      <CreateSpaceModal
        isOpen={isCreateSpaceModalOpen}
        onClose={() => setIsCreateSpaceModalOpen(false)}
      />
    </>
  );
}
