import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import mammoth from 'mammoth';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

export const DocumentViewer = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
}: DocumentViewerProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [docxContent, setDocxContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  const handleDocxLoad = async () => {
    try {
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setDocxContent(result.value);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading DOCX:', error);
      setIsLoading(false);
    }
  };

  // Reset state when the dialog is opened with a new file
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setPageNumber(1);

      // If it's a DOCX file, load it
      if (['doc', 'docx'].includes(fileExtension || '')) {
        handleDocxLoad();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, fileUrl, fileExtension]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='flex items-center justify-center h-full'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      );
    }

    if (fileExtension === 'pdf') {
      return (
        <div className='flex flex-col items-center'>
          {numPages && (
            <div className='flex items-center gap-4 mt-4'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPageNumber(page => Math.max(1, page - 1))}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <span className='text-sm'>
                Page {pageNumber} of {numPages}
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setPageNumber(page => Math.min(numPages || 1, page + 1))
                }
                disabled={numPages ? pageNumber >= numPages : true}
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (['doc', 'docx'].includes(fileExtension || '')) {
      return (
        <div
          className='prose max-w-none p-4'
          dangerouslySetInnerHTML={{ __html: docxContent }}
        />
      );
    }

    return <div>Unsupported file type</div>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl h-[80vh]'>
        <div className='flex flex-col h-full'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold truncate'>{fileName}</h2>
            <Button variant='ghost' size='sm' onClick={onClose}>
              Close
            </Button>
          </div>
          <div className='flex-1 overflow-auto'>{renderContent()}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
