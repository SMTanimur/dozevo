'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BaseModalProps {
  open: boolean;
  onChangeOpenModal: (open: boolean) => void;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

interface HeaderProps {
  children: React.ReactNode;
  description?: string;
  className?: string;
}

interface ContentProps {
  children: React.ReactNode;
  className?: string;
}

interface FooterProps {
  children: React.ReactNode;
  className?: string;
}

const BaseModal = ({
  open,
  onChangeOpenModal,
  children,
  size = 'medium',
  className,
}: BaseModalProps) => {
  // Calculate max width based on size
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'sm:max-w-md';
      case 'large':
        return 'sm:max-w-2xl';
      case 'medium':
      default:
        return 'sm:max-w-lg';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onChangeOpenModal}>
      <DialogContent className={`${getSizeClass()} ${className || ''}`}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

// Header subcomponent
const Header = ({ children, description, className }: HeaderProps) => {
  return (
    <DialogHeader className={className}>
      <DialogTitle>{children}</DialogTitle>
      {description && <DialogDescription>{description}</DialogDescription>}
    </DialogHeader>
  );
};

// Content subcomponent
const Content = ({ children, className }: ContentProps) => {
  return <div className={`py-4 ${className || ''}`}>{children}</div>;
};

// Footer subcomponent
const Footer = ({ children, className }: FooterProps) => {
  return <DialogFooter className={className}>{children}</DialogFooter>;
};

// Attach subcomponents to BaseModal
BaseModal.Header = Header;
BaseModal.Content = Content;
BaseModal.Footer = Footer;

export { BaseModal };
