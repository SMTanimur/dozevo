'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';

import React from 'react';

import { X } from 'lucide-react';
import { cn } from '@/lib';
import Image from 'next/image';
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
      <SidebarHeader
        className={cn(
          'flex !flex-row items-center justify-between  border-b',
          open ? 'py-1.5' : '!py-3.5'
        )}
      >
        <SidebarMenu>
          <SidebarMenuButton
            size='lg'
            className='data-[state=open]:bg-sidebar-accent '
          >
            <div
              className={cn(
                'flex aspect-square size-8 items-center justify-center  rounded-lg  '
              )}
            >
              <Image src='/logo.svg' alt='Logo' width={40} height={40} />
            </div>
            <div
              className={cn(
                'grid flex-1 text-left text-sm leading-tight ',
                !open && 'hidden'
              )}
            >
              <span className='truncate text-primaryBlack font-semibold text-xl'>
                <Link href={'/'}>Workbook</Link>
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenu>

        {open && <SidebarTrigger className='-ml-1' />}
      </SidebarHeader>
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
