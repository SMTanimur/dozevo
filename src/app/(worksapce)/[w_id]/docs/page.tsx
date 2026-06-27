'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetDocs, useDocMutations, useGetSpaces } from '@/hooks';
import { IDoc } from '@/types';
import {
  DocsSidebar,
  DocsTitle,
  DocsStatusBar,
  CreateDocModal,
  NotionEditor,
} from '@/components/docs';

export default function DocsPage() {
  const { w_id } = useParams();
  const workspaceId = w_id as string;

  // ─── Data ────────────────────────────────────────────────────────────────
  const { data: spaces = [] } = useGetSpaces(workspaceId, { enabled: !!workspaceId });
  const [activeSpaceId, setActiveSpaceId] = useState('');

  useEffect(() => {
    if (spaces.length > 0 && !activeSpaceId) setActiveSpaceId(spaces[0]._id);
  }, [spaces, activeSpaceId]);

  const { data: docs = [], isLoading: isLoadingDocs } = useGetDocs(
    { workspaceId, spaceId: activeSpaceId },
    { enabled: !!workspaceId && !!activeSpaceId }
  );

  const { createDoc, updateDoc, deleteDoc } = useDocMutations();

  // ─── Sidebar ─────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpaceId, setNewDocSpaceId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (activeSpaceId) setNewDocSpaceId(activeSpaceId);
  }, [activeSpaceId]);

  // ─── Editor ──────────────────────────────────────────────────────────────
  const [selectedDoc, setSelectedDoc] = useState<IDoc | null>(null);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorHtml, setEditorHtml] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Populate editor when a doc is selected
  useEffect(() => {
    if (selectedDoc) {
      setEditorTitle(selectedDoc.name);
      setEditorHtml((selectedDoc.content?.body as string) ?? '<p></p>');
      setLastSaved(null);
      setIsDirty(false);
      setHasError(false);
    } else {
      setEditorTitle('');
      setEditorHtml('');
    }
  }, [selectedDoc]);

  // Auto-save: 2s debounce after any change
  useEffect(() => {
    if (!isDirty || !selectedDoc) return;
    const timer = setTimeout(handleSave, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorHtml, editorTitle, isDirty]);

  const handleSave = useCallback(async () => {
    if (!selectedDoc) return;
    setIsSaving(true);
    setHasError(false);
    try {
      const updated = await updateDoc({
        workspaceId,
        docId: selectedDoc._id,
        data: { name: editorTitle || selectedDoc.name, content: { body: editorHtml } },
      });
      setSelectedDoc(updated);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsDirty(false);
    } catch {
      setHasError(true);
    } finally {
      setIsSaving(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoc, editorTitle, editorHtml, workspaceId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocSpaceId) return;
    setIsCreating(true);
    try {
      const doc = await createDoc({
        workspaceId,
        data: {
          name: newDocName.trim(),
          spaceId: newDocSpaceId,
          content: { body: `<h1>${newDocName.trim()}</h1><p></p>` },
        },
      });
      setNewDocName('');
      setIsCreateOpen(false);
      setSelectedDoc(doc);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this document permanently?')) return;
    try {
      await deleteDoc({ workspaceId, docId });
      if (selectedDoc?._id === docId) setSelectedDoc(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <DocsSidebar
        docs={docs}
        spaces={spaces}
        activeSpaceId={activeSpaceId}
        selectedDocId={selectedDoc?._id}
        searchQuery={searchQuery}
        isLoading={isLoadingDocs}
        onSelectDoc={setSelectedDoc}
        onDeleteDoc={handleDelete}
        onSpaceChange={setActiveSpaceId}
        onSearchChange={setSearchQuery}
        onCreateClick={() => setIsCreateOpen(true)}
      />

      {/* Main editor area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
        {selectedDoc ? (
          <>
            {/* Status bar */}
            <DocsStatusBar
              isDirty={isDirty}
              isSaving={isSaving}
              hasError={hasError}
              lastSaved={lastSaved}
              updatedAt={selectedDoc.updatedAt}
              docTitle={editorTitle || selectedDoc.name}
              docHtml={editorHtml}
              onSave={handleSave}
            />

            {/* Notion-style page title */}
            <DocsTitle
              value={editorTitle}
              onChange={v => { setEditorTitle(v); setIsDirty(true); }}
            />

            {/* TipTap rich editor */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <NotionEditor
                content={editorHtml}
                onChange={html => { setEditorHtml(html); setIsDirty(true); }}
                onBlur={handleSave}
              />
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center shadow-inner">
              <FileText className="h-8 w-8 opacity-20" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">No document open</h2>
              <p className="text-sm text-muted-foreground/60 mt-1 max-w-xs">
                Select a document from the sidebar or create a new one.
              </p>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="rounded-xl px-5 h-9 text-sm font-semibold gap-2 bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
            >
              <Plus className="h-4 w-4" /> New Document
            </Button>
          </div>
        )}
      </div>

      {/* Create modal */}
      <CreateDocModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        name={newDocName}
        onNameChange={setNewDocName}
        spaceId={newDocSpaceId}
        onSpaceIdChange={setNewDocSpaceId}
        spaces={spaces}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />
    </div>
  );
}
