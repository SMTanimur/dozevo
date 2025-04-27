import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonCard = () => (
  <Card className='h-full'>
    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
      <Skeleton className='h-4 w-2/5' /> {/* Title skeleton */}
      <Skeleton className='h-5 w-5' /> {/* Handle skeleton */}
    </CardHeader>
    <CardContent>
      <Skeleton className='h-4 w-4/5 mb-2' /> {/* Content line 1 */}
      <Skeleton className='h-4 w-3/5' /> {/* Content line 2 */}
    </CardContent>
  </Card>
);
