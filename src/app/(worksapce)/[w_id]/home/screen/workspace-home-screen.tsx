'use client'

import { DashboardOverview } from '@/components/overview-cards'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGetDashboard } from '@/hooks'
import React from 'react'


type WorkspaceHomeScreenProps = {
  w_id: string
}

export const WorkspaceHomeScreen = ({ w_id }: WorkspaceHomeScreenProps) => {
 
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
  )
}


