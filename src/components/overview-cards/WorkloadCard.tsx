import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, GripVertical } from 'lucide-react';

export const WorkloadCard = () => (
  <Card className='h-full flex flex-col'>
    <CardHeader className='flex drag-handle flex-row items-center justify-between space-y-0 pb-2 px-4 pt-3'>
      <CardTitle className='text-sm font-medium'>Workload by Status</CardTitle>
      <div className='drag-handle cursor-grab text-muted-foreground hover:text-foreground transition-colors p-1 -m-1 rounded'>
        <GripVertical className='h-5 w-5' />
      </div>
    </CardHeader>
    <CardContent className='flex-grow p-4'>
      {/* Placeholder - Actual chart implementation needed */}
      <div className='flex justify-center items-center h-full text-muted-foreground'>
        <PieChart className='h-16 w-16' />
        <span className='ml-2'>Pie Chart Placeholder</span>
      </div>
    </CardContent>
  </Card>
);
