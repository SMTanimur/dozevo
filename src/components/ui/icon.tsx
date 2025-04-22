import React from 'react';
import { icons, LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconProps extends LucideProps {
  name: keyof typeof icons; // Ensure name is a valid lucide icon key
  className?: string;
}

const Icon = ({ name, className, ...props }: IconProps): React.ReactElement | null => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    // Optionally log an error or return a default icon
    console.warn(`Icon with name "${name}" not found in lucide-react.`);
    return null;
  }

  return <LucideIcon className={cn(className)} {...props} />;
};

export { Icon }; 