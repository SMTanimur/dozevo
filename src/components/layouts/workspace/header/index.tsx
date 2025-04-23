'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { useGetMe } from '@/hooks';
// import { getInitials } from '@/lib/utils';

export const WorkspaceHeader = () => {
  const { data: user } = useGetMe();

  // Placeholder for workspace data - replace with actual data fetching
  const currentWorkspace = { name: 'Home' };
  const otherWorkspaces = [
    { id: '1', name: 'Project Alpha' },
    { id: '2', name: 'Marketing Team' },
  ];

  return (
    <header className='sticky top-0 left-0 py-2 px-4 bg-white border-b z-10 dark:bg-gray-900 dark:border-gray-700'>
      <div className='flex items-center justify-between'>
        {/* Left Section: User Avatar + Workspace Switcher */}
        <div className='flex items-center gap-3'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='flex items-center gap-2 text-sm font-medium p-1 h-auto'
              >
                <Avatar className='h-7 w-7 text-xs'>
                  <AvatarImage src={user?.avatar || ''} alt={user?.firstName} />
                  <AvatarFallback>
                    {/* {user
                      ? getInitials(`${user.firstName} ${user.lastName}`)
                      : 'U'} */}
                      U
                  </AvatarFallback>
                </Avatar>
                <span className='hidden sm:inline'>
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </span>
                <Icon name='ChevronDown' className='h-4 w-4 opacity-50' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <DropdownMenuLabel>
                {user ? `${user.firstName} ${user.lastName}` : 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Add other user-related actions here */}
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <span className='text-gray-300 dark:text-gray-600'>/</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='flex items-center gap-2 text-sm font-medium p-1 h-auto'
              >
                <Icon name='House' className='h-4 w-4' />
                <span className='hidden sm:inline'>
                  {currentWorkspace.name}
                </span>
                <Icon name='ChevronDown' className='h-4 w-4 opacity-50' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {otherWorkspaces.map(ws => (
                <DropdownMenuItem key={ws.id}>
                  {/* Add logic to switch workspace */}
                  {ws.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>Create Workspace</DropdownMenuItem>{' '}
              {/* Link to modal or page */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Section: Actions */}
        <div className='flex items-center gap-2'>
          <Button
            variant='secondary'
            size='sm'
            className='bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-900/50 dark:text-pink-300 dark:hover:bg-pink-900'
          >
            Manage cards
          </Button>
          <Button variant='ghost' size='icon'>
            <Icon name='Settings' className='h-5 w-5' />
          </Button>
          {/* Add Notifications, Search, etc. here if needed */}
        </div>
      </div>
    </header>
  );
};
