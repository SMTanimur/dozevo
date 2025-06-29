import { Card } from '@/components/ui/card';
import { File } from 'lucide-react';

interface DocsCardProps {
  recentDocs?: Record<string, unknown>[];
}

export const DocsCard = ({ recentDocs }: DocsCardProps) => {
  return (
    <Card className='p-4 h-full'>
      <h2 className='text-lg drag-handle font-medium mb-4'>Docs</h2>
      <div className='space-y-3'>
        {recentDocs && recentDocs.length > 0 ? (
          recentDocs.map((doc: Record<string, unknown>) => (
            <div key={doc._id as string} className='flex items-center gap-2'>
              <File className='h-4 w-4 text-gray-500' />
              <span className='truncate'>{doc.name as string}</span>
              <span className='text-gray-500 text-sm'>• in Docs</span>
            </div>
          ))
        ) : (
          <div className='text-gray-500 text-sm'>No documents found</div>
        )}
      </div>
    </Card>
  );
};
