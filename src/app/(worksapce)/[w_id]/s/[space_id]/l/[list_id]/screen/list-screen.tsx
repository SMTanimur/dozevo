'use client';

import { Button, TaskDetailView, TaskListView } from '@/components';
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
import React, { useState, useMemo } from 'react';

import TaskBoardView from '@/components/tasks/task-board-view';
import { useGetList, useGetListOverview } from '@/hooks/list';
import { IList } from '@/types';
import { useGetTasks } from '@/hooks/task';
import { ScrollArea } from '@/components/ui/scroll-area';

const ListScreen = () => {
  const { list_id, w_id, space_id } = useParams();
  const [activeTab, setActiveTab] = useState('list');
  const { data: list } = useGetList(
    w_id as string,
    space_id as string,
    list_id as string,
    {
      enabled: !!w_id && !!space_id && !!list_id,
    }
  );

  // Fetch overview data
  const { data: overviewData } = useGetListOverview(
    {
      workspaceId: w_id as string,
      spaceId: space_id as string,
      listId: list_id as string,
    },
    { enabled: !!w_id && !!space_id && !!list_id }
  );

  // Memoize the filters to prevent unnecessary re-renders
  const filters = useMemo(
    () => ({
      limit: 10,
    }),
    []
  );

  const { data: tasks } = useGetTasks({
    spaceId: space_id as string,
    listId: list_id as string,
    filters,
  });

  // Memoize the tasks data to prevent unnecessary re-renders
  const memoizedTasks = useMemo(() => tasks?.data || [], [tasks?.data]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const renderCard = (id: string) => {
    switch (id) {
      case 'docs':
        return <DocsCard />;
      case 'recent':
        return <RecentCard recentTasks={overviewData?.recentTasks} />;
      case 'workload':
        return (
          <WorkloadStatus workloadByStatus={overviewData?.workloadByStatus} />
        );
      case 'resources':
        return <ResourcesCard />;
      default:
        return null;
    }
  };

  const listName = list?.name || 'Loading...';

  return (
    <>
      <div className='flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-background'>
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
            <TabsList className='h-12 bg-transparent border-b-0 p-0 ml-4'>
              <TabsTrigger
                value='overview'
                className='data-[state=active]:border-b-2  data-[state=active]:border-l-0 data-[state=active]:border-t-0 data-[state=active]:border-r-0 data-[state=active]:border-gray-900 data-[state=active]:shadow-none rounded-none h-12 px-4'
              >
                <FileText className='h-4 w-4 mr-2' /> Overview
              </TabsTrigger>
              <TabsTrigger
                value='board'
                className='data-[state=active]:border-b-2  data-[state=active]:border-l-0 data-[state=active]:border-t-0 data-[state=active]:border-r-0 data-[state=active]:border-gray-900 data-[state=active]:shadow-none rounded-none h-12 px-4'
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
                value='list'
                className='data-[state=active]:border-b-2  data-[state=active]:border-l-0 data-[state=active]:border-t-0 data-[state=active]:border-r-0 data-[state=active]:border-gray-900 data-[state=active]:shadow-none rounded-none h-12 px-4'
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
                value='calendar'
                className='data-[state=active]:border-b-2  data-[state=active]:border-l-0 data-[state=active]:border-t-0 data-[state=active]:border-r-0 data-[state=active]:border-gray-900 data-[state=active]:shadow-none rounded-none h-12 px-4'
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
            <ScrollArea className='h-[calc(100vh-10rem)]'>
              <div className='p-4'>
                <GridLayout pageId='overview' key={list_id as string}>
                  {['docs', 'recent', 'workload', 'resources'].map(id => (
                    <div key={id}>{renderCard(id)}</div>
                  ))}
                </GridLayout>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value='list' className='flex-1 p-0 m-0 overflow-hidden'>
            <TaskListView
              key={`${list_id}-${memoizedTasks.length}`}
              list={list as IList}
              tasks={memoizedTasks}
            />
          </TabsContent>
          <TabsContent value='board' className='flex-1 p-0 m-0 overflow-hidden'>
            <TaskBoardView
              workspaceId={w_id as string}
              spaceId={space_id as string}
              listId={list_id as string}
            />
          </TabsContent>
          <TabsContent value='calendar' className='flex-1 p-4 m-0'>
            <div>Calendar View Coming Soon...</div>
          </TabsContent>
        </Tabs>
      </div>

      <TaskDetailView />
    </>
  );
};

export default ListScreen;
