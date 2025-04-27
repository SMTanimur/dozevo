'use client';

import React from 'react';
import { Plus, Calendar, Flag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge'; // Assuming Badge for color representation

// Placeholder data - replace with actual data fetching later
const listsData = [
  {
    id: '1',
    name: 'jazila',
    color: '#dc2626', // Example red color
    progress: 0, // Progress value (e.g., 0 out of 1)
    tasks: 1, // Total tasks for progress calculation
    startDate: null,
    endDate: null,
    priority: null,
    owner: null,
  },
  // Add more placeholder lists as needed
];

// Placeholder types - define properly later based on API response
interface List {
  id: string;
  name: string;
  color: string | null;
  progress: number;
  tasks: number;
  startDate: string | null;
  endDate: string | null;
  priority: string | null; // Or specific type
  owner: string | null; // Or user object
}

export function ListsTable() {
  return (
    <div className='p-4 md:p-6'>
      <Table>
        <TableHeader>
          <TableRow className='hover:bg-transparent'>
            <TableHead className='w-[250px]'>Name</TableHead>
            <TableHead>Color</TableHead>
            <TableHead className='text-center'>Progress</TableHead>
            <TableHead className='text-center'>Start</TableHead>
            <TableHead className='text-center'>End</TableHead>
            <TableHead className='text-center'>Priority</TableHead>
            <TableHead className='text-center'>Owner</TableHead>
            <TableHead className='text-right'></TableHead>{' '}
            {/* Empty head for potential actions */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {listsData.map((list: List) => (
            <TableRow key={list.id} className='hover:bg-muted/50'>
              <TableCell className='font-medium'>{list.name}</TableCell>
              <TableCell>
                {list.color ? (
                  <Badge
                    className='w-12 h-6 border-none'
                    style={{ backgroundColor: list.color }}
                  >
                    {/* Optionally display color name or just color */}
                  </Badge>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className='text-center'>
                <div className='flex items-center justify-center gap-2'>
                  <Progress
                    value={(list.progress / list.tasks) * 100}
                    className='w-24 h-2'
                  />
                  <span>
                    {list.progress}/{list.tasks}
                  </span>
                </div>
              </TableCell>
              <TableCell className='text-center'>
                {list.startDate ? (
                  list.startDate
                ) : (
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 opacity-50 hover:opacity-100'
                  >
                    <Calendar className='h-4 w-4' />
                  </Button>
                )}
              </TableCell>
              <TableCell className='text-center'>
                {list.endDate ? (
                  list.endDate
                ) : (
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 opacity-50 hover:opacity-100'
                  >
                    <Calendar className='h-4 w-4' />
                  </Button>
                )}
              </TableCell>
              <TableCell className='text-center'>
                {list.priority ? (
                  list.priority // Display priority if exists
                ) : (
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 opacity-50 hover:opacity-100'
                  >
                    <Flag className='h-4 w-4' />
                  </Button>
                )}
              </TableCell>
              <TableCell className='text-center'>
                {list.owner ? (
                  list.owner // Display owner if exists
                ) : (
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 opacity-50 hover:opacity-100'
                  >
                    <User className='h-4 w-4' />
                  </Button>
                )}
              </TableCell>
              <TableCell className='text-right'>
                {/* Placeholder for options like delete/edit */}
              </TableCell>
            </TableRow>
          ))}
          {/* Add New List Row */}
          <TableRow className='hover:bg-transparent'>
            <TableCell colSpan={8}>
              {' '}
              {/* Span across all columns */}
              <Button
                variant='ghost'
                size='sm'
                className='text-muted-foreground hover:text-foreground'
              >
                <Plus className='mr-2 h-4 w-4' />
                New List
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

// Helper component or style adjustment for Progress indicator color
// Add this to your global CSS or a relevant CSS module if needed:
/*
.progress-indicator-dynamic[style*="--indicator-color"] {
  background-color: var(--indicator-color);
}
*/
// Or modify the Progress component directly if using Shadcn UI source
// In ui/progress.tsx, adjust the indicator style like:
/*
 <ProgressPrimitive.Indicator
    className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)}
    style={{ transform: `translateX(-${100 - (value || 0)}%)`, backgroundColor: style?.['--indicator-color'] as string | undefined }}
  />
*/
