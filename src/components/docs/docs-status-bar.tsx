'use client';

import React from 'react';
import { CheckCircle2, Loader2, AlertCircle, Download } from 'lucide-react';
import { cn } from '@/lib';

interface DocsStatusBarProps {
  isDirty: boolean;
  isSaving: boolean;
  hasError: boolean;
  lastSaved: string | null;
  updatedAt?: string;
  docTitle?: string;
  docHtml?: string;
  onSave: () => void;
}

const downloadFile = (title: string, html: string) => {
  // Build a clean standalone HTML file
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 720px; margin: 60px auto; padding: 0 24px; line-height: 1.75; color: #111827; font-size: 16px; }
    h1 { font-size: 2rem; font-weight: 800; margin: 1.5rem 0 0.5rem; letter-spacing: -0.02em; }
    h2 { font-size: 1.5rem; font-weight: 700; margin: 1.25rem 0 0.4rem; }
    h3 { font-size: 1.15rem; font-weight: 600; margin: 1rem 0 0.3rem; }
    p  { margin: 0.3rem 0; }
    ul { list-style: disc; padding-left: 1.5rem; margin: 0.25rem 0; }
    ol { list-style: decimal; padding-left: 1.5rem; margin: 0.25rem 0; }
    blockquote { border-left: 3px solid #6366f1; padding: 0.6rem 1rem; margin: 0.75rem 0; background: #f5f3ff; border-radius: 0 0.5rem 0.5rem 0; color: #4b5563; font-style: italic; }
    code { background: #f3f4f6; padding: 0.1em 0.35em; border-radius: 0.3rem; font-family: monospace; font-size: 0.85em; color: #6366f1; }
    pre  { background: #1e2330; border-radius: 0.75rem; padding: 1rem 1.25rem; overflow-x: auto; margin: 0.75rem 0; }
    pre code { background: none; padding: 0; color: #e2e8f0; }
    mark { background: #fef08a; padding: 0.05em 0.2em; border-radius: 0.2em; color: #713f12; }
    a    { color: #6366f1; text-decoration: underline; }
    hr   { border: none; border-top: 2px solid #e5e7eb; margin: 1.5rem 0; }
    img  { max-width: 100%; border-radius: 0.75rem; margin: 0.75rem 0; display: block; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; border: 1px solid #d1d5db; border-radius: 0.5rem; overflow: hidden; }
    th { background: #f3f4f6; font-weight: 600; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.65rem 0.9rem; border: 1px solid #d1d5db; text-align: left; color: #374151; }
    td { padding: 0.6rem 0.9rem; border: 1px solid #d1d5db; vertical-align: top; }
    tr:nth-child(even) td { background: #f9fafb; }
    input[type="checkbox"] { accent-color: #6366f1; width: 16px; height: 16px; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${html}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'document'}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const DocsStatusBar = ({
  isDirty,
  isSaving,
  hasError,
  lastSaved,
  updatedAt,
  docTitle = 'Document',
  docHtml = '',
  onSave,
}: DocsStatusBarProps) => {
  return (
    <div className="flex items-center justify-between px-8 py-2 border-b border-border/40 bg-background/80 backdrop-blur-sm flex-shrink-0">
      {/* Left: meta */}
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60 select-none">
        {updatedAt && (
          <span>
            Last edited{' '}
            {new Date(updatedAt).toLocaleString([], {
              month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </span>
        )}
      </div>

      {/* Right: save status + actions */}
      <div className="flex items-center gap-2">
        {/* Status indicators */}
        {hasError && (
          <span className="flex items-center gap-1 text-[11px] text-destructive">
            <AlertCircle className="h-3 w-3" /> Save failed
          </span>
        )}
        {isSaving && (
          <span className="flex items-center gap-1 text-[11px] text-amber-500 animate-pulse">
            <Loader2 className="h-3 w-3 animate-spin" /> Saving…
          </span>
        )}
        {lastSaved && !isDirty && !isSaving && (
          <span className="flex items-center gap-1 text-[11px] text-emerald-500">
            <CheckCircle2 className="h-3 w-3" /> Saved {lastSaved}
          </span>
        )}
        {isDirty && !isSaving && (
          <span className="text-[11px] text-muted-foreground/50">Unsaved changes</span>
        )}

        {/* Download button */}
        <button
          onClick={() => downloadFile(docTitle, docHtml)}
          title="Download as HTML file"
          className="h-6 px-2.5 flex items-center gap-1.5 text-[11px] font-medium rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <Download className="h-3 w-3" />
          Export
        </button>

        {/* Save button */}
        <button
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className={cn(
            'h-6 px-3 text-[11px] font-semibold rounded-lg transition-all',
            isDirty && !isSaving
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
          )}
        >
          Save
        </button>
      </div>
    </div>
  );
};
