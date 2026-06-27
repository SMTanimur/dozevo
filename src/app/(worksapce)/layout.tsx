import {
  AppSidebar,
  Setting,
  WorkspaceHeader,
  WorkspaceSidebar,
} from '@/components';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ReactNode } from 'react';

export default function NoteBookLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar>
        <WorkspaceSidebar />
      </AppSidebar>
      <main className='relative h-screen max-w-full flex-1 flex flex-col overflow-hidden'>
        <Setting />
        <WorkspaceHeader />
        <div className='flex-1 min-h-0 w-full overflow-hidden'>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
