'use client';

import {
  ChevronDown,
  Home,
  Inbox,
  FileText,
  Plus,
  LayoutGrid,
  BookMarked,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';

// Placeholder data for spaces - replace with actual data fetching
const spaces = [
  { id: '1', name: 'Everything', icon: LayoutGrid },
  { id: '2', name: 'My Space', icon: BookMarked },
  { id: '3', name: 'List', icon: List },
];

// Placeholder for user data - replace with useGetMe or similar
const userData = {
  name: 'Tanimur Rahman',
  email: 'tanimur@example.com',
  avatarUrl: '/avatars/01.png',
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('');
};

export function WorkspaceSidebar() {
  // TODO: Replace with actual logic to get active path
  const isActive = (path: string) => path === '/workspace/home'; // Example active state

  return (
    <Sidebar>
      <SidebarHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='w-full justify-start px-2'>
              <Avatar className='mr-2 h-6 w-6'>
                <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                <AvatarFallback>{getInitials(userData.name)}</AvatarFallback>
              </Avatar>
              <span className='truncate'>{userData.name}&apos;s Workspace</span>
              <ChevronDown className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='w-[200px]'>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarContent className='flex-1'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuSubButton
              href='/workspace/home'
              isActive={isActive('/workspace/home')}
              className='gap-2'
            >
              <Home className='h-4 w-4' />
              Home
            </SidebarMenuSubButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuSubButton
              href='/workspace/inbox'
              isActive={isActive('/workspace/inbox')}
              className='gap-2'
            >
              <Inbox className='h-4 w-4' />
              Inbox
            </SidebarMenuSubButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuSubButton
              href='/workspace/docs'
              isActive={isActive('/workspace/docs')}
              className='gap-2'
            >
              <FileText className='h-4 w-4' />
              Docs
            </SidebarMenuSubButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className='mt-4 px-3 py-2'>
          <h2 className='mb-2 px-1 text-lg font-semibold tracking-tight'>
            Favorites
          </h2>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuSubButton href='#' className='gap-2'>
                <BookMarked className='h-4 w-4' />
                Favorite Item 1
              </SidebarMenuSubButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuSubButton href='#' className='gap-2'>
                <BookMarked className='h-4 w-4' />
                Favorite Item 2
              </SidebarMenuSubButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        <div className='mt-4 px-3 py-2'>
          <h2 className='mb-2 px-1 text-lg font-semibold tracking-tight'>
            Spaces
          </h2>
          <SidebarMenu>
            {spaces.map(space => (
              <SidebarMenuItem key={space.id}>
                <SidebarMenuSubButton
                  href={`/workspace/space/${space.id}`}
                  isActive={isActive(`/workspace/space/${space.id}`)}
                  className='gap-2'
                >
                  <space.icon className='h-4 w-4' />
                  {space.name}
                </SidebarMenuSubButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <Button variant='ghost' className='w-full justify-start'>
          <Plus className='mr-2 h-4 w-4' /> Create Space
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
