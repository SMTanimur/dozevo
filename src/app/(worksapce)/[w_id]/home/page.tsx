'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { DashboardOverview } from '@/components/overview-cards';
import { useGetDashboard } from '@/hooks/dashboard';
import { ScrollArea } from '@/components/ui/scroll-area';

const WorkspaceHome = () => {
  const { w_id } = useParams();
  const { data, isLoading } = useGetDashboard(w_id as string, {
    enabled: !!w_id,
  });

  return (
    <div className='flex flex-col h-[calc(100vh-4rem)] bg-background'>
      <header className='flex items-center justify-between p-4 border-b'>
        <div className='flex items-center gap-2'>
          <h1 className='text-xl font-semibold'>Workspace Overview</h1>
        </div>
      </header>

      <ScrollArea className='flex-1 p-6'>
        <DashboardOverview data={data} isLoading={isLoading} />
      </ScrollArea>
    </div>
  );
};

export default WorkspaceHome;
