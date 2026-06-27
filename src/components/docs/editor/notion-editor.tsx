'use client';

import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Placeholder } from '@tiptap/extension-placeholder';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Link } from '@tiptap/extension-link';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import { Image } from '@tiptap/extension-image';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { common, createLowlight } from 'lowlight';
import { EditorToolbar } from './editor-toolbar';
import { SlashCommandMenu } from './slash-command-menu';

const lowlight = createLowlight(common);

const EDITOR_STYLES = `
  /* ── Base ──────────────────────────────────────── */
  .notion-editor-content { font-size: 1rem; line-height: 1.75; color: inherit; }
  .notion-editor-content:focus { outline: none; }

  /* ── Cursor & selection fix ─────────────────────── */
  .ProseMirror { outline: none !important; cursor: text !important; user-select: text !important; -webkit-user-select: text !important; }
  .ProseMirror:focus { outline: none !important; }
  .ProseMirror * { cursor: text !important; }
  .ProseMirror a { cursor: pointer !important; }
  .ProseMirror input[type="checkbox"] { cursor: pointer !important; }
  .ProseMirror ::selection { background: rgba(99,102,241,0.2) !important; }
  .ProseMirror::-moz-selection { background: rgba(99,102,241,0.2) !important; }

  /* ── Placeholder ────────────────────────────────── */
  .notion-editor-content p.is-editor-empty:first-child::before {
    color: hsl(var(--muted-foreground) / 0.35);
    float: left; height: 0; pointer-events: none;
    content: attr(data-placeholder); font-size: 1rem;
  }
  .notion-editor-content .is-empty::before {
    color: hsl(var(--muted-foreground) / 0.35);
    float: left; height: 0; pointer-events: none;
    content: attr(data-placeholder);
  }

  /* ── Headings ───────────────────────────────────── */
  .notion-editor-content h1 { font-size: 2rem; font-weight: 800; line-height: 1.2; margin: 1.5rem 0 0.5rem; letter-spacing: -0.02em; }
  .notion-editor-content h2 { font-size: 1.5rem; font-weight: 700; line-height: 1.25; margin: 1.25rem 0 0.4rem; letter-spacing: -0.01em; }
  .notion-editor-content h3 { font-size: 1.15rem; font-weight: 600; line-height: 1.3; margin: 1rem 0 0.3rem; }

  /* ── Paragraph ──────────────────────────────────── */
  .notion-editor-content p { margin: 0.2rem 0; }

  /* ── Lists ──────────────────────────────────────── */
  .notion-editor-content ul { list-style: disc; padding-left: 1.5rem; margin: 0.25rem 0; }
  .notion-editor-content ol { list-style: decimal; padding-left: 1.5rem; margin: 0.25rem 0; }
  .notion-editor-content li { margin: 0.15rem 0; }
  .notion-editor-content li p { margin: 0; }

  /* ── Task list ──────────────────────────────────── */
  .notion-editor-content ul[data-type="taskList"] { list-style: none; padding-left: 0.25rem; }
  .notion-editor-content ul[data-type="taskList"] > li { display: flex; align-items: flex-start; gap: 0.5rem; }
  .notion-editor-content ul[data-type="taskList"] > li > label { margin-top: 0.25rem; flex-shrink: 0; display: flex; }
  .notion-editor-content ul[data-type="taskList"] > li > label input[type="checkbox"] {
    accent-color: hsl(var(--primary)); width: 16px; height: 16px; cursor: pointer; border-radius: 4px;
  }
  .notion-editor-content ul[data-type="taskList"] > li > div { flex: 1; }
  .notion-editor-content ul[data-type="taskList"] > li[data-checked="true"] > div { text-decoration: line-through; opacity: 0.5; }

  /* ── Blockquote ─────────────────────────────────── */
  .notion-editor-content blockquote {
    border-left: 3px solid hsl(var(--primary));
    padding: 0.6rem 1rem; margin: 0.75rem 0;
    background: hsl(var(--primary) / 0.04);
    border-radius: 0 0.5rem 0.5rem 0;
    color: hsl(var(--muted-foreground)); font-style: italic;
  }

  /* ── Inline code ────────────────────────────────── */
  .notion-editor-content code {
    background: hsl(var(--muted)); padding: 0.1em 0.35em;
    border-radius: 0.3rem; font-family: 'JetBrains Mono','Fira Code',monospace;
    font-size: 0.85em; color: hsl(var(--primary));
  }

  /* ── Code block ─────────────────────────────────── */
  .notion-editor-content pre {
    background: hsl(220 20% 11%); border-radius: 0.75rem;
    padding: 1rem 1.25rem; overflow-x: auto;
    margin: 0.75rem 0; border: 1px solid hsl(var(--border));
  }
  .notion-editor-content pre code {
    background: none; padding: 0; font-size: 0.875rem; color: #e2e8f0;
    font-family: 'JetBrains Mono','Fira Code',monospace;
  }

  /* ── Highlight ──────────────────────────────────── */
  .notion-editor-content mark {
    background: #fef08a; padding: 0.05em 0.2em; border-radius: 0.2em; color: #713f12;
  }

  /* ── Link ───────────────────────────────────────── */
  .notion-editor-content a {
    color: hsl(var(--primary)); text-decoration: underline;
    text-underline-offset: 2px; cursor: pointer;
  }
  .notion-editor-content a:hover { opacity: 0.75; }

  /* ── HR ─────────────────────────────────────────── */
  .notion-editor-content hr { border: none; border-top: 2px solid hsl(var(--border)); margin: 1.5rem 0; }

  /* ── Text selection ─────────────────────────────── */
  .notion-editor-content ::selection { background: rgba(99,102,241,0.18) !important; }

  /* ── Image ──────────────────────────────────────── */
  .notion-editor-content img {
    max-width: 100%; border-radius: 0.75rem; margin: 0.75rem 0;
    display: block; border: 1px solid #e5e7eb;
  }

  /* ── Table ──────────────────────────────────────── */
  .notion-editor-content .tableWrapper {
    overflow-x: auto !important;
    margin: 1.25rem 0 !important;
    border-radius: 0.5rem !important;
    border: 1.5px solid #d1d5db !important;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .notion-editor-content table {
    border-collapse: collapse !important;
    width: 100% !important;
    min-width: 400px;
    table-layout: auto;
    font-size: 0.9rem;
  }
  .notion-editor-content thead tr th {
    background: #f3f4f6 !important;
    font-weight: 600 !important;
    font-size: 0.78rem !important;
    text-transform: uppercase !important;
    letter-spacing: 0.06em !important;
    padding: 0.65rem 0.9rem !important;
    border: 1px solid #d1d5db !important;
    text-align: left !important;
    color: #374151 !important;
    cursor: text !important;
  }
  .notion-editor-content tbody tr td {
    padding: 0.6rem 0.9rem !important;
    border: 1px solid #d1d5db !important;
    vertical-align: top !important;
    min-width: 100px;
    cursor: text !important;
  }
  .notion-editor-content tbody tr:nth-child(even) td { background: #f9fafb !important; }
  .notion-editor-content table p { margin: 0 !important; }
  .notion-editor-content td p, .notion-editor-content th p { margin: 0 !important; }
  .notion-editor-content .selectedCell {
    background: rgba(99,102,241,0.1) !important;
    outline: 2px solid rgba(99,102,241,0.35) !important;
    outline-offset: -1px !important;
  }
  .notion-editor-content .column-resize-handle {
    position: absolute; right: -2px; top: 0; bottom: 0;
    width: 3px; background: #6366f1; pointer-events: none; z-index: 10;
  }
  .notion-editor-content .resize-cursor { cursor: col-resize !important; }
`;

