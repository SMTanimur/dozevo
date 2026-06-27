'use client';

import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface CreateDocModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  name: string;
  onNameChange: (v: string) => void;
  spaceId: string;
  onSpaceIdChange: (v: string) => void;
  spaces: Array<{ _id: string; name: string }>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export const CreateDocModal = ({
  open,
  onOpenChange,
  name,
  onNameChange,
  spaceId,
  onSpaceIdChange,
  spaces,
  onSubmit,
  isLoading,
}: CreateDocModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px] rounded-2xl p-6 bg-card border border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
              <FileText className="h-3.5 w-3.5 text-violet-500" />
            </div>
            New Document
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Document Name
            </Label>
            <Input
              autoFocus
              placeholder="e.g. Meeting Notes, Project Brief…"
              value={name}
              onChange={e => onNameChange(e.target.value)}
              className="h-9 rounded-xl text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Space
            </Label>
            <Select value={spaceId} onValueChange={onSpaceIdChange}>
              <SelectTrigger className="h-9 rounded-xl text-sm">
                <SelectValue placeholder="Select a space" />
              </SelectTrigger>
              <SelectContent>
                {spaces.map(s => (
                  <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2 gap-2 flex-row justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-8 rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !spaceId || isLoading}
              className="h-8 rounded-xl text-xs gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              {isLoading ? 'Creating…' : 'Create Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
