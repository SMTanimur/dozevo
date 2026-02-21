'use client';

import React, { useState } from 'react';
import { IList } from '@/types';
import { useCreateStatus } from '@/hooks/list/useStatusMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LayoutTemplate,
  Plus,
  Palette,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StatusTemplate {
  name: string;
  description: string;
  statuses: { status: string; color: string; type: 'open' | 'in_progress' | 'done' | 'closed' | 'custom'; orderindex: number }[];
}

const STATUS_TEMPLATES: StatusTemplate[] = [
  {
    name: 'Simple',
    description: 'A basic workflow for most projects',
    statuses: [
      { status: 'Open', color: '#6B7280', type: 'open', orderindex: 0 },
      { status: 'In Progress', color: '#3B82F6', type: 'in_progress', orderindex: 1 },
      { status: 'Done', color: '#10B981', type: 'done', orderindex: 2 },
    ],
  },
  {
    name: 'Kanban',
    description: 'For Kanban-style task tracking',
    statuses: [
      { status: 'To Do', color: '#6B7280', type: 'open', orderindex: 0 },
      { status: 'In Progress', color: '#3B82F6', type: 'in_progress', orderindex: 1 },
      { status: 'Review', color: '#F59E0B', type: 'custom', orderindex: 2 },
      { status: 'Done', color: '#10B981', type: 'done', orderindex: 3 },
    ],
  },
  {
    name: 'Bug Tracking',
    description: 'For tracking bugs & issues',
    statuses: [
      { status: 'Open', color: '#EF4444', type: 'open', orderindex: 0 },
      { status: 'Confirmed', color: '#F59E0B', type: 'custom', orderindex: 1 },
      { status: 'In Progress', color: '#3B82F6', type: 'in_progress', orderindex: 2 },
      { status: 'Fixed', color: '#10B981', type: 'done', orderindex: 3 },
      { status: 'Closed', color: '#6B7280', type: 'closed', orderindex: 4 },
    ],
  },
  {
    name: 'Content',
    description: 'For content creation workflows',
    statuses: [
      { status: 'Draft', color: '#6B7280', type: 'open', orderindex: 0 },
      { status: 'Writing', color: '#8B5CF6', type: 'in_progress', orderindex: 1 },
      { status: 'Review', color: '#F59E0B', type: 'custom', orderindex: 2 },
      { status: 'Published', color: '#10B981', type: 'done', orderindex: 3 },
    ],
  },
];

const PRESET_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
  '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6',
];

interface StatusSetupEmptyStateProps {
  list: IList;
}

export const StatusSetupEmptyState: React.FC<StatusSetupEmptyStateProps> = ({
  list,
}) => {
  const [mode, setMode] = useState<'choose' | 'custom'>('choose');
  const [isApplying, setIsApplying] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Custom status creation state
  const [customStatuses, setCustomStatuses] = useState<
    { status: string; color: string; type: 'open' | 'in_progress' | 'done' | 'custom' }[]
  >([
    { status: '', color: '#3B82F6', type: 'open' },
  ]);

  const { mutateAsync: createStatus } = useCreateStatus();

  const handleApplyTemplate = async (template: StatusTemplate) => {
    setIsApplying(true);
    setSelectedTemplate(template.name);
    try {
      for (const status of template.statuses) {
        await createStatus({
          workspaceId: list.workspace as string,
          spaceId: list.space as string,
          listId: list._id,
          data: status,
        });
      }
      toast.success(`"${template.name}" template applied!`);
    } catch {
      toast.error('Failed to create statuses. Please try again.');
    } finally {
      setIsApplying(false);
      setSelectedTemplate(null);
    }
  };

  const handleAddCustomStatus = () => {
    setCustomStatuses(prev => [
      ...prev,
      { status: '', color: PRESET_COLORS[prev.length % PRESET_COLORS.length], type: 'custom' },
    ]);
  };

  const handleRemoveCustomStatus = (index: number) => {
    if (customStatuses.length <= 1) return;
    setCustomStatuses(prev => prev.filter((_, i) => i !== index));
  };

  const handleCustomStatusChange = (index: number, field: string, value: string) => {
    setCustomStatuses(prev =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleApplyCustom = async () => {
    const validStatuses = customStatuses.filter(s => s.status.trim());
    if (validStatuses.length === 0) {
      toast.error('Add at least one status name');
      return;
    }
    setIsApplying(true);
    try {
      for (let i = 0; i < validStatuses.length; i++) {
        const s = validStatuses[i];
        await createStatus({
          workspaceId: list.workspace as string,
          spaceId: list.space as string,
          listId: list._id,
          data: {
            status: s.status.trim(),
            color: s.color,
            type: i === 0 ? 'open' : i === validStatuses.length - 1 ? 'done' : 'in_progress',
            orderindex: i,
          },
        });
      }
      toast.success('Custom statuses created!');
    } catch {
      toast.error('Failed to create statuses. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <LayoutTemplate className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Set Up Your Workflow
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Choose a status template to get started quickly, or create your own custom statuses.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-2 mb-8 p-1 rounded-lg bg-muted">
        <button
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            mode === 'choose'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setMode('choose')}
        >
          <LayoutTemplate className="h-4 w-4 inline mr-2" />
          Templates
        </button>
        <button
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            mode === 'custom'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setMode('custom')}
        >
          <Palette className="h-4 w-4 inline mr-2" />
          Custom
        </button>
      </div>

      {/* Templates View */}
      {mode === 'choose' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {STATUS_TEMPLATES.map((template) => (
            <div
              key={template.name}
              className="group relative border border-border rounded-xl p-5 bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
              onClick={() => !isApplying && handleApplyTemplate(template)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{template.name}</h4>
                {isApplying && selectedTemplate === template.name ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {template.statuses.map((s) => (
                  <span
                    key={s.status}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.status}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom View */}
      {mode === 'custom' && (
        <div className="w-full max-w-lg space-y-4">
          {customStatuses.map((status, index) => (
            <div key={index} className="flex items-center gap-3">
              {/* Color picker */}
              <div className="relative">
                <input
                  type="color"
                  value={status.color}
                  onChange={(e) => handleCustomStatusChange(index, 'color', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-border cursor-pointer appearance-none bg-transparent p-0"
                  style={{ backgroundColor: status.color }}
                />
              </div>

              {/* Status name */}
              <Input
                value={status.status}
                onChange={(e) => handleCustomStatusChange(index, 'status', e.target.value)}
                placeholder={index === 0 ? 'e.g. To Do' : index === 1 ? 'e.g. In Progress' : 'e.g. Done'}
                className="flex-1"
              />

              {/* Remove button */}
              {customStatuses.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveCustomStatus(index)}
                >
                  ×
                </Button>
              )}
            </div>
          ))}

          {/* Quick color presets */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground">Quick colors:</span>
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                className="w-5 h-5 rounded-full border border-border hover:scale-125 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => {
                  const lastIndex = customStatuses.length - 1;
                  handleCustomStatusChange(lastIndex, 'color', color);
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddCustomStatus}
              className="gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Status
            </Button>
            <Button
              size="sm"
              onClick={handleApplyCustom}
              disabled={isApplying || customStatuses.every(s => !s.status.trim())}
              className="gap-1"
            >
              {isApplying ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Create Statuses
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