interface NotionEditorProps {
  content: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
}

export const NotionEditor = ({ content, onChange, onBlur }: NotionEditorProps) => {
  const prevContent = useRef(content);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3] },
      }),
      TextStyle,        // required by Color
      Color,            // text color
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'Heading…';
          return "Type '/' for commands, or start writing…";
        },
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ inline: false, allowBase64: true }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      prevContent.current = html;
      onChange(html);
    },
    onBlur: () => onBlur?.(),
    editorProps: {
      attributes: {
        class: 'notion-editor-content min-h-[500px] focus:outline-none',
      },
    },
  });

  // Sync content when switching docs (only if actually different)
  useEffect(() => {
    if (editor && !editor.isDestroyed && content !== prevContent.current) {
      editor.commands.setContent(content || '<p></p>', { emitUpdate: false });
      prevContent.current = content;
    }
  }, [editor, content]);

  return (
    <div className="flex flex-col h-full w-full">
      <style>{EDITOR_STYLES}</style>

      {/* Toolbar */}
      {editor && <EditorToolbar editor={editor} />}

      {/* Canvas */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-[720px] mx-auto px-8 py-10 relative">
          {editor && <SlashCommandMenu editor={editor} />}
          <EditorContent editor={editor} className="w-full" />

          {/* Word / char count */}
          {editor && (
            <div className="mt-8 pt-4 border-t border-border/30 flex items-center gap-4 text-[11px] text-muted-foreground/50 select-none">
              <span>
                {editor.getText().trim().split(/\s+/).filter(Boolean).length} words
              </span>
              <span>{editor.getText().length} characters</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
