import { Card } from '@/components/ui/card';
import { File } from 'lucide-react';

export const DocsCard = () => (
  <Card className='p-4 h-full'>
    <h2 className='text-lg drag-handle font-medium mb-4'>Docs</h2>
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <File className='h-4 w-4 text-gray-500' />
        <span>zdhfh</span>
        <span className='text-gray-500 text-sm'>• in zdhfh</span>
      </div>
      <div className='flex items-center gap-2'>
        <File className='h-4 w-4 text-gray-500' />
        <span>Untitled</span>
        <span className='text-gray-500 text-sm'>• in Doc</span>
      </div>
      <div className='flex items-center gap-2'>
        <File className='h-4 w-4 text-gray-500' />
        <span>Untitled</span>
        <span className='text-gray-500 text-sm'>• in Doc</span>
      </div>
      <div className='flex items-center gap-2'>
        <span className='h-4 w-4 flex items-center justify-center bg-orange-100 text-orange-500 rounded-sm text-xs'>
          😊
        </span>
        <span>Untitled</span>
        <span className='text-gray-500 text-sm'>• in Doc</span>
      </div>
      <div className='flex items-center gap-2'>
        <File className='h-4 w-4 text-gray-500' />
        <span>Untitled</span>
        <span className='text-gray-500 text-sm'>• in Projects</span>
      </div>
      <div className='flex items-center gap-2'>
        <File className='h-4 w-4 text-gray-500' />
        <span>Project 2</span>
        <span className='text-gray-500 text-sm'>• in Projects</span>
      </div>
      <div className='flex items-center gap-2'>
        <File className='h-4 w-4 text-gray-500' />
        <span>Project 1</span>
        <span className='text-gray-500 text-sm'>• in Projects</span>
      </div>
    </div>
  </Card>
);
