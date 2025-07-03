'use client';

import { useState, useEffect } from 'react';
import { CreateWorkspaceModal } from '@/components/modals';
import { Button } from '@/components/ui/button';
import { useGetMe } from '@/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const WorkspacePage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: user, isLoading, isError } = useGetMe();

  useEffect(() => {
    const workspaceCookie = Cookies.get('workspace');

    if (isLoading) {
      return;
    }

    if (isError || !user) {
      console.error('Error fetching user or user not found');
      return;
    }

    if (workspaceCookie && user.activeWorkspace && workspaceCookie === user.activeWorkspace) {
        router.replace(`/${user.activeWorkspace}/home`);
        return;
    }

    if (!user.activeWorkspace || workspaceCookie !== user.activeWorkspace) {
        if(workspaceCookie !== user.activeWorkspace){
            Cookies.remove('workspace');
        }
      setIsModalOpen(true);
    }
    
  }, [user, isLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-80 mb-8" />
        <Skeleton className="h-10 w-48" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
       <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Welcome to Notiqo</h1>
          <p className="text-gray-600">Let&apos;s set up your workspace.</p>
      </div>
      
      <Button onClick={() => setIsModalOpen(true)} className={isModalOpen ? 'hidden' : ''}>
        Create New Workspace
      </Button>

      <CreateWorkspaceModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default WorkspacePage;
