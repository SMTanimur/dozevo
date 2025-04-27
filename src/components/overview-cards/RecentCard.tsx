import { Card } from '@/components/ui/card';

export const RecentCard = () => (
  <Card className='p-4 h-full'>
    <h2 className='text-lg drag-handle font-medium mb-4'>Recent</h2>
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <svg
          className='h-4 w-4 text-gray-500'
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
        <span>Project 1</span>
        <span className='text-gray-500 text-sm'>• in Projects</span>
      </div>
      <div className='flex items-center gap-2'>
        <svg
          className='h-4 w-4 text-gray-500'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <rect
            x='3'
            y='3'
            width='18'
            height='18'
            rx='2'
            stroke='currentColor'
            strokeWidth='2'
          />
          <path d='M3 9H21' stroke='currentColor' strokeWidth='2' />
          <path d='M3 15H21' stroke='currentColor' strokeWidth='2' />
          <path d='M9 3V21' stroke='currentColor' strokeWidth='2' />
          <path d='M15 3V21' stroke='currentColor' strokeWidth='2' />
        </svg>
        <span>Projects</span>
        <span className='text-gray-500 text-sm'>• in Team Space</span>
      </div>
      <div className='flex items-center gap-2'>
        <svg
          className='h-4 w-4 text-gray-500'
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
        <span>jazlia</span>
        <span className='text-gray-500 text-sm'>• in Team Space</span>
      </div>
      <div className='flex items-center gap-2'>
        <svg
          className='h-4 w-4 text-gray-500'
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
        <span>Project 2</span>
        <span className='text-gray-500 text-sm'>• in Projects</span>
      </div>
    </div>
  </Card>
);
