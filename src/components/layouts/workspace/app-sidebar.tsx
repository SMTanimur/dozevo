'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';


import React from 'react';

import { HelpCircle, Users} from 'lucide-react';


import { cn } from '@/lib';

const AppSidebar = ({
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  collapsible,
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { open } = useSidebar();


  return (
    <Sidebar collapsible='icon' {...props} className='!p-0'>
      <SidebarContent>{children}</SidebarContent>
      
      <SidebarFooter
        className={cn(
          open
            ? 'flex flex-row items-center gap-2 px-3 py-2 border-t'
            : 'flex flex-col items-center gap-2 px-2 py-2 border-t'
        )}
      >
        <SidebarMenuButton tooltip='Invite' className='gap-2'>
          <Users className='h-4 w-4' />
          {open && <span>Invite</span>}
        </SidebarMenuButton>
        <SidebarMenuButton tooltip='Help' className='gap-2'>
          <HelpCircle className='h-4 w-4' />
          {open && <span>Help</span>}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export { AppSidebar };
