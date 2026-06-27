'use client';

import React from 'react';
import { type Editor } from '@tiptap/react';
import { ChevronDown, Type, Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare, Quote, Code2, Minus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const BLOCK_TYPES = [
  {
    group: 'Basic',
    items: [
      { label: 'Text', desc: 'Plain paragraph', icon: Type, action: (e: Editor) => e.chain().focus().clearNodes().setParagraph().run(), isActive: (e: Editor) => e.isActive('paragraph') && !e.isActive('bulletList') && !e.isActive('orderedList') },
    ],
  },
  {
    group: 'Headings',
    items: [
      { label: 'Heading 1', desc: 'Big section title', icon: Heading1, action: (e: Editor) => e.chain().focus().toggleHeading({ level: 1 }).run(), isActive: (e: Editor) => e.isActive('heading', { level: 1 }) },
      { label: 'Heading 2', desc: 'Medium section title', icon: Heading2, action: (e: Editor) => e.chain().focus().toggleHeading({ level: 2 }).run(), isActive: (e: Editor) => e.isActive('heading', { level: 2 }) },
      { label: 'Heading 3', desc: 'Small section title', icon: Heading3, action: (e: Editor) => e.chain().focus().toggleHeading({ level: 3 }).run(), isActive: (e: Editor) => e.isActive('heading', { level: 3 }) },
    ],
  },
  {
    group: 'Lists',
    items: [
      { label: 'Bullet List', desc: 'Unordered list', icon: List, action: (e: Editor) => e.chain().focus().toggleBulletList().run(), isActive: (e: Editor) => e.isActive('bulletList') },
      { label: 'Numbered List', desc: 'Ordered list', icon: ListOrdered, action: (e: Editor) => e.chain().focus().toggleOrderedList().run(), isActive: (e: Editor) => e.isActive('orderedList') },
      { label: 'To-do List', desc: 'Checkboxes', icon: CheckSquare, action: (e: Editor) => e.chain().focus().toggleTaskList().run(), isActive: (e: Editor) => e.isActive('taskList') },
    ],
  },
  {
    group: 'Blocks',
    items: [
      { label: 'Quote', desc: 'Highlight important text', icon: Quote, action: (e: Editor) => e.chain().focus().toggleBlockquote().run(), isActive: (e: Editor) => e.isActive('blockquote') },
      { label: 'Code Block', desc: 'Syntax-highlighted code', icon: Code2, action: (e: Editor) => e.chain().focus().toggleCodeBlock().run(), isActive: (e: Editor) => e.isActive('codeBlock') },
      { label: 'Divider', desc: 'Horizontal rule', icon: Minus, action: (e: Editor) => e.chain().focus().setHorizontalRule().run(), isActive: () => false },
    ],
  },
];

const getCurrentLabel = (editor: Editor): string => {
  if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
  if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
  if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
  if (editor.isActive('bulletList')) return 'Bullet List';
  if (editor.isActive('orderedList')) return 'Numbered List';
  if (editor.isActive('taskList')) return 'To-do List';
  if (editor.isActive('blockquote')) return 'Quote';
  if (editor.isActive('codeBlock')) return 'Code Block';
  return 'Text';
};

interface BlockTypeSelectProps {
  editor: Editor;
}

export const BlockTypeSelect = ({ editor }: BlockTypeSelectProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs font-semibold rounded-md px-2 h-7 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all border border-transparent hover:border-border/40 min-w-[90px]"
        >
          <span className="truncate">{getCurrentLabel(editor)}</span>
          <ChevronDown className="h-3 w-3 ml-auto flex-shrink-0 opacity-60" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="min-w-[220px] rounded-xl p-1.5 shadow-xl border border-border/60 bg-popover/95 backdrop-blur-md"
      >
        {BLOCK_TYPES.map((group, gi) => (
          <React.Fragment key={group.group}>
            {gi > 0 && <DropdownMenuSeparator className="my-1" />}
            <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase tracking-widest">
              {group.group}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = item.isActive(editor);
              return (
                <DropdownMenuItem
                  key={item.label}
                  onClick={() => item.action(editor)}
                  className={`flex items-center gap-3 rounded-lg px-2 py-2 cursor-pointer text-sm transition-colors ${active ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${active ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium leading-tight">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground/70 leading-tight">{item.desc}</span>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
