import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttachmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadProgress?: number;
}

export const AttachmentDialog = ({
  isOpen,
  onClose,
  onUpload,
  isUploading,
  uploadProgress = 0,
}: AttachmentDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const handleUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Add Attachment</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-primary/50'
              )}
            >
              <input {...getInputProps()} />
              <UploadCloud className='mx-auto h-12 w-12 text-gray-400' />
              <p className='mt-2 text-sm text-gray-600'>
                {isDragActive
                  ? 'Drop the file here'
                  : 'Drag and drop a file here, or click to select'}
              </p>
              <p className='mt-1 text-xs text-gray-500'>Max file size: 10MB</p>
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='flex items-center gap-3 p-3 border rounded-lg bg-gray-50'>
                <FileText className='h-8 w-8 text-gray-500 flex-shrink-0' />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-gray-900 truncate'>
                    {selectedFile.name}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setSelectedFile(null)}
                  disabled={isUploading}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>

              {isUploading && (
                <div className='space-y-2'>
                  <Progress value={uploadProgress} />
                  <p className='text-sm text-gray-500 text-center'>
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              <div className='flex justify-end gap-2'>
                <Button
                  variant='outline'
                  onClick={handleClose}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={isUploading}>
                  Upload
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
