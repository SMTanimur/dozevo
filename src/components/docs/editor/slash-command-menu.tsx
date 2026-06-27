'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type Editor } from '@tiptap/react';
import {
  Type, Heading1, Heading2, Heading3, List, ListOrdered,
  CheckSquare, Quote, Code2, Minus, Table2, Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib';

const SLASH_COMMANDS = [
  { id: 'text',    label: 'Text',           desc: 'Plain paragraph',         icon: Type,        keys: ['text','paragraph'], action: (e: Editor) => e.chain().focus().clearNodes().setParagraph().run() },
  { id: 'h1',      label: 'Heading 1',      desc: 'Big section heading',      icon: Heading1,    keys: ['h1','heading1','title'], action: (e: Editor) => e.chain().focus().toggleHeading({ level: 1 }).run() },
  { id: 'h2',      label: 'Heading 2',      desc: 'Medium section heading',   icon: Heading2,    keys: ['h2','heading2','subtitle'], action: (e: Editor) => e.chain().focus().toggleHeading({ level: 2 }).run() },
  { id: 'h3',      label: 'Heading 3',      desc: 'Small section heading',    icon: Heading3,    keys: ['h3','heading3'], action: (e: Editor) => e.chain().focus().toggleHeading({ level: 3 }).run() },
  { id: 'ul',      label: 'Bullet List',    desc: 'Unordered bullet list',    icon: List,        keys: ['bullet','list','ul'], action: (e: Editor) => e.chain().focus().toggleBulletList().run() },
  { id: 'ol',      label: 'Numbered List',  desc: 'Ordered numbered list',    icon: ListOrdered, keys: ['number','numbered','ol'], action: (e: Editor) => e.chain().focus().toggleOrderedList().run() },
  { id: 'todo',    label: 'To-do List',     desc: 'Checkbox task list',       icon: CheckSquare, keys: ['todo','task','check','checkbox'], action: (e: Editor) => e.chain().focus().toggleTaskList().run() },
  { id: 'quote',   label: 'Blockquote',     desc: 'Highlighted quote block',  icon: Quote,       keys: ['quote','blockquote'], action: (e: Editor) => e.chain().focus().toggleBlockquote().run() },
  { id: 'code',    label: 'Code Block',     desc: 'Syntax-highlighted code',  icon: Code2,       keys: ['code','codeblock'], action: (e: Editor) => e.chain().focus().toggleCodeBlock().run() },
  { id: 'divider', label: 'Divider',        desc: 'Horizontal separator',     icon: Minus,       keys: ['divider','rule','hr','line'], action: (e: Editor) => e.chain().focus().setHorizontalRule().run() },
  { id: 'table',   label: 'Table',          desc: '3×3 table grid',           icon: Table2,      keys: ['table','grid'], action: (e: Editor) => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
  { id: 'image',   label: 'Image',          desc: 'Insert image by URL',      icon: ImageIcon,   keys: ['image','photo','picture'], action: (e: Editor) => {
    const url = prompt('Image URL:');
    if (url) e.chain().focus().setImage({ src: url }).run();
  }},
];

interface SlashCommandMenuProps {
  editor: Editor;
}

export const SlashCommandMenu = ({ editor }: SlashCommandMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const slashStart = useRef<number | null>(null);

  const filteredCommands = SLASH_COMMANDS.filter(cmd =>
    !query || cmd.keys.some(k => k.startsWith(query.toLowerCase())) || cmd.label.toLowerCase().startsWith(query.toLowerCase())
  );

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    slashStart.current = null;
  }, []);

  const runCommand = useCallback((cmd: typeof SLASH_COMMANDS[0]) => {
    // Delete the '/query' text we typed
    if (slashStart.current !== null) {
      const { state } = editor;
      const from = slashStart.current;
      const to = state.selection.from;
      editor.chain().focus().deleteRange({ from, to }).run();
    }
    cmd.action(editor);
    closeMenu();
  }, [editor, closeMenu]);

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (view: unknown, event: KeyboardEvent) => {
      if (!isOpen) return false;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(i => (i + 1) % filteredCommands.length);
        return true;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
        return true;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        if (filteredCommands[selectedIndex]) {
          runCommand(filteredCommands[selectedIndex]);
        }
        return true;
      }
      if (event.key === 'Escape' || event.key === ' ') {
        closeMenu();
        return event.key === 'Escape';
      }
      return false;
    };

    editor.setOptions({
      editorProps: {
        ...editor.options.editorProps,
        handleKeyDown,
      },
    });

    return () => {
      if (editor && !editor.isDestroyed) {
        editor.setOptions({ editorProps: { ...editor.options.editorProps, handleKeyDown: undefined } });
      }
    };
  }, [editor, isOpen, filteredCommands, selectedIndex, closeMenu, runCommand]);

  useEffect(() => {
    if (!editor) return;
    const updateFn = () => {
      const { state } = editor;
      const { from } = state.selection;

      // Get text on the current line up to cursor
      const $from = state.doc.resolve(from);
      const lineStart = $from.start();
      const textBeforeCursor = state.doc.textBetween(lineStart, from, '\n', '\0');

      const slashMatch = textBeforeCursor.match(/\/([a-zA-Z0-9]*)$/);
      if (slashMatch) {
        const slashPos = from - slashMatch[0].length;
        slashStart.current = slashPos;
        setQuery(slashMatch[1].toLowerCase());
        setSelectedIndex(0);

        // Calculate DOM position
        const coords = editor.view.coordsAtPos(from);
        const editorRect = editor.view.dom.getBoundingClientRect();
        setPosition({
          top: coords.bottom - editorRect.top + 4,
          left: coords.left - editorRect.left,
        });
        setIsOpen(true);
      } else {
        if (isOpen) closeMenu();
      }
    };

    editor.on('update', updateFn);
    editor.on('selectionUpdate', updateFn);
    return () => {
      editor.off('update', updateFn);
      editor.off('selectionUpdate', updateFn);
    };
  }, [editor, isOpen, closeMenu]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen || filteredCommands.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 w-[240px] rounded-xl bg-popover/98 backdrop-blur-lg border border-border shadow-2xl overflow-hidden"
      style={{ top: position.top, left: position.left }}
    >
      {/* Header */}
      <div className="px-3 pt-2 pb-1.5 border-b border-border/50">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          {query ? `Results for "/${query}"` : 'Block types'}
        </p>
      </div>

      {/* Commands */}
      <div className="p-1.5 max-h-[280px] overflow-y-auto custom-scrollbar">
        {filteredCommands.map((cmd, i) => {
          const Icon = cmd.icon;
          return (
            <button
              key={cmd.id}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); runCommand(cmd); }}
              className={cn(
                'w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-colors text-sm',
                i === selectedIndex
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted/70 text-foreground'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                i === selectedIndex ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-medium leading-tight text-sm">{cmd.label}</span>
                <span className="text-[10px] text-muted-foreground/70 leading-tight truncate">{cmd.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="px-3 py-2 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground/60">↑↓ Navigate  ↵ Select  Esc Dismiss</p>
      </div>
    </div>
  );
};
