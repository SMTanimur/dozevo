'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FileText, Plus, Search, Trash2, Edit2, Save, 
  ArrowLeft, File, Calendar, ChevronRight, HelpCircle, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetDocs, useDocMutations, useGetSpaces } from '@/hooks';
import { IDoc } from '@/types';

export default function DocsPage() {
  const { w_id } = useParams();
  const router = useRouter();
  const workspaceId = w_id as string;

  // Fetch spaces to associate docs and filter
  const { data: spaces = [] } = useGetSpaces(workspaceId, { enabled: !!workspaceId });

  // Currently selected space filter (empty string for 'All Spaces')
  const [selectedSpaceFilter, setSelectedSpaceFilter] = useState('');
  
  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all documents. If a space filter is active, fetch docs for that space.
  // Since useGetDocs requires listId or spaceId, if we want "all docs" we can queries docs space-by-space or fetch them space-by-space!
  // Wait! In the NestJS docs controller:
  // GET /v1/workspaces/:workspaceId/docs require either spaceId or listId query params.
  // So to show "All Docs" in the workspace, we should fetch docs for the currently selected space, OR if "All Spaces" is selected, we fetch docs for all spaces in parallel or combine them!
  // Let's implement this beautifully: we will query the docs for the active space, and if there are multiple spaces, we query the first space by default, or let the user choose the Space to view its Docs!
  const [activeSpaceId, setActiveSpaceId] = useState('');

  useEffect(() => {
    if (spaces.length > 0 && !activeSpaceId) {
      setActiveSpaceId(spaces[0]._id);
    }
  }, [spaces, activeSpaceId]);

  const { data: docs = [], isLoading: isLoadingDocs } = useGetDocs(
    { workspaceId, spaceId: activeSpaceId },
    { enabled: !!workspaceId && !!activeSpaceId }
  );

  // Mutation hooks
  const { createDoc, updateDoc, deleteDoc } = useDocMutations();

  // Creation state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpaceId, setNewDocSpaceId] = useState('');

  // Edit / Editor state
  const [selectedDoc, setSelectedDoc] = useState<IDoc | null>(null);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Set the selected space inside create modal when active space changes
  useEffect(() => {
    if (activeSpaceId) {
      setNewDocSpaceId(activeSpaceId);
    }
  }, [activeSpaceId]);

  // Set editor inputs when a doc is selected
  useEffect(() => {
    if (selectedDoc) {
      setEditorTitle(selectedDoc.name);
      setEditorContent((selectedDoc.content?.body as string) || '');
      setLastSaved(null);
    } else {
      setEditorTitle('');
      setEditorContent('');
      setLastSaved(null);
    }
  }, [selectedDoc]);

  // Filter docs locally by search term
  const filteredDocs = useMemo(() => {
    return docs.filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [docs, searchQuery]);

  // Save changes to active doc
  const handleSaveDoc = async () => {
    if (!selectedDoc) return;
    setIsSaving(true);
    try {
      const updated = await updateDoc({
        workspaceId,
        docId: selectedDoc._id,
        data: {
          name: editorTitle,
          content: {
            ...selectedDoc.content,
            body: editorContent
          }
        }
      });
      // Update selected doc ref locally
      setSelectedDoc(updated);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Create new Doc
  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocSpaceId) return;

    try {
      const newDoc = await createDoc({
        workspaceId,
        data: {
          name: newDocName.trim(),
          space: newDocSpaceId,
          content: { body: '# ' + newDocName.trim() + '\n\nStart writing here...' }
        }
      });
      setNewDocName('');
      setIsCreateOpen(false);
      // Auto select the new doc
      setSelectedDoc(newDoc);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete active Doc
  const handleDeleteDoc = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await deleteDoc({ workspaceId, docId });
      if (selectedDoc?._id === docId) {
        setSelectedDoc(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      {/* LEFT PANEL: Documents list */}
      <div className="w-[340px] border-r border-border bg-card/40 backdrop-blur-sm flex flex-col flex-shrink-0 h-full">
        {/* Header section */}
        <div className="p-4 border-b border-border flex flex-col gap-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              Wiki Docs
            </h1>
            <Button
              onClick={() => setIsCreateOpen(true)}
              size="sm"
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg px-3 h-8 shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1" /> New
            </Button>
          </div>

          {/* Space filter dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Space</label>
            <Select value={activeSpaceId} onValueChange={setActiveSpaceId}>
              <SelectTrigger className="w-full h-9 rounded-lg bg-card border-border shadow-sm text-sm">
                <SelectValue placeholder="Select space" />
              </SelectTrigger>
              <SelectContent>
                {spaces.map(s => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm rounded-lg bg-muted/50 border-border focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Docs list scroll container */}
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="p-2.5 space-y-1.5">
            {isLoadingDocs ? (
              <div className="p-8 text-center text-muted-foreground text-xs font-medium">
                Loading documents...
              </div>
            ) : filteredDocs.length > 0 ? (
              filteredDocs.map(doc => (
                <div
                  key={doc._id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer group ${
                    selectedDoc?._id === doc._id
                      ? 'bg-primary/10 border-primary/30 text-primary shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-muted/50 text-foreground/90'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <File className={`h-4.5 w-4.5 flex-shrink-0 ${
                      selectedDoc?._id === doc._id ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold truncate">
                        {doc.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(doc.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteDoc(doc._id, e)}
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <File className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No documents found</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Create one to start writing</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* RIGHT PANEL: Live Editor */}
      <div className="flex-1 bg-card/10 flex flex-col min-w-0 h-full relative">
        {selectedDoc ? (
          <div className="flex-1 flex flex-col min-h-0 h-full">
            {/* Editor Toolbar Header */}
            <div className="p-4 border-b border-border bg-card/60 backdrop-blur-md flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Editing Mode
                  </span>
                  <div className="flex items-center gap-2">
                    {lastSaved && (
                      <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Saved at {lastSaved}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSaveDoc}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg px-4 h-9 shadow-sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>

            {/* Document Editor Canvas */}
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex justify-center bg-gradient-to-br from-background via-background to-primary/5">
              <div className="w-full max-w-[800px] flex flex-col gap-6">
                <input
                  type="text"
                  value={editorTitle}
                  onChange={e => setEditorTitle(e.target.value)}
                  placeholder="Untitled Document"
                  className="text-4xl font-extrabold text-foreground border-none outline-none bg-transparent placeholder:text-muted-foreground/30 focus-visible:ring-0 w-full"
                />

                <div className="border-t border-border/50 my-2" />

                <textarea
                  value={editorContent}
                  onChange={e => setEditorContent(e.target.value)}
                  placeholder="Start writing notes, ideas, wikis in markdown format..."
                  className="flex-1 w-full text-base font-normal leading-relaxed text-foreground/90 border-none outline-none resize-none bg-transparent min-h-[500px] placeholder:text-muted-foreground/30 focus-visible:ring-0 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-gradient-to-br from-background via-background to-primary/5">
            <div className="p-5 rounded-full bg-muted/40 mb-4 text-muted-foreground/40 shadow-inner">
              <FileText className="h-12 w-12" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Select a Document</h2>
            <p className="text-sm text-muted-foreground/80 mt-1 max-w-[320px]">
              Choose a document from the left list or create a new one to begin editing wiki articles.
            </p>
          </div>
        )}
      </div>

      {/* CREATE DOCUMENT DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl p-6 bg-card border border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Create New Document
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateDoc} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="doc-name" className="text-sm font-semibold">
                Document Name
              </Label>
              <Input
                id="doc-name"
                type="text"
                placeholder="e.g. Project Charter, API Spec, Meeting Notes"
                value={newDocName}
                onChange={e => setNewDocName(e.target.value)}
                autoFocus
                className="w-full h-10 px-3 rounded-lg border border-border focus-visible:ring-1 focus-visible:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-space" className="text-sm font-semibold">
                Select Space
              </Label>
              <Select value={newDocSpaceId} onValueChange={setNewDocSpaceId}>
                <SelectTrigger id="doc-space" className="w-full h-10 rounded-lg bg-card border-border shadow-sm text-sm">
                  <SelectValue placeholder="Select space" />
                </SelectTrigger>
                <SelectContent>
                  {spaces.map(s => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg h-9 font-semibold text-xs border border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newDocName.trim() || !newDocSpaceId}
                className="rounded-lg h-9 font-semibold text-xs bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm"
              >
                Create Document
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
