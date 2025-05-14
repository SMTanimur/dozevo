import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Paperclip, FileText } from 'lucide-react';
import Image from 'next/image';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { AttachmentDialog } from './attachment-dialog';
import { DocumentViewer } from './document-viewer';
import { ITaskAttachment } from '@/types';

interface TaskAttachmentsProps {
  attachments: ITaskAttachment[];
  onUpload: (files: File[]) => Promise<void>;
  isUploading: boolean;
}

export const TaskAttachments = ({
  attachments,
  onUpload,
  isUploading,
}: TaskAttachmentsProps) => {
  const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState('');
  const [lightboxImageTitle, setLightboxImageTitle] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string;
    filename: string;
  } | null>(null);

  const isImageFile = (filename: string) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? imageExtensions.includes(extension) : false;
  };

  const openLightbox = (url: string, filename: string) => {
    setLightboxImageUrl(url);
    setLightboxImageTitle(filename);
    setIsLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setIsLightboxOpen(false);
    setTimeout(() => {
      setLightboxImageUrl('');
      setLightboxImageTitle('');
    }, 300);
  };

  return (
    <div className='mb-6'>
      <div className='flex items-center justify-between mb-2'>
        <Label className='text-sm text-gray-500'>Attachments</Label>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setIsAttachmentDialogOpen(true)}
          disabled={isUploading}
        >
          <Paperclip className='h-4 w-4 mr-2' />
          Add Attachments
        </Button>
      </div>

      {attachments && attachments.length > 0 ? (
        <div className='grid grid-cols-2 gap-4'>
          {attachments.map(attachment => (
            <div
              key={attachment.public_id || attachment._id}
              className='flex flex-col gap-2 p-3 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200'
            >
              {isImageFile(attachment.filename) ? (
                <div
                  className='relative aspect-video w-full overflow-hidden rounded-md cursor-pointer'
                  onClick={() =>
                    openLightbox(attachment.url, attachment.filename)
                  }
                >
                  <Image
                    src={attachment.url}
                    alt={attachment.filename}
                    fill
                    className='object-cover'
                  />
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 min-h-[220px] shadow-sm hover:shadow-lg transition-all duration-200'>
                  <div className='mb-3'>
                    <FileText className='h-12 w-12 text-blue-500 drop-shadow' />
                  </div>
                  <span
                    className='font-semibold text-gray-800 text-base truncate w-full text-center mb-3'
                    title={attachment.filename}
                    style={{ maxWidth: 180 }}
                  >
                    {attachment.filename}
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full mb-2 text-blue-700 border-blue-300 hover:bg-blue-200/60 hover:text-blue-900 transition-colors font-semibold rounded-lg'
                    onClick={() =>
                      setSelectedDocument({
                        url: attachment.url,
                        filename: attachment.filename,
                      })
                    }
                  >
                    View
                  </Button>
                </div>
              )}
              <div className='flex flex-col gap-1 mt-1'>
                <div className='flex items-center justify-between'>
                  <div className='text-xs text-gray-500 flex items-center gap-1'>
                    <span>Added by</span>
                    <span className='font-medium'>
                      {attachment.uploadedBy?.firstName || 'Unknown'}
                    </span>
                  </div>
                  <span className='text-xs text-gray-400'>
                    {new Date(attachment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-sm text-gray-400 py-2'>No attachments yet.</div>
      )}

      <AttachmentDialog
        isOpen={isAttachmentDialogOpen}
        onClose={() => setIsAttachmentDialogOpen(false)}
        onUpload={onUpload}
        isUploading={isUploading}
      />

      <DocumentViewer
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        fileUrl={selectedDocument?.url || ''}
        fileName={selectedDocument?.filename || ''}
      />

      {isLightboxOpen && (
        <Lightbox
          mainSrc={lightboxImageUrl}
          onCloseRequest={handleLightboxClose}
          imageTitle={lightboxImageTitle}
          reactModalStyle={{ overlay: { zIndex: 9999 } }}
          imageCaption={lightboxImageTitle}
          enableZoom={true}
          clickOutsideToClose={true}
          discourageDownloads={false}
          wrapperClassName='lightbox-wrapper'
        />
      )}
    </div>
  );
};
