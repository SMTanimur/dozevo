'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from './dialog';
import { Button } from './button';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageTitle?: string;
  className?: string;
}

export function Lightbox({
  isOpen,
  onClose,
  imageUrl,
  imageTitle,
  className,
}: LightboxProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-[90vw] max-h-[90vh] p-0 bg-black/90 border-none'>
        <div className='relative w-full h-full'>
          {/* Close button */}
          <Button
            variant='ghost'
            size='icon'
            className='absolute top-4 right-4 z-50 text-white hover:bg-white/20'
            onClick={onClose}
          >
            <X className='h-6 w-6' />
          </Button>

          {/* Image container */}
          <div
            className='relative w-full h-full flex items-center justify-center overflow-hidden'
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={imageUrl}
              alt={imageTitle || 'Lightbox image'}
              className={cn(
                'max-w-full max-h-[80vh] object-contain transition-transform duration-200',
                className
              )}
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                cursor: scale > 1 ? 'grab' : 'default',
              }}
            />
          </div>

          {/* Controls */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 rounded-full p-2'>
            <Button
              variant='ghost'
              size='icon'
              className='text-white hover:bg-white/20'
              onClick={handleZoomOut}
              disabled={scale <= 1}
            >
              <ZoomOut className='h-5 w-5' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='text-white hover:bg-white/20'
              onClick={handleZoomIn}
              disabled={scale >= 3}
            >
              <ZoomIn className='h-5 w-5' />
            </Button>
          </div>

          {/* Image title */}
          {imageTitle && (
            <div className='absolute bottom-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full'>
              {imageTitle}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
