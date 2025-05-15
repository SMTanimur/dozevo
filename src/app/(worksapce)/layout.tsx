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
      <main className='relative h-full max-w-full  flex-1 '>
        <Setting />
        <WorkspaceHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}
