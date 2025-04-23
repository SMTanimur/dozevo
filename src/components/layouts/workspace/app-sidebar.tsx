'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';


import React from 'react';

import { X } from 'lucide-react';

import { Card } from '@/components/ui';

const AppSidebar = ({
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  collapsible,
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { open } = useSidebar();
  const [popoverOpen, setPopoverOpen] = React.useState(true);

  return (
    <Sidebar collapsible='icon' {...props} className='!p-0'>
      <SidebarContent>{children}</SidebarContent>
      <SidebarFooter>
        {popoverOpen && open && (
          <SidebarMenu>
            <Card className='bg-secondary p-4 rounded-md flex items-start gap-2.5 '>
              <div className='flex flex-col flex-1 gap-4'>
                <h3 className='text-sm text-gray-950'>New Feature</h3>
                <p className='text-gray-500 text-sm font-normal'>
                  You can now select a specific section of a UI to make changes
                  to
                </p>
              </div>
              <button
                className='text-gray-950'
                onClick={() => setPopoverOpen(false)}
              >
                <X className='size-5 ' />
              </button>
            </Card>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export { AppSidebar };
