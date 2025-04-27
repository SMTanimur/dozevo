import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UploadCloud, GripVertical } from 'lucide-react';

export const ResourcesCard = () => (
  <Card className='h-full flex flex-col'>
    <CardHeader className='flex drag-handle flex-row items-center justify-between space-y-0 pb-2 px-4 pt-3'>
      <CardTitle className='text-sm font-medium'>Resources</CardTitle>
      <div className='drag-handle cursor-grab text-muted-foreground hover:text-foreground transition-colors p-1 -m-1 rounded'>
        <GripVertical className='h-5 w-5' />
      </div>
    </CardHeader>
    <CardContent className='flex-grow p-4'>
      {/* Placeholder - Actual dropzone implementation needed */}
      <div className='flex justify-center items-center h-full border-2 border-dashed border-muted rounded-md p-8 text-muted-foreground'>
        <UploadCloud className='h-8 w-8 mr-2' />
        <span>Drop files here to attach</span>
      </div>
    </CardContent>
  </Card>
);
