'use client';

import React, { useState } from 'react';
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

const downloadDocx = async (
  title: string,
  html: string,
  setDownloading: (v: boolean) => void
) => {
  setDownloading(true);
  try {
    // Dynamically import to avoid SSR issues
    const HTMLtoDOCX = (await import('html-to-docx')).default;

    // Wrap content in a full HTML document for the converter
    const fullHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${title}</title></head>
<body>
  <h1>${title}</h1>
  ${html}
</body>
</html>`;

    const docxBlob = await HTMLtoDOCX(fullHtml, undefined, {
      table: { row: { cantSplit: true } },
      footer: false,
      pageNumber: false,
      font: 'Calibri',
      fontSize: 22,
      margins: { top: 720, right: 900, bottom: 720, left: 900 },
    });

    const url = URL.createObjectURL(docxBlob as Blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'document'}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('DOCX export failed:', err);
    alert('Failed to export as .docx. Please try again.');
  } finally {
    setDownloading(false);
  }
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
  const [isDownloading, setIsDownloading] = useState(false);
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

        {/* Download .docx button */}
        <button
          onClick={() => downloadDocx(docTitle, docHtml, setIsDownloading)}
          disabled={isDownloading}
          title="Download as Word document (.docx)"
          className="h-6 px-2.5 flex items-center gap-1.5 text-[11px] font-medium rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading
            ? <Loader2 className="h-3 w-3 animate-spin" />
            : <Download className="h-3 w-3" />}
          {isDownloading ? 'Exporting…' : 'Export .docx'}
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
