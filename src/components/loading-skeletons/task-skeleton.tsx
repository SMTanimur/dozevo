import { Skeleton } from '@/components/ui/skeleton';

export const TaskSkeleton = () => {
  return (
    <div className='flex flex-col h-full text-sm bg-gray-50'>
      <div className='flex items-center justify-between p-4 m-4 border-b sticky top-0 bg-white z-10 rounded-t-2xl shadow-sm'>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-8 w-24' />
          <Skeleton className='h-8 w-24' />
          <Skeleton className='h-8 w-24' />
        </div>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-8 w-16' />
          <Skeleton className='h-8 w-16' />
          <Skeleton className='h-8 w-16' />
          <Skeleton className='h-8 w-40' />
          <Skeleton className='h-8 w-8' />
        </div>
      </div>
      <div className='flex flex-col gap-8 m-4 mt-4 pb-4'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className='bg-white rounded-2xl shadow-md border border-gray-100 p-0'
          >
            <div className='flex items-center justify-between px-6 py-4 border-b rounded-t-2xl bg-gradient-to-r from-gray-50 to-white'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-6 w-16' />
                <Skeleton className='h-6 w-12' />
              </div>
              <Skeleton className='h-8 w-24' />
            </div>
            <div className='grid grid-cols-[minmax(0,1fr)_200px_120px_100px] items-center px-6 py-2 text-xs text-gray-500 border-b bg-white rounded-t-2xl'>
              <div>Name</div>
              <div>Assignee</div>
              <div>Due date</div>
              <div>Priority</div>
            </div>
            {Array.from({ length: 3 }).map((_, taskIndex) => (
              <div
                key={taskIndex}
                className='border-b border-gray-100 bg-white hover:bg-gray-50 transition group'
              >
                <div className='group py-2 hover:bg-gray-50 cursor-pointer relative grid grid-cols-[minmax(0,1fr)_200px_120px_100px] items-center px-6'>
                  <Skeleton className='h-6 w-full' />
                  <Skeleton className='h-6 w-16' />
                  <Skeleton className='h-6 w-16' />
                  <Skeleton className='h-6 w-16' />
                </div>
              </div>
            ))}
            <div className='px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl'>
              <Skeleton className='h-7 w-24' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
