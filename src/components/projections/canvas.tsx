"use client";

import type React from "react";
import { useState, useCallback } from "react";
import {
  ReactFlow,
  type Node,
  type Edge,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  type Connection,
  type NodeTypes,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Copy } from "lucide-react";
import { Child, Sister, AlignAllNodes } from "./canvas-icons";
import CustomButton from "../CustomButton";

interface CustomNodeProps {
  data: {
    label: string;
    onEdit?: (id: string, label: string) => void;
    onAddChild?: (id: string) => void;
    onAddSister?: (id: string) => void;
    [key: string]: any;
  };
  selected: boolean;
  id: string;
}

const CustomNode = ({ data, selected, id }: CustomNodeProps) => {
  const { getNodes, setNodes, getEdges, setEdges } = useReactFlow();

  const handleEdit = () => {
    data.onEdit?.(id, data.label);
  };

  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));

    setEdges((edges) =>
      edges.filter((edge) => edge.source !== id && edge.target !== id)
    );
  };

  const handleCopy = () => {
    const nodes = getNodes();
    const currentNode = nodes.find((node) => node.id === id);
    if (currentNode) {
      const newId = `node-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 11)}`;
      const newNode = {
        ...currentNode,
        id: newId,
        position: {
          x: currentNode.position.x + 50,
          y: currentNode.position.y + 50,
        },
      };
      setNodes((nodes) => [...nodes, newNode]);
    }
  };

  const handleAddChild = () => {
    data.onAddChild?.(id);
  };

  const handleAddSister = () => {
    data.onAddSister?.(id);
  };

  return (
    <div className="relative">

      <Handle type="target" position={Position.Top} />
      <div className="px-4 py-2 shadow-md rounded-sm bg-accent border-2 border-black min-w-[120px]">
        <div className="text-sm font-medium text-center">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />

      {selected && (
        <>
          <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white border rounded-md shadow-lg p-1">
            <Button size="sm" variant="ghost" onClick={handleEdit}>
              <Edit size={14} strokeWidth={2} />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCopy}>
              <Copy size={14} strokeWidth={2} />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDelete} className="">
              <Trash2 size={14} strokeWidth={2} />
            </Button>
          </div>

          <Button
            size="icon"
            onClick={handleAddChild}
            variant="outline"
            className="absolute -bottom-13 left-1/2 transform -translate-x-1/2   shadow-md bg-white"
          >
            <Child />
          </Button>

          <Button
            size="icon"
            onClick={handleAddSister}
            variant="outline"
            className="absolute top-1/2 -right-13 transform -translate-y-1/2  shadow-md bg-white"
          >
            <Sister />
          </Button>
        </>
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

interface FlowCanvasProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
}

