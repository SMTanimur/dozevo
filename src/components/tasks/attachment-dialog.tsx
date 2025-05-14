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
import { UploadCloud, FileText, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttachmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => Promise<void>;
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prevFiles =>
      [...prevFiles, ...acceptedFiles].slice(0, 10)
    );
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
    maxSize: 10 * 1024 * 1024, // 10MB per file
    multiple: true, // Allow multiple files to be selected
  });

  const handleRemoveFile = (fileNameToRemove: string) => {
    setSelectedFiles(prevFiles =>
      prevFiles.filter(file => file.name !== fileNameToRemove)
    );
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      await onUpload(selectedFiles);
      setSelectedFiles([]);
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Add Attachments</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-primary/50',
              'min-h-[150px] flex flex-col justify-center items-center'
            )}
          >
            <input {...getInputProps()} />
            <UploadCloud className='mx-auto h-12 w-12 text-gray-400' />
            <p className='mt-2 text-sm text-gray-600'>
              {isDragActive
                ? 'Drop the files here'
                : 'Drag and drop files here, or click to select'}
            </p>
            <p className='mt-1 text-xs text-gray-500'>
              Max file size: 10MB each. Up to 10 files.
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className='space-y-2 max-h-60 overflow-y-auto pr-2'>
              {selectedFiles.map(file => (
                <div
                  key={file.name}
                  className='flex items-center gap-3 p-2 border rounded-lg bg-gray-50'
                >
                  <FileText className='h-8 w-8 text-gray-500 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p
                      className='text-sm font-medium text-gray-900 truncate'
                      title={file.name}
                    >
                      {file.name}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleRemoveFile(file.name)}
                    disabled={isUploading}
                    className='text-red-500 hover:text-red-700'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {isUploading && (
            <div className='space-y-2'>
              <Progress value={uploadProgress} />
              <p className='text-sm text-gray-500 text-center'>
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <div className='flex justify-end gap-2 pt-4'>
            <Button
              variant='outline'
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
            >
              Upload{' '}
              {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
