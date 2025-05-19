'use client';

import { Button } from '@/components';
import { GridLayout } from '@/components/home/GridLayout';
import {
  DocsCard,
  RecentCard,
  ResourcesCard,
  WorkloadStatus,
} from '@/components/overview-cards';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetLists } from '@/hooks/list';
import { FileText, MoreHorizontal } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState, useMemo, useEffect } from 'react';

import { useGetTasks } from '@/hooks/task';
import { ListCard } from '@/components/tasks/list-card';
import { ListGroupedStatus } from '@/components/tasks/list-grouped-status';
import { ITask } from '@/types';
import TaskBoardView from '@/components/tasks/task-board-view';

const SpaceScreen = () => {
  const { space_id, w_id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const { data: lists = [] } = useGetLists(w_id as string, space_id as string, {
    enabled: !!w_id && !!space_id,
  });

  // Fetch all tasks for the space (not per-list)
  const { data: allTasksData } = useGetTasks({
    spaceId: space_id as string,
  });

  // Group tasks by listId for fast lookup
  const tasksByList = useMemo(() => {
    const grouped: Record<string, ITask[]> = {};
    if (allTasksData?.data) {
      for (const task of allTasksData.data) {
        if (task.list) {
          if (!grouped[task.list]) grouped[task.list] = [];
          grouped[task.list].push(task);
        }
      }
    }
    return grouped;
  }, [allTasksData]);

  const [selectedBoardListId, setSelectedBoardListId] = useState('');

  useEffect(() => {
    if (lists.length > 0 && !selectedBoardListId) {
      setSelectedBoardListId(lists[0]._id);
    }
  }, [lists, selectedBoardListId]);

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

  return (
    <div className='flex flex-col h-[calc(100vh-4rem)] bg-background'>
      <header className='flex items-center justify-between p-4 border-b'>
        <div className='flex items-center gap-2'>
          <h1 className='text-xl font-semibold'>Team Space</h1>
          <MoreHorizontal className='h-5 w-5 text-gray-500' />
        </div>
        <Button className='bg-pink-500 hover:bg-pink-600'>Add card</Button>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='flex-1'>
        <div className='flex items-center border-b'>
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
          <div className='flex items-center gap-2 mr-4 ml-auto'>
            <Button variant='outline' size='sm' className='gap-2'>
              <svg
                className='h-4 w-4'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M3 6H21'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <path
                  d='M3 12H21'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <path
                  d='M3 18H21'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
              Show
            </Button>
            <Button variant='outline' size='sm' className='gap-2'>
              <svg
                className='h-4 w-4'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6Z'
                  stroke='currentColor'
                  strokeWidth='2'
                />
                <path
                  d='M9 9H15'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <path
                  d='M9 15H15'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <path
                  d='M15 9V15'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
              Customize
            </Button>
          </div>
        </div>

        <ScrollArea className='h-[calc(100vh-12rem)]'>
          <TabsContent value='overview' className='flex-1 p-0 m-0'>
            <GridLayout pageId='overview' key={space_id as string}>
              {['docs', 'recent', 'workload', 'resources'].map(id => (
                <div key={id}>{renderCard(id)}</div>
              ))}
            </GridLayout>
          </TabsContent>
          <TabsContent value='board' className='flex-1 p-5'>
            {lists.length > 0 ? (
              <>
                <select
                  className='mb-4 p-2 border rounded'
                  value={selectedBoardListId}
                  onChange={e => setSelectedBoardListId(e.target.value)}
                >
                  {lists.map(list => (
                    <option key={list._id} value={list._id}>
                      {list.name}
                    </option>
                  ))}
                </select>
                <TaskBoardView
                  workspaceId={w_id as string}
                  spaceId={space_id as string}
                  listId={selectedBoardListId}
                />
              </>
            ) : (
              <div className='p-8 text-gray-400 text-center'>
                No lists found.
              </div>
            )}
          </TabsContent>
          <TabsContent value='list' className='flex-1 p-5'>
            {lists.length > 0 ? (
              lists.map(list => (
                <ListCard key={list._id} list={list} defaultExpanded>
                  <ListGroupedStatus
                    list={list}
                    tasks={tasksByList[list._id] || []}
                  />
                </ListCard>
              ))
            ) : (
              <div className='p-8 text-gray-400 text-center'>
                No lists found.
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default SpaceScreen;
