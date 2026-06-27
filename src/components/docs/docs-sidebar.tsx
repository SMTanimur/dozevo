'use client';

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { FileText, Plus, Search, Trash2, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib';
import { IDoc } from '@/types';

interface DocsSidebarProps {
  docs: IDoc[];
  spaces: Array<{ _id: string; name: string }>;
  activeSpaceId: string;
  selectedDocId?: string;
  searchQuery: string;
  isLoading: boolean;
  onSelectDoc: (doc: IDoc) => void;
  onDeleteDoc: (docId: string, e: React.MouseEvent) => void;
  onSpaceChange: (spaceId: string) => void;
  onSearchChange: (q: string) => void;
  onCreateClick: () => void;
}

export const DocsSidebar = ({
  docs,
  spaces,
  activeSpaceId,
  selectedDocId,
  searchQuery,
  isLoading,
  onSelectDoc,
  onDeleteDoc,
  onSpaceChange,
  onSearchChange,
  onCreateClick,
}: DocsSidebarProps) => {
  const filtered = useMemo(
    () => docs.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [docs, searchQuery]
  );

  return (
    <aside className="w-[240px] min-w-[240px] border-r border-border/60 bg-card/30 backdrop-blur-sm flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border/50 flex flex-col gap-2.5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-violet-500" />
            Wiki Docs
          </span>
          <Button
            onClick={onCreateClick}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Space selector */}
        <Select value={activeSpaceId} onValueChange={onSpaceChange}>
          <SelectTrigger className="w-full h-7 rounded-lg bg-muted/40 border-transparent text-xs font-medium">
            <SelectValue placeholder="Select space" />
          </SelectTrigger>
          <SelectContent>
            {spaces.map(s => (
              <SelectItem key={s._id} value={s._id} className="text-xs">{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1.5 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search docs…"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-7 h-7 text-xs rounded-lg bg-muted/30 border-transparent focus-visible:ring-1 focus-visible:ring-primary/30"
          />
        </div>
      </div>

      {/* Doc list */}
      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-2 space-y-0.5">
          {isLoading ? (
            <div className="space-y-1.5 pt-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-8 rounded-lg bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((doc, idx) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.2 }}
                onClick={() => onSelectDoc(doc)}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer group transition-all duration-150',
                  selectedDocId === doc._id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted/60 text-foreground/80 hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <File className={cn('h-3 w-3 flex-shrink-0', selectedDocId === doc._id ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="text-xs font-medium truncate">{doc.name}</span>
                </div>
                <button
                  onClick={(e) => onDeleteDoc(doc._id, e)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              <File className="h-6 w-6 mx-auto mb-2 opacity-20" />
              <p className="text-xs">
                {searchQuery ? 'No matching docs' : 'No documents yet'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border/50 flex-shrink-0">
        <button
          onClick={onCreateClick}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          New Document
        </button>
      </div>
    </aside>
  );
};
