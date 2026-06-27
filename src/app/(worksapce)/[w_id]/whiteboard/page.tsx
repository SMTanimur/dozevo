'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Pencil, Plus, Search, Trash2, Save, Play, CheckCircle2,
  Calendar, Layers, ZoomIn, ZoomOut, MousePointer, Maximize
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
import { useGetWhiteboards, useWhiteboardMutations, useGetSpaces } from '@/hooks';
import { IFlowchart } from '@/types';

// React Flow imports
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function WhiteboardPage() {
  const { w_id } = useParams();
  const router = useRouter();
  const workspaceId = w_id as string;

  // Fetch spaces for dropdowns/filters
  const { data: spaces = [] } = useGetSpaces(workspaceId, { enabled: !!workspaceId });
  const [activeSpaceId, setActiveSpaceId] = useState('');

  useEffect(() => {
    if (spaces.length > 0 && !activeSpaceId) {
      setActiveSpaceId(spaces[0]._id);
    }
  }, [spaces, activeSpaceId]);

  // Fetch all whiteboards (flowcharts) for the active space
  const { data: whiteboards = [], isLoading: isLoadingWhiteboards } = useGetWhiteboards(
    { workspaceId, spaceId: activeSpaceId },
    { enabled: !!workspaceId && !!activeSpaceId }
  );

  // Mutations
  const { createWhiteboard, updateWhiteboard, deleteWhiteboard } = useWhiteboardMutations();

  // Dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardSpaceId, setNewBoardSpaceId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Editor states
  const [selectedBoard, setSelectedBoard] = useState<IFlowchart | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Set the selected space inside create modal when active space changes
  useEffect(() => {
    if (activeSpaceId) {
      setNewBoardSpaceId(activeSpaceId);
    }
  }, [activeSpaceId]);

  // Load selected whiteboard data
  useEffect(() => {
    if (selectedBoard && selectedBoard.data) {
      const boardData = selectedBoard.data as { nodes?: Node[]; edges?: Edge[] };
      setNodes(boardData.nodes || []);
      setEdges(boardData.edges || []);
      setLastSaved(null);
    } else if (selectedBoard) {
      // Default placeholder nodes if blank
      setNodes([
        {
          id: '1',
          position: { x: 250, y: 100 },
          data: { label: 'Start Node' },
          type: 'input',
        },
        {
          id: '2',
          position: { x: 250, y: 250 },
          data: { label: 'Action Node' },
        }
      ]);
      setEdges([
        {
          id: 'e1-2',
          source: '1',
          target: '2',
          animated: true,
        }
      ]);
      setLastSaved(null);
    } else {
      setNodes([]);
      setEdges([]);
      setLastSaved(null);
    }
  }, [selectedBoard, setNodes, setEdges]);

  // Filter whiteboards locally
  const filteredBoards = useMemo(() => {
    return whiteboards.filter(board =>
      board.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [whiteboards, searchQuery]);

  // Handle connection creation
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // Save current nodes & edges state
  const handleSaveBoard = async () => {
    if (!selectedBoard) return;
    setIsSaving(true);
    try {
      const updated = await updateWhiteboard({
        workspaceId,
        id: selectedBoard._id,
        data: {
          name: selectedBoard.name,
          data: { nodes, edges }
        }
      });
      setSelectedBoard(updated);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Add a new node programmatically
  const handleAddNode = (type?: 'input' | 'output' | 'default') => {
    const id = String(nodes.length + 1);
    const newNode: Node = {
      id,
      position: { x: 150 + Math.random() * 150, y: 150 + Math.random() * 150 },
      data: { label: `New Node ${id}` },
      type,
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Create new Whiteboard
  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim() || !newBoardSpaceId) return;

    try {
      const initialData = {
        nodes: [
          {
            id: '1',
            position: { x: 250, y: 100 },
            data: { label: 'Start Node' },
            type: 'input',
          }
        ],
        edges: []
      };

      const newBoard = await createWhiteboard({
        workspaceId,
        data: {
          name: newBoardName.trim(),
          space: newBoardSpaceId,
          data: initialData
        }
      });
      setNewBoardName('');
      setIsCreateOpen(false);
      setSelectedBoard(newBoard);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Whiteboard
  const handleDeleteBoard = async (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this whiteboard?')) return;
    
    try {
      await deleteWhiteboard({ workspaceId, id: boardId });
      if (selectedBoard?._id === boardId) {
        setSelectedBoard(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      {/* LEFT PANEL: Whiteboards list */}
      <div className="w-[340px] border-r border-border bg-card/40 backdrop-blur-sm flex flex-col flex-shrink-0 h-full">
        <div className="p-4 border-b border-border flex flex-col gap-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Pencil className="h-5 w-5 text-amber-500" />
              Whiteboards
            </h1>
            <Button
              onClick={() => setIsCreateOpen(true)}
              size="sm"
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg px-3 h-8 shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1" /> New
            </Button>
          </div>

          {/* Space filter */}
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
              placeholder="Search whiteboards..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm rounded-lg bg-muted/50 border-border focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* List scroll container */}
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="p-2.5 space-y-1.5">
            {isLoadingWhiteboards ? (
              <div className="p-8 text-center text-muted-foreground text-xs font-medium">
                Loading whiteboards...
              </div>
            ) : filteredBoards.length > 0 ? (
              filteredBoards.map(board => (
                <div
                  key={board._id}
                  onClick={() => setSelectedBoard(board)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer group ${
                    selectedBoard?._id === board._id
                      ? 'bg-primary/10 border-primary/30 text-primary shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-muted/50 text-foreground/90'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Layers className={`h-4.5 w-4.5 flex-shrink-0 ${
                      selectedBoard?._id === board._id ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold truncate">
                        {board.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(board.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteBoard(board._id, e)}
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Layers className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No whiteboards found</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Create one to start drawing</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* RIGHT PANEL: Live React Flow Canvas */}
      <div className="flex-1 bg-card/10 flex flex-col min-w-0 h-full relative">
        {selectedBoard ? (
          <div className="flex-1 flex flex-col min-h-0 h-full">
            {/* Editor Toolbar Header */}
            <div className="p-4 border-b border-border bg-card/60 backdrop-blur-md flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                  <Pencil className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Interactive Canvas
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
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddNode('input')}
                  className="rounded-lg h-9 font-semibold text-xs border border-border text-foreground hover:bg-muted"
                >
                  + Start Node
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddNode('default')}
                  className="rounded-lg h-9 font-semibold text-xs border border-border text-foreground hover:bg-muted"
                >
                  + Process Box
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddNode('output')}
                  className="rounded-lg h-9 font-semibold text-xs border border-border text-foreground hover:bg-muted"
                >
                  + End Node
                </Button>

                <div className="w-px h-6 bg-border mx-2" />

                <Button
                  onClick={handleSaveBoard}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg px-4 h-9 shadow-sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Board'}
                </Button>
              </div>
            </div>

            {/* React Flow Editor Workspace */}
            <div className="flex-1 w-full h-full min-h-0 bg-muted/20 relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                className="w-full h-full"
              >
                <Background color="#ccc" gap={16} />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-gradient-to-br from-background via-background to-primary/5">
            <div className="p-5 rounded-full bg-muted/40 mb-4 text-muted-foreground/40 shadow-inner">
              <Pencil className="h-12 w-12" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Select a Whiteboard</h2>
            <p className="text-sm text-muted-foreground/80 mt-1 max-w-[320px]">
              Choose a whiteboard diagram from the left list or create a new one to begin designing visual flowcharts.
            </p>
          </div>
        )}
      </div>

      {/* CREATE WHITEBOARD DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl p-6 bg-card border border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Create New Whiteboard
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateBoard} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="board-name" className="text-sm font-semibold">
                Whiteboard Name
              </Label>
              <Input
                id="board-name"
                type="text"
                placeholder="e.g. System Architecture, User Flow, Mind Map"
                value={newBoardName}
                onChange={e => setNewBoardName(e.target.value)}
                autoFocus
                className="w-full h-10 px-3 rounded-lg border border-border focus-visible:ring-1 focus-visible:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="board-space" className="text-sm font-semibold">
                Select Space
              </Label>
              <Select value={newBoardSpaceId} onOpenChange={() => {}} onValueChange={setNewBoardSpaceId}>
                <SelectTrigger id="board-space" className="w-full h-10 rounded-lg bg-card border-border shadow-sm text-sm">
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
                disabled={!newBoardName.trim() || !newBoardSpaceId}
                className="rounded-lg h-9 font-semibold text-xs bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm"
              >
                Create Whiteboard
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
