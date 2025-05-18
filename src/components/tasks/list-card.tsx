import React, { useState } from 'react';
import { IList } from '@/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ListCardProps {
  list: IList;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const ListCard: React.FC<ListCardProps> = ({
  list,
  children,
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      className='bg-white rounded-2xl p-4 shadow-md border-l-2 mb-6'
      style={{
        borderColor: list.color || '#e5e7eb',
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
      }}
    >
      <div
        className='flex items-center justify-between px-6 py-4 border-b rounded-t-2xl cursor-pointer select-none'
        onClick={() => setExpanded(e => !e)}
      >
        <div className='flex items-center gap-2'>
          <span
            className='rounded px-3 py-1 text-xs font-bold'
            style={{ background: list.color, color: '#fff' }}
          >
            {list.name}
          </span>
          <span className='text-gray-400 text-xs'>Projects / {list.name}</span>
        </div>
        <button
          className='ml-2 p-1 rounded hover:bg-gray-100 transition'
          tabIndex={-1}
          onClick={e => {
            e.stopPropagation();
            setExpanded(v => !v);
          }}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? (
            <ChevronDown className='h-5 w-5' />
          ) : (
            <ChevronRight className='h-5 w-5' />
          )}
        </button>
      </div>
      {expanded && <div className='p-0'>{children}</div>}
    </div>
  );
};