function FlowCanvas({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
}: FlowCanvasProps) {
  const [nodes, setNodes, onNodesStateChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesStateChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<any> | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [addMode, setAddMode] = useState<"child" | "sister">("child");
  const [newNodeText, setNewNodeText] = useState("");
  const [editNodeId, setEditNodeId] = useState<string>("");
  const [editNodeText, setEditNodeText] = useState("");
  const { getNodes, fitView } = useReactFlow();

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      onEdgesChange?.(newEdges);
    },
    [edges, setEdges, onEdgesChange]
  );

  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesStateChange(changes);
      const updatedNodes = getNodes();
      onNodesChange?.(updatedNodes);
    },
    [onNodesStateChange, getNodes, onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesStateChange(changes);
      onEdgesChange?.(edges);
    },
    [onEdgesStateChange, edges, onEdgesChange]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleEditNode = useCallback((nodeId: string, currentText: string) => {
    setEditNodeId(nodeId);
    setEditNodeText(currentText);
    setIsEditDialogOpen(true);
  }, []);

  const handleAddChild = useCallback(
    (nodeId: string) => {
      setSelectedNode(nodes.find((node) => node.id === nodeId) || null);
      setAddMode("child");
      setIsAddDialogOpen(true);
    },
    [nodes]
  );

  const handleAddSister = useCallback(
    (nodeId: string) => {
      setSelectedNode(nodes.find((node) => node.id === nodeId) || null);
      setAddMode("sister");
      setIsAddDialogOpen(true);
    },
    [nodes]
  );

  const updateNodeText = () => {
    if (!editNodeText.trim()) return;

    const updatedNodes = nodes.map((node) =>
      node.id === editNodeId
        ? { ...node, data: { ...node.data, label: editNodeText } }
        : node
    );
    setNodes(updatedNodes);
    onNodesChange?.(updatedNodes);
    setIsEditDialogOpen(false);
    setEditNodeText("");
    setEditNodeId("");
  };

  const calculateTreeLayout = (nodes: Node[], edges: Edge[]) => {
    const hasIncomingEdge = new Set(edges.map((edge) => edge.target));
    const rootNodes = nodes.filter((node) => !hasIncomingEdge.has(node.id));

    const children: { [key: string]: string[] } = {};
    edges.forEach((edge) => {
      if (!children[edge.source]) children[edge.source] = [];
      children[edge.source].push(edge.target);
    });

    const positions: { [key: string]: { x: number; y: number } } = {};

    const LEVEL_HEIGHT = 120;
    const MIN_NODE_SPACING = 180;

    const calculateSubtreeWidth = (nodeId: string): number => {
      const nodeChildren = children[nodeId] || [];
      if (nodeChildren.length === 0) return MIN_NODE_SPACING;

      const childrenWidths = nodeChildren.map((childId) =>
        calculateSubtreeWidth(childId)
      );
      return Math.max(
        MIN_NODE_SPACING,
        childrenWidths.reduce((sum, width) => sum + width, 0)
      );
    };

    const positionNode = (nodeId: string, x: number, y: number) => {
      positions[nodeId] = { x, y };

      const nodeChildren = children[nodeId] || [];
      if (nodeChildren.length === 0) return;

      const childrenWidths = nodeChildren.map((childId) =>
        calculateSubtreeWidth(childId)
      );
      const totalWidth = childrenWidths.reduce((sum, width) => sum + width, 0);

      let currentX = x - totalWidth / 2;

      nodeChildren.forEach((childId, index) => {
        const childWidth = childrenWidths[index];
        const childX = currentX + childWidth / 2;
        positionNode(childId, childX, y + LEVEL_HEIGHT);
        currentX += childWidth;
      });
    };

    let rootX = 300;
    rootNodes.forEach((rootNode, index) => {
      if (index > 0) {
        rootX += calculateSubtreeWidth(rootNodes[index - 1].id) + 100; 
      }
      positionNode(rootNode.id, rootX, 50);
    });


    return nodes.map((node) => ({
      ...node,
      position: positions[node.id] || node.position,
    }));
  };


  const nodesWithHandlers = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onEdit: handleEditNode,
      onAddChild: handleAddChild,
      onAddSister: handleAddSister,
    },
  }));

  const addChild = () => {
    if (!selectedNode) return;
    setAddMode("child");
    setIsAddDialogOpen(true);
  };

  const addSister = () => {
    if (!selectedNode) return;
    setAddMode("sister");
    setIsAddDialogOpen(true);
  };

  const handleAddNode = () => {
    if (!newNodeText.trim() || !selectedNode) return;

    const newNodeId = `node-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newNode: Node = {
      id: newNodeId,
      type: "custom", 
      position: { x: 0, y: 0 }, 
      data: {
        label: newNodeText,
        onEdit: handleEditNode,
        onAddChild: handleAddChild,
        onAddSister: handleAddSister,
      },
    };

    let updatedNodes = [...nodes, newNode];
    let updatedEdges = [...edges];

    if (addMode === "child") {
      const newEdge: Edge = {
        id: `edge-${selectedNode.id}-${newNodeId}`,
        source: selectedNode.id,
        target: newNodeId,
        type: "smoothstep",
        style: { strokeWidth: 2, stroke: "#374151" },
      };
      updatedEdges = [...edges, newEdge];
    } else {

      const parentEdge = edges.find((edge) => edge.target === selectedNode.id);
      if (parentEdge) {
        const newEdge: Edge = {
          id: `edge-${parentEdge.source}-${newNodeId}`,
          source: parentEdge.source,
          target: newNodeId,
          type: "smoothstep",
          style: { strokeWidth: 2, stroke: "#374151" },
        };
        updatedEdges = [...edges, newEdge];
      }
    }

    updatedNodes = calculateTreeLayout(updatedNodes, updatedEdges);

    setNodes(updatedNodes);
    setEdges(updatedEdges);
    onNodesChange?.(updatedNodes);
    onEdgesChange?.(updatedEdges);

    setNewNodeText("");
    setIsAddDialogOpen(false);

    setTimeout(() => fitView(), 100);
  };

  const alignNodes = () => {
    const currentNodes = getNodes();
    if (currentNodes.length === 0) return;
    const alignedNodes = calculateTreeLayout(currentNodes, edges);
    setNodes(alignedNodes);
    onNodesChange?.(alignedNodes);
    setTimeout(() => fitView(), 100);
  };

  return (
    <div className="w-full h-full relative">
      <Button
        size="sm"
        onClick={alignNodes}
        variant="outline"
        className="aspect-square w-10 h-10 absolute z-10 top-4 right-4 "
      >
        <AlignAllNodes />
      </Button>

      <ReactFlow
        nodes={nodesWithHandlers}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        // fitView
        className="bg-gray-50"
        defaultEdgeOptions={{
          style: { strokeWidth: 2, stroke: "#374151" },
          type: "smoothstep",
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add {addMode === "child" ? "Child" : "Sister"} Node
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-8 pt-3">
            <div>
             
              <Input
                id="nodeText"
                value={newNodeText}
                onChange={(e) => setNewNodeText(e.target.value)}
                placeholder="Enter node text..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddNode();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <CustomButton onClick={handleAddNode} >
                Add Node
              </CustomButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                id="editNodeText"
                value={editNodeText}
                onChange={(e) => setEditNodeText(e.target.value)}
                placeholder="Enter node text..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateNodeText();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={updateNodeText} disabled={!editNodeText.trim()}>
                Update Node
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Component() {
  const initialNodes: Node[] = [
    {
      id: "1",
      type: "custom",
      position: { x: 250, y: 50 },
      data: { label: "Root Node" },
    },
    {
      id: "2",
      type: "custom",
      position: { x: 100, y: 150 },
      data: { label: "Child 1" },
    },
    {
      id: "3",
      type: "custom",
      position: { x: 400, y: 150 },
      data: { label: "Child 2" },
    },
  ];

  const initialEdges: Edge[] = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      type: "smoothstep",
      style: { strokeWidth: 2, stroke: "#374151" },
    },
    {
      id: "e1-3",
      source: "1",
      target: "3",
      type: "smoothstep",
      style: { strokeWidth: 2, stroke: "#374151" },
    },
  ];

  const handleNodesChange = (nodes: Node[]) => {
    console.log("Nodes changed:", nodes);
  };

  const handleEdgesChange = (edges: Edge[]) => {
    console.log("Edges changed:", edges);
  };

  return (
    <ReactFlowProvider>
      <FlowCanvas
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
      />
    </ReactFlowProvider>
  );
}
