'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Pencil, Plus, Search, Trash2, Save, Play, CheckCircle2,
  Calendar, Layers, ZoomIn, ZoomOut, MousePointer, Maximize,
  Database, FileText, HelpCircle, RefreshCw
} from 'lucide-react';
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
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// ----------------------------------------------------
// CUSTOM FLOWCHART NODE COMPONENTS WITH SHAPES
// ----------------------------------------------------

// 1. Start Node (Pill)
const StartNode = ({ id, data }: any) => {
  const [val, setVal] = useState(data.label || '');
  
  useEffect(() => {
    setVal(data.label || '');
  }, [data.label]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setVal(newVal);
    if (data.onChange) {
      data.onChange(newVal);
    }
  };

  return (
    <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-emerald-800 dark:text-emerald-400 min-w-[165px] font-semibold text-center justify-center relative group">
      <input
        value={val}
        onChange={onChange}
        placeholder="Start Flow"
        className="bg-transparent border-none outline-none font-bold text-center w-full focus:ring-0 text-sm text-emerald-800 dark:text-emerald-300"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-emerald-500 !w-2.5 !h-2.5 !border-2 !border-background shadow-md cursor-crosshair hover:scale-125 transition-transform"
      />
    </div>
  );
};

// 2. End Node (Pill)
const EndNode = ({ id, data }: any) => {
  const [val, setVal] = useState(data.label || '');

  useEffect(() => {
    setVal(data.label || '');
  }, [data.label]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setVal(newVal);
    if (data.onChange) {
      data.onChange(newVal);
    }
  };

  return (
    <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-rose-500/10 dark:bg-rose-500/5 border-2 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.15)] text-rose-800 dark:text-rose-400 min-w-[165px] font-semibold text-center justify-center relative group">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-rose-500 !w-2.5 !h-2.5 !border-2 !border-background shadow-md cursor-crosshair hover:scale-125 transition-transform"
      />
      <input
        value={val}
        onChange={onChange}
        placeholder="End Flow"
        className="bg-transparent border-none outline-none font-bold text-center w-full focus:ring-0 text-sm text-rose-800 dark:text-rose-300"
      />
    </div>
  );
};

