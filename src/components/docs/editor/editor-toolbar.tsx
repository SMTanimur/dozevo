'use client';

import React, { useState } from 'react';
import { type Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline as UnderlineIcon, Code, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote, Minus,
  AlignLeft, AlignCenter, AlignRight, Undo, Redo, Link2, Link2Off,
  Table as TableIcon, Highlighter, MoreHorizontal, Baseline, PaintBucket,
  X,
} from 'lucide-react';
import { ToolbarButton, ToolbarSeparator } from './toolbar-button';
import { BlockTypeSelect } from './block-type-select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ─── Color Palettes ───────────────────────────────────────────────────────────
const TEXT_COLORS = [
  { label: 'Default',  value: ''        , swatch: 'hsl(var(--foreground))'  },
  { label: 'Gray',     value: '#6b7280' , swatch: '#6b7280' },
  { label: 'Red',      value: '#ef4444' , swatch: '#ef4444' },
  { label: 'Orange',   value: '#f97316' , swatch: '#f97316' },
  { label: 'Amber',    value: '#f59e0b' , swatch: '#f59e0b' },
  { label: 'Green',    value: '#22c55e' , swatch: '#22c55e' },
  { label: 'Teal',     value: '#14b8a6' , swatch: '#14b8a6' },
  { label: 'Blue',     value: '#3b82f6' , swatch: '#3b82f6' },
  { label: 'Indigo',   value: '#6366f1' , swatch: '#6366f1' },
  { label: 'Violet',   value: '#8b5cf6' , swatch: '#8b5cf6' },
  { label: 'Pink',     value: '#ec4899' , swatch: '#ec4899' },
  { label: 'Rose',     value: '#f43f5e' , swatch: '#f43f5e' },
];

const BG_COLORS = [
  { label: 'None',         value: ''        , swatch: 'transparent', border: true },
  { label: 'Gray',         value: '#f3f4f6' , swatch: '#f3f4f6' },
  { label: 'Red',          value: '#fee2e2' , swatch: '#fee2e2' },
  { label: 'Orange',       value: '#ffedd5' , swatch: '#ffedd5' },
  { label: 'Amber',        value: '#fef3c7' , swatch: '#fef3c7' },
  { label: 'Green',        value: '#dcfce7' , swatch: '#dcfce7' },
  { label: 'Teal',         value: '#ccfbf1' , swatch: '#ccfbf1' },
  { label: 'Blue',         value: '#dbeafe' , swatch: '#dbeafe' },
  { label: 'Indigo',       value: '#e0e7ff' , swatch: '#e0e7ff' },
  { label: 'Violet',       value: '#ede9fe' , swatch: '#ede9fe' },
  { label: 'Pink',         value: '#fce7f3' , swatch: '#fce7f3' },
  { label: 'Rose',         value: '#ffe4e6' , swatch: '#ffe4e6' },
];

// ─── Color Picker Popover ─────────────────────────────────────────────────────
const ColorPicker = ({
  mode,
  editor,
  onClose,
}: {
  mode: 'text' | 'bg';
  editor: Editor;
  onClose: () => void;
}) => {
  const colors = mode === 'text' ? TEXT_COLORS : BG_COLORS;

  const apply = (value: string) => {
    if (mode === 'text') {
      if (!value) editor.chain().focus().unsetColor().run();
      else editor.chain().focus().setColor(value).run();
    } else {
      if (!value) editor.chain().focus().unsetHighlight().run();
      else editor.chain().focus().setHighlight({ color: value }).run();
    }
    onClose();
  };

  return (
    <div className="w-[220px] p-3 rounded-xl bg-popover border border-border shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-xs font-semibold text-foreground">
          {mode === 'text' ? 'Text color' : 'Background color'}
        </p>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Swatches grid */}
      <div className="grid grid-cols-6 gap-1.5">
        {colors.map((c) => (
          <button
            key={c.label}
            title={c.label}
            type="button"
            onClick={() => apply(c.value)}
            className="relative w-7 h-7 rounded-md transition-all hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40"
            style={{
              background: c.swatch === 'transparent' ? 'transparent' : c.swatch,
              border: (c as { border?: boolean }).border || !c.value ? '1.5px solid hsl(var(--border))' : '1.5px solid transparent',
            }}
          >
            {!c.value && (
              <span className="absolute inset-0 flex items-center justify-center">
                <X className="h-3.5 w-3.5 text-muted-foreground/60" />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Custom hex input */}
      <div className="mt-3 pt-2.5 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">Custom hex</p>
        <div className="flex gap-1.5">
          <input
            type="color"
            className="w-8 h-7 rounded cursor-pointer border border-border bg-transparent"
            onChange={(e) => apply(e.target.value)}
          />
          <input
            type="text"
            placeholder="#000000"
            className="flex-1 h-7 px-2 text-xs rounded-md bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary/40"
            onBlur={(e) => { if (/^#[0-9a-f]{6}$/i.test(e.target.value)) apply(e.target.value); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const v = (e.target as HTMLInputElement).value;
                if (/^#[0-9a-f]{6}$/i.test(v)) apply(v);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Main Toolbar ─────────────────────────────────────────────────────────────
interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [colorMode, setColorMode] = useState<'text' | 'bg' | null>(null);

  const setLink = () => {
    if (!linkUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  };

  // Current text color for indicator dot
  const currentTextColor = editor.getAttributes('textStyle').color as string | undefined;
  const currentHighlight = editor.getAttributes('highlight').color as string | undefined;

  return (
    <div className="sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur-md">
      {/* Link Input Row */}
      {showLinkInput && (
        <div className="px-4 py-2 border-b border-border/50 flex items-center gap-2 bg-muted/30">
          <Link2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <input
            autoFocus
            type="url"
            placeholder="Paste URL and press Enter…"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') setLink();
              if (e.key === 'Escape') setShowLinkInput(false);
            }}
            className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50"
          />
          <button type="button" onClick={setLink} className="text-xs font-semibold text-primary hover:text-primary/80">Apply</button>
          <button type="button" onClick={() => setShowLinkInput(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
        </div>
      )}

      {/* Color picker dropdown */}
      {colorMode && (
        <div className="absolute left-0 top-full z-50 mt-1 ml-2">
          <ColorPicker mode={colorMode} editor={editor} onClose={() => setColorMode(null)} />
        </div>
      )}

      {/* Main toolbar row */}
      <div className="px-3 py-1.5 flex items-center gap-0.5 flex-wrap overflow-x-auto">

        {/* Block type */}
        <BlockTypeSelect editor={editor} />
        <ToolbarSeparator />

        {/* History */}
        <ToolbarButton title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarSeparator />

        {/* Text marks */}
        <ToolbarButton title="Bold (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Italic (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Underline (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}>
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}>
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Inline Code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')}>
          <Code className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* ── Text Color ── */}
        <div className="relative">
          <ToolbarButton
            title="Text color"
            onClick={() => setColorMode(colorMode === 'text' ? null : 'text')}
            active={colorMode === 'text'}
          >
            <div className="flex flex-col items-center gap-0.5">
              <Baseline className="h-3.5 w-3.5" />
              <div
                className="h-[3px] w-4 rounded-full"
                style={{ background: currentTextColor || 'hsl(var(--foreground))' }}
              />
            </div>
          </ToolbarButton>
        </div>

        {/* ── Background Color ── */}
        <div className="relative">
          <ToolbarButton
            title="Background color"
            onClick={() => setColorMode(colorMode === 'bg' ? null : 'bg')}
            active={colorMode === 'bg'}
          >
            <div className="flex flex-col items-center gap-0.5">
              <PaintBucket className="h-3.5 w-3.5" />
              <div
                className="h-[3px] w-4 rounded-full border border-border/40"
                style={{ background: currentHighlight || 'hsl(var(--muted-foreground) / 0.3)' }}
              />
            </div>
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Link */}
        <ToolbarButton title="Add link" onClick={() => setShowLinkInput(v => !v)} active={editor.isActive('link') || showLinkInput}>
          <Link2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        {editor.isActive('link') && (
          <ToolbarButton title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}>
            <Link2Off className="h-3.5 w-3.5" />
          </ToolbarButton>
        )}
        <ToolbarSeparator />

        {/* Headings */}
        <ToolbarButton title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>
          <Heading1 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarSeparator />

        {/* Lists */}
        <ToolbarButton title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarSeparator />

        {/* Alignment */}
        <ToolbarButton title="Align Left" onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })}>
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Align Center" onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })}>
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Align Right" onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })}>
          <AlignRight className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarSeparator />

        {/* Table & More */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              title="Table & more"
              className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all flex-shrink-0"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl p-1.5 min-w-[200px] shadow-xl">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2 py-1">Table</p>
            {[
              { label: 'Insert Table (3×3)', action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
              { label: 'Add Column After',   action: () => editor.chain().focus().addColumnAfter().run() },
              { label: 'Add Row After',      action: () => editor.chain().focus().addRowAfter().run() },
              { label: 'Delete Column',      action: () => editor.chain().focus().deleteColumn().run() },
              { label: 'Delete Row',         action: () => editor.chain().focus().deleteRow().run() },
              { label: 'Delete Table',       action: () => editor.chain().focus().deleteTable().run() },
            ].map(item => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="w-full text-left px-2 py-1.5 text-sm rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
              >
                <TableIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                {item.label}
              </button>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
