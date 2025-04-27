'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'; // Assuming this path is correct
import { buttonVariants } from '@/components/ui/button'; // Removed Button import
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string; // e.g., "Delete: Team Space"
  description: React.ReactNode; // Can be string or more complex JSX
  icon?: React.ReactNode; // New: Allow custom icon
  confirmText?: string; // Default: "Delete"
  cancelText?: string; // Default: "Cancel"
  isDeleting?: boolean; // For loading state on confirm button
  size?: 'sm' | 'md' | 'lg'; // New: Allow size control
  className?: string; // New: Allow custom class for content
}

export const DeleteConfirmationDialog: React.FC<
  DeleteConfirmationDialogProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  icon, // Destructure new prop
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDeleting = false,
  size = 'sm', // Default size
  className,
}) => {
  if (!isOpen) {
    return null;
  }

  // Determine size class
  const sizeClasses = {
    sm: 'sm:max-w-lg', // Default shadcn size
    md: 'sm:max-w-xl',
    lg: 'sm:max-w-2xl',
  };

  const defaultIcon = (
    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
      <Trash2 className='h-6 w-6 text-red-600' />
    </div>
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      {/* Apply custom className and size class */}
      <AlertDialogContent className={cn(sizeClasses[size], className)}>
        <AlertDialogHeader className='items-center text-center sm:text-center'>
          {/* Render custom icon or default */}
          {icon || defaultIcon}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className='text-center'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='sm:justify-center'>
          <AlertDialogCancel onClick={onClose} disabled={isDeleting}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={e => {
              e.stopPropagation();
              onConfirm();
            }}
            className={cn(buttonVariants({ variant: 'destructive' }))} // Apply destructive style
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
