'use client';

import React from 'react';

interface DocsTitleProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export const DocsTitle = ({ value, onChange, placeholder = 'Untitled' }: DocsTitleProps) => {
  return (
    <div className="px-8 pt-14 pb-2 flex-shrink-0">
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-[2.5rem] font-extrabold text-foreground bg-transparent outline-none border-none
          placeholder:text-muted-foreground/20 focus:ring-0 leading-tight tracking-tight
          transition-colors"
        style={{ fontFamily: '"Inter", "Outfit", sans-serif' }}
      />
    </div>
  );
};