// 3. Process Node (Rectangle Box)
const ProcessNode = ({ id, data }: any) => {
  const [val, setVal] = useState(data.label || '');

  useEffect(() => {
    setVal(data.label || '');
  }, [data.label]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setVal(newVal);
    if (data.onChange) {
      data.onChange(newVal);
    }
  };

  return (
    <div className="flex flex-col rounded-xl bg-card border border-border shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] overflow-hidden min-w-[210px] transition-all duration-300 relative group">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-blue-500 !w-2.5 !h-2.5 !border-2 !border-background shadow-md cursor-crosshair"
      />
      
      {/* Top Accent Strip */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 w-full" />
      
      <div className="p-3.5 bg-card/90 dark:bg-zinc-900/90 flex flex-col gap-1 items-center justify-center">
        <input
          value={val}
          onChange={onChange}
          placeholder="Process Step"
          className="w-full bg-muted/40 hover:bg-muted/70 focus:bg-background rounded-lg px-2.5 py-1.5 border border-transparent hover:border-border/50 focus:border-primary/50 text-sm font-semibold text-foreground text-center outline-none transition-all"
        />
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-blue-500 !w-2.5 !h-2.5 !border-2 !border-background shadow-md cursor-crosshair"
      />
    </div>
  );
};

// 4. Decision Node (Diamond Shape)
const DecisionNode = ({ id, data }: any) => {
  const [val, setVal] = useState(data.label || '');
  
  useEffect(() => {
    setVal(data.label || '');
  }, [data.label]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setVal(newVal);
    if (data.onChange) {
      data.onChange(newVal);
    }
  };

  return (
    <div className="relative w-28 h-28 flex items-center justify-center group">
      {/* Rotated Square for Diamond Shape */}
      <div className="absolute inset-0 rotate-45 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:scale-105 transition-transform duration-300" />
      
      {/* Handles on 4 sides */}
      <Handle type="target" position={Position.Top} className="!bg-amber-500 !w-2 !h-2 !border-2 !border-background cursor-crosshair" />
      <Handle type="source" position={Position.Bottom} className="!bg-amber-500 !w-2 !h-2 !border-2 !border-background cursor-crosshair" />
      <Handle type="target" position={Position.Left} className="!bg-amber-500 !w-2 !h-2 !border-2 !border-background cursor-crosshair" />
      <Handle type="source" position={Position.Right} className="!bg-amber-500 !w-2 !h-2 !border-2 !border-background cursor-crosshair" />

      {/* Upright Text Container */}
      <div className="z-10 px-2.5 text-center w-full">
        <input
          value={val}
          onChange={onChange}
          placeholder="Is Approved?"
          className="bg-transparent border-none outline-none font-bold text-center w-full focus:ring-0 text-xs text-amber-800 dark:text-amber-300"
        />
      </div>
    </div>
  );
};

// 5. Database Cylinder Node
const DatabaseNode = ({ id, data }: any) => {
  const [val, setVal] = useState(data.label || '');

  useEffect(() => {
    setVal(data.label || '');
  }, [data.label]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setVal(newVal);
    if (data.onChange) {
      data.onChange(newVal);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between rounded-lg bg-indigo-500/10 dark:bg-indigo-500/5 border-2 border-indigo-500 shadow-[0_6px_20px_rgba(0,0,0,0.06)] w-24 h-28 relative group">
      {/* Cylindrical Ellipse tops/bottoms */}
      <div className="absolute -top-1.5 left-[-2px] right-[-2px] h-3 rounded-[50%] bg-indigo-500/15 border-2 border-indigo-500" />
      <div className="absolute bottom-[-2px] left-[-2px] right-[-2px] h-3.5 rounded-[50%] bg-indigo-500 border-2 border-indigo-500" />
      
      <Handle type="target" position={Position.Top} className="!bg-indigo-500 !w-2 !h-2 !border-2 !border-background cursor-crosshair" />
      <Handle type="source" position={Position.Bottom} className="!bg-indigo-500 !w-2 !h-2 !border-2 !border-background cursor-crosshair" />
      <Handle type="target" position={Position.Left} className="!bg-indigo-500 !w-2 !h-2 !border-2 !border-background cursor-crosshair" />
      <Handle type="source" position={Position.Right} className="!bg-indigo-500 !w-2 !h-2 !border-2 !border-background cursor-crosshair" />

      <div className="my-auto px-2 text-center w-full z-10 flex flex-col items-center gap-1 mt-3">
        <Database className="h-4 w-4 text-indigo-500" />
        <input
          value={val}
          onChange={onChange}
          placeholder="Database"
          className="bg-transparent border-none outline-none font-bold text-center w-full focus:ring-0 text-[11px] text-indigo-800 dark:text-indigo-300"
        />
      </div>
    </div>
  );
};

// 6. Document Node (Folded Corner)
const DocumentNode = ({ id, data }: any) => {
  const [val, setVal] = useState(data.label || '');

  useEffect(() => {
    setVal(data.label || '');
  }, [data.label]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setVal(newVal);
    if (data.onChange) {
      data.onChange(newVal);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-tr-2xl rounded-bl-sm rounded-br-sm rounded-tl-sm bg-purple-500/10 dark:bg-purple-500/5 border-2 border-purple-500 shadow-[0_6px_20px_rgba(0,0,0,0.06)] w-24 h-28 relative group">
      {/* Folded Corner Triangle */}
      <div className="absolute top-[-2px] right-[-2px] w-4.5 h-4.5 border-l-2 border-b-2 border-purple-500 bg-card rounded-bl-lg" />

      <Handle type="target" position={Position.Top} className="!bg-purple-500 !w-2 !h-2 !border-2 !border-background cursor-crosshair" />
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500 !w-2 !h-2 !border-2 !border-background cursor-crosshair" />
      <Handle type="target" position={Position.Left} className="!bg-purple-500 !w-2 !h-2 !border-2 !border-background cursor-crosshair" />
      <Handle type="source" position={Position.Right} className="!bg-purple-500 !w-2 !h-2 !border-2 !border-background cursor-crosshair" />

      <div className="px-2 text-center w-full z-10 flex flex-col items-center gap-1">
        <FileText className="h-4 w-4 text-purple-500" />
        <input
          value={val}
          onChange={onChange}
          placeholder="Document"
          className="bg-transparent border-none outline-none font-bold text-center w-full focus:ring-0 text-[11px] text-purple-800 dark:text-purple-300"
        />
      </div>
    </div>
  );
};

const nodeTypes = {
  customInput: StartNode,
  customOutput: EndNode,
  customDefault: ProcessNode,
  customDecision: DecisionNode,
  customDatabase: DatabaseNode,
  customDocument: DocumentNode,
};

// ----------------------------------------------------
// MAIN WHITEBOARD PAGE COMPONENT
// ----------------------------------------------------

export default function WhiteboardPage() {
  const { w_id } = useParams();
  const workspaceId = w_id as string;

  // Fetch spaces
  const { data: spaces = [] } = useGetSpaces(workspaceId, { enabled: !!workspaceId });
  const [activeSpaceId, setActiveSpaceId] = useState('');

  useEffect(() => {
    if (spaces.length > 0 && !activeSpaceId) {
      setActiveSpaceId(spaces[0]._id);
    }
  }, [spaces, activeSpaceId]);

  // Fetch all whiteboards
  const { data: whiteboards = [], isLoading: isLoadingWhiteboards } = useGetWhiteboards(
    { workspaceId, spaceId: activeSpaceId },
    { enabled: !!workspaceId && !!activeSpaceId }
  );

  // Mutations
  const { createWhiteboard, updateWhiteboard, deleteWhiteboard } = useWhiteboardMutations();

  // Dialog and navigation states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardSpaceId, setNewBoardSpaceId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Editor node/edge states
  const [selectedBoard, setSelectedBoard] = useState<IFlowchart | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    if (activeSpaceId) {
      setNewBoardSpaceId(activeSpaceId);
    }
  }, [activeSpaceId]);

  // Update node label callback
  const updateNodeLabel = useCallback((nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newLabel,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Load flowchart layout
  useEffect(() => {
    if (selectedBoard && selectedBoard.data) {
      const boardData = selectedBoard.data as { nodes?: Node[]; edges?: Edge[] };
      const rawNodes = boardData.nodes || [];
      const rawEdges = boardData.edges || [];
      
      const mappedNodes = rawNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onChange: (val: string) => updateNodeLabel(node.id, val)
        }
      }));

      setNodes(mappedNodes);
      setEdges(rawEdges);
      setLastSaved(null);
    } else if (selectedBoard) {
      // Default nodes if new/blank
      const defaultNodes: Node[] = [
        {
          id: '1',
          position: { x: 250, y: 80 },
          data: { label: 'Start Flow' },
          type: 'customInput',
        },
        {
          id: '2',
          position: { x: 250, y: 220 },
          data: { label: 'Decision Logic' },
          type: 'customDecision',
        }
      ];

      const mappedDefaults = defaultNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onChange: (val: string) => updateNodeLabel(node.id, val)
        }
      }));

      setNodes(mappedDefaults);
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
  }, [selectedBoard, setNodes, setEdges, updateNodeLabel]);

  // Filter boards locally
  const filteredBoards = useMemo(() => {
    return whiteboards.filter(board =>
      board.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [whiteboards, searchQuery]);

  // Add edge connection
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // Save layout
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

  // Add custom shape nodes programmatically
  const handleAddNode = (type: 'customInput' | 'customDefault' | 'customOutput' | 'customDecision' | 'customDatabase' | 'customDocument') => {
    const id = String(nodes.length + 1);
    let initialLabel = 'Process Step';
    if (type === 'customInput') initialLabel = 'Start Flow';
    if (type === 'customOutput') initialLabel = 'End Flow';
    if (type === 'customDecision') initialLabel = 'Is Approved?';
    if (type === 'customDatabase') initialLabel = 'Save to DB';
    if (type === 'customDocument') initialLabel = 'Generate Doc';

    const newNode: Node = {
      id,
      position: { x: 200 + Math.random() * 100, y: 150 + Math.random() * 100 },
      data: { 
        label: initialLabel,
        onChange: (val: string) => updateNodeLabel(id, val)
      },
      type,
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Delete selected nodes/edges from canvas
  const handleDeleteSelected = () => {
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => eds.filter((e) => !e.selected));
  };

  // Clear Canvas completely
  const handleClearCanvas = () => {
    if (confirm('Clear the entire whiteboard canvas?')) {
      setNodes([]);
      setEdges([]);
    }
  };

  // Create Whiteboard
  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim() || !newBoardSpaceId) return;

    try {
      const initialNodes: Node[] = [
        {
          id: '1',
          position: { x: 250, y: 100 },
          data: { label: 'Start Flow' },
          type: 'customInput',
        }
      ];

      const newBoard = await createWhiteboard({
        workspaceId,
        data: {
          name: newBoardName.trim(),
          spaceId: newBoardSpaceId,
          data: {
            nodes: initialNodes,
            edges: []
          }
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

        {/* Scrollable list */}
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

      {/* RIGHT PANEL: Live Flow Canvas */}
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
                    Flowchart Palette
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
                  onClick={() => handleAddNode('customInput')}
                  className="rounded-lg h-9 font-semibold text-xs border border-border text-foreground hover:bg-muted"
                >
                  🟢 Start
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddNode('customDefault')}
                  className="rounded-lg h-9 font-semibold text-xs border border-border text-foreground hover:bg-muted"
                >
                  🟦 Process
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddNode('customDecision')}
                  className="rounded-lg h-9 font-semibold text-xs border border-border text-foreground hover:bg-muted"
                >
                  🔶 Decision
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddNode('customDatabase')}
                  className="rounded-lg h-9 font-semibold text-xs border border-border text-foreground hover:bg-muted"
                >
                  💾 Database
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddNode('customDocument')}
                  className="rounded-lg h-9 font-semibold text-xs border border-border text-foreground hover:bg-muted"
                >
                  📄 Doc
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddNode('customOutput')}
                  className="rounded-lg h-9 font-semibold text-xs border border-border text-foreground hover:bg-muted"
                >
                  🛑 End
                </Button>

                <div className="w-px h-6 bg-border mx-2" />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="rounded-lg h-9 font-semibold text-xs border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-950 dark:hover:bg-red-950/20"
                >
                  Delete Selected
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCanvas}
                  className="rounded-lg h-9 font-semibold text-xs border border-border text-foreground hover:bg-muted"
                >
                  Clear All
                </Button>

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
                nodeTypes={nodeTypes}
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
