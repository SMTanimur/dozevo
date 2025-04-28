'use client';

import { Button } from '@/components';
import { GridLayout } from '@/components/home/GridLayout';
import {
  DocsCard,
  RecentCard,
  ResourcesCard,
  WorkloadStatus,
} from '@/components/overview-cards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, MoreHorizontal } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { BoardView, ListView } from '@/components/views';
import { TaskDetailModal } from '@/components/tasks';

const ListScreen = () => {
  const { list_id } = useParams();
  const [activeTab, setActiveTab] = useState('list');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleCloseModal = () => {
    setSelectedTaskId(null);
  };

  const renderCard = (id: string) => {
    switch (id) {
      case 'docs':
        return <DocsCard />;
      case 'recent':
        return <RecentCard />;
      case 'workload':
        return <WorkloadStatus />;
      case 'resources':
        return <ResourcesCard />;
      default:
        return null;
    }
  };

  const listName = 'List Name Placeholder';

  return (
    <>
      <div className='flex flex-col h-[calc(100vh-4rem)] bg-background'>
        <header className='flex items-center justify-between p-4 border-b'>
          <div className='flex items-center gap-2'>
            <h1 className='text-xl font-semibold'>{listName}</h1>
            <MoreHorizontal className='h-5 w-5 text-gray-500 cursor-pointer' />
          </div>
          <Button className='bg-primary hover:bg-primary/90'>Add Task</Button>
        </header>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className='flex-1 flex flex-col'
        >
          <div className='flex items-center border-b px-4'>
            <TabsList className='h-12 bg-transparent border-b-0 p-0'>
              <TabsTrigger
                value='overview'
                className='data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none h-12 px-4 text-muted-foreground'
              >
                <FileText className='h-4 w-4 mr-2' /> Overview
              </TabsTrigger>
              <TabsTrigger
                value='list'
                className='data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none h-12 px-4 text-muted-foreground'
              >
                <svg
                  className='h-4 w-4 mr-2'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M8 6H21'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                  <path
                    d='M8 12H21'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                  <path
                    d='M8 18H21'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                  <path
                    d='M3 6H3.01'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                  <path
                    d='M3 12H3.01'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                  <path
                    d='M3 18H3.01'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                </svg>
                List
              </TabsTrigger>
              <TabsTrigger
                value='board'
                className='data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none h-12 px-4 text-muted-foreground'
              >
                <svg
                  className='h-4 w-4 mr-2'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <rect
                    x='3'
                    y='3'
                    width='7'
                    height='7'
                    rx='1'
                    stroke='currentColor'
                    strokeWidth='2'
                  />
                  <rect
                    x='14'
                    y='3'
                    width='7'
                    height='7'
                    rx='1'
                    stroke='currentColor'
                    strokeWidth='2'
                  />
                  <rect
                    x='3'
                    y='14'
                    width='7'
                    height='7'
                    rx='1'
                    stroke='currentColor'
                    strokeWidth='2'
                  />
                  <rect
                    x='14'
                    y='14'
                    width='7'
                    height='7'
                    rx='1'
                    stroke='currentColor'
                    strokeWidth='2'
                  />
                </svg>
                Board
              </TabsTrigger>
              <TabsTrigger
                value='calendar'
                className='data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none h-12 px-4 text-muted-foreground'
              >
                <svg
                  className='h-4 w-4 mr-2'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <rect
                    x='3'
                    y='4'
                    width='18'
                    height='18'
                    rx='2'
                    stroke='currentColor'
                    strokeWidth='2'
                  />
                  <path
                    d='M16 2V6'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                  <path
                    d='M8 2V6'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                  <path d='M3 10H21' stroke='currentColor' strokeWidth='2' />
                </svg>
                Calendar
              </TabsTrigger>
            </TabsList>
            <div className='flex items-center gap-2 ml-auto'>
              <Button variant='outline' size='sm' className='gap-2'>
                <svg
                  className='h-4 w-4'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <polygon points='22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3'></polygon>
                </svg>
                Filter
              </Button>
              <Button variant='outline' size='sm' className='gap-2'>
                <svg
                  className='h-4 w-4'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M3 6h4l-2 2-2-2zM7 6h14' />
                  <path d='M3 12h4l-2 2-2-2zM7 12h14' />
                  <path d='M3 18h4l-2 2-2-2zM7 18h14' />
                </svg>
                Sort
              </Button>
            </div>
          </div>

          <TabsContent
            value='overview'
            className='flex-1 p-0 m-0 overflow-auto'
          >
            <GridLayout pageId='overview' key={list_id as string}>
              {['docs', 'recent', 'workload', 'resources'].map(id => (
                <div key={id}>{renderCard(id)}</div>
              ))}
            </GridLayout>
          </TabsContent>
          <TabsContent value='list' className='flex-1 p-0 m-0 overflow-hidden'>
            <ListView onTaskClick={handleTaskClick} />
          </TabsContent>
          <TabsContent value='board' className='flex-1 p-0 m-0 overflow-hidden'>
            <BoardView onTaskClick={handleTaskClick} />
          </TabsContent>
          <TabsContent value='calendar' className='flex-1 p-4 m-0'>
            <div>Calendar View Coming Soon...</div>
          </TabsContent>
        </Tabs>
      </div>

      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={!!selectedTaskId}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ListScreen;
