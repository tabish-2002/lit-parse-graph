import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  NodeChange,
  EdgeChange,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit3, Save, X } from "lucide-react";
import { toast } from "sonner";

interface ProteinGraphVisualizationProps {
  selectedProtein: string | null;
  onProteinSelect: (protein: string) => void;
  graphData: any;
  searchQuery: string;
}

// Custom node component for proteins
const ProteinNode = ({ data, selected }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const handleSave = () => {
    data.onLabelChange?.(data.id, label);
    setIsEditing(false);
    toast(`Protein ${data.id} renamed to ${label}`);
  };

  const handleCancel = () => {
    setLabel(data.label);
    setIsEditing(false);
  };

  return (
    <div className={`px-4 py-2 shadow-lg rounded-lg border-2 transition-all duration-200 ${
      selected 
        ? 'border-primary bg-primary text-primary-foreground shadow-node' 
        : data.type === 'protein' 
          ? 'border-protein-primary bg-card text-card-foreground hover:shadow-node' 
          : data.type === 'ppi'
            ? 'border-ppi-edge bg-accent/10 text-foreground'
            : 'border-literature-accent bg-literature-bg text-foreground'
    }`}>
      <div className="flex items-center justify-between gap-2">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="h-6 text-xs"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <Button size="sm" variant="ghost" onClick={handleSave} className="h-6 w-6 p-0">
              <Save className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <>
            <span className="font-medium text-sm">{data.label}</span>
            {data.type === 'protein' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            )}
          </>
        )}
      </div>
      <Badge variant="secondary" className="text-xs mt-1">
        {data.type}
      </Badge>
    </div>
  );
};

const nodeTypes = {
  protein: ProteinNode,
  ppi: ProteinNode,
  paper: ProteinNode,
};

// Initial graph data
const initialNodes: Node[] = [
  {
    id: 'tau',
    type: 'protein',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Tau', 
      type: 'protein',
      onLabelChange: () => {}
    },
  },
  {
    id: 'shp2',
    type: 'protein',
    position: { x: 300, y: 100 },
    data: { 
      label: 'Shp2', 
      type: 'protein',
      onLabelChange: () => {}
    },
  },
  {
    id: 'app',
    type: 'protein',
    position: { x: 200, y: 300 },
    data: { 
      label: 'APP', 
      type: 'protein',
      onLabelChange: () => {}
    },
  },
  {
    id: 'ppi1',
    type: 'ppi',
    position: { x: 200, y: 150 },
    data: { 
      label: 'Tau.Shp2.PMID:31201283', 
      type: 'ppi',
    },
  },
  {
    id: 'paper1',
    type: 'paper',
    position: { x: 200, y: 200 },
    data: { 
      label: 'PMID: 31201283', 
      type: 'paper',
    },
  },
  {
    id: 'snca',
    type: 'protein',
    position: { x: 400, y: 250 },
    data: { 
      label: 'SNCA', 
      type: 'protein',
      onLabelChange: () => {}
    },
  },
  {
    id: 'ppi2',
    type: 'ppi',
    position: { x: 300, y: 275 },
    data: { 
      label: 'APP.SNCA.PMID:30192847', 
      type: 'ppi',
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'tau', target: 'ppi1', type: 'smoothstep', style: { stroke: 'hsl(215 45% 65%)' } },
  { id: 'e2', source: 'shp2', target: 'ppi1', type: 'smoothstep', style: { stroke: 'hsl(215 45% 65%)' } },
  { id: 'e3', source: 'ppi1', target: 'paper1', type: 'smoothstep', style: { stroke: 'hsl(215 75% 50%)' } },
  { id: 'e4', source: 'app', target: 'ppi2', type: 'smoothstep', style: { stroke: 'hsl(215 45% 65%)' } },
  { id: 'e5', source: 'snca', target: 'ppi2', type: 'smoothstep', style: { stroke: 'hsl(215 45% 65%)' } },
  { id: 'e6', source: 'tau', target: 'app', type: 'smoothstep', style: { stroke: 'hsl(215 45% 65%)', strokeDasharray: '4 4' } },
];

export const ProteinGraphVisualization = ({ 
  selectedProtein, 
  onProteinSelect, 
  graphData,
  searchQuery 
}: ProteinGraphVisualizationProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.data.type === 'protein') {
      onProteinSelect(node.data.label);
    }
  }, [onProteinSelect]);

  const onLabelChange = useCallback((nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  }, [setNodes]);

  // Update nodes with the label change handler
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { ...node.data, onLabelChange }
      }))
    );
  }, [setNodes, onLabelChange]);

  // Highlight selected protein
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: node.data.type === 'protein' && node.data.label === selectedProtein,
        style: {
          ...node.style,
          opacity: selectedProtein && node.data.type === 'protein' && node.data.label !== selectedProtein ? 0.5 : 1,
        }
      }))
    );
  }, [selectedProtein, setNodes]);

  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
      <div className="h-full" style={{ background: 'hsl(var(--muted))' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="hsl(var(--border))" gap={16} />
          <Controls className="bg-card border border-border shadow-panel" />
          <MiniMap 
            className="bg-card border border-border shadow-panel"
            nodeColor={(node) => {
              switch (node.data?.type) {
                case 'protein': return 'hsl(215 85% 35%)';
                case 'ppi': return 'hsl(145 65% 45%)';
                case 'paper': return 'hsl(215 75% 50%)';
                default: return 'hsl(215 25% 85%)';
              }
            }}
          />
        </ReactFlow>
      </div>
    </Card>
  );
};