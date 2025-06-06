"use client";

import type React from "react";
import { useState, useCallback } from "react";
import {
  ReactFlow,
  type Node,
  type Edge,
  addEdge,
  Background,
  Controls,
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
import { Label } from "@/components/ui/label";
import { Plus, Users, AlignCenter, Edit, Trash2, Copy } from "lucide-react";

// Custom Node Component with proper handles
interface CustomNodeProps {
  data: {
    label: string;
    onEdit?: (id: string, label: string) => void;
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
    // Remove the node
    setNodes((nodes) => nodes.filter((node) => node.id !== id));

    // Remove all edges connected to this node
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
        .substr(2, 9)}`;
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

  return (
    <div className="relative">
      {/* Input handle at the top */}
      <Handle type="target" position={Position.Top} />

      <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[120px]">
        <div className="text-sm font-medium text-center">{data.label}</div>
      </div>

      {/* Output handle at the bottom */}
      <Handle type="source" position={Position.Bottom} />

      {selected && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white border rounded-md shadow-lg p-1">
          <Button size="sm" variant="ghost" onClick={handleEdit}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCopy}>
            <Copy className="h-3 w-3" />
          </Button>
        </div>
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
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
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

  // Tree layout algorithm
  const calculateTreeLayout = (nodes: Node[], edges: Edge[]) => {
    // Find root nodes (nodes with no incoming edges)
    const hasIncomingEdge = new Set(edges.map((edge) => edge.target));
    const rootNodes = nodes.filter((node) => !hasIncomingEdge.has(node.id));

    // Build adjacency list for children
    const children: { [key: string]: string[] } = {};
    edges.forEach((edge) => {
      if (!children[edge.source]) children[edge.source] = [];
      children[edge.source].push(edge.target);
    });

    const positions: { [key: string]: { x: number; y: number } } = {};

    const LEVEL_HEIGHT = 120;
    const MIN_NODE_SPACING = 180;

    // Calculate subtree width for proper spacing
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

    // Position nodes recursively
    const positionNode = (nodeId: string, x: number, y: number) => {
      positions[nodeId] = { x, y };

      const nodeChildren = children[nodeId] || [];
      if (nodeChildren.length === 0) return;

      // Calculate total width needed for all children
      const childrenWidths = nodeChildren.map((childId) =>
        calculateSubtreeWidth(childId)
      );
      const totalWidth = childrenWidths.reduce((sum, width) => sum + width, 0);

      // Start positioning children from the left
      let currentX = x - totalWidth / 2;

      nodeChildren.forEach((childId, index) => {
        const childWidth = childrenWidths[index];
        const childX = currentX + childWidth / 2;
        positionNode(childId, childX, y + LEVEL_HEIGHT);
        currentX += childWidth;
      });
    };

    // Position each root and its subtree
    let rootX = 300; // Start at a reasonable X position
    rootNodes.forEach((rootNode, index) => {
      if (index > 0) {
        rootX += calculateSubtreeWidth(rootNodes[index - 1].id) + 100; // Add spacing between root trees
      }
      positionNode(rootNode.id, rootX, 50);
    });

    // Update node positions
    return nodes.map((node) => ({
      ...node,
      position: positions[node.id] || node.position,
    }));
  };

  // Update nodes to include edit handler
  const nodesWithEditHandler = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onEdit: handleEditNode,
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

    // Determine node type based on whether it's a root or child
    const isRoot = !edges.some((edge) => edge.target === selectedNode.id);
    const nodeType =
      addMode === "child" ? "default" : isRoot ? "input" : "default";

    const newNode: Node = {
      id: newNodeId,
      type: nodeType,
      position: { x: 0, y: 0 }, // Will be recalculated
      data: { label: newNodeText, onEdit: handleEditNode },
    };

    let updatedNodes = [...nodes, newNode];
    let updatedEdges = [...edges];

    if (addMode === "child") {
      // Add edge from parent to child
      const newEdge: Edge = {
        id: `edge-${selectedNode.id}-${newNodeId}`,
        source: selectedNode.id,
        target: newNodeId,
        type: "smoothstep",
        style: { strokeWidth: 2, stroke: "#374151" },
        markerEnd: {
          // @ts-ignore
          type: "arrowclosed",
          color: "#374151",
        },
      };
      updatedEdges = [...edges, newEdge];
    } else {
      // For sister, find the parent of the selected node and add edge from parent to new node
      const parentEdge = edges.find((edge) => edge.target === selectedNode.id);
      if (parentEdge) {
        const newEdge: Edge = {
          id: `edge-${parentEdge.source}-${newNodeId}`,
          source: parentEdge.source,
          target: newNodeId,
          type: "smoothstep",
          style: { strokeWidth: 2, stroke: "#374151" },
          markerEnd: {
            // @ts-ignore
            type: "arrowclosed",
            color: "#374151",
          },
        };
        updatedEdges = [...edges, newEdge];
      }
    }

    // Recalculate tree layout with new edges
    updatedNodes = calculateTreeLayout(updatedNodes, updatedEdges);

    // Update both nodes and edges
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    onNodesChange?.(updatedNodes);
    onEdgesChange?.(updatedEdges);

    setNewNodeText("");
    setIsAddDialogOpen(false);

    // Fit view after adding node
    setTimeout(() => fitView(), 100);
  };

  const alignNodes = () => {
    const currentNodes = getNodes();
    if (currentNodes.length === 0) return;

    // Use tree layout algorithm
    const alignedNodes = calculateTreeLayout(currentNodes, edges);

    setNodes(alignedNodes);
    onNodesChange?.(alignedNodes);

    // Fit view after alignment
    setTimeout(() => fitView(), 100);
  };

  return (
    <div className="w-full h-screen relative">
      {/* Top Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 bg-white border rounded-lg p-2 shadow-lg">
        <Button
          size="sm"
          onClick={addChild}
          disabled={!selectedNode}
          variant={selectedNode ? "default" : "secondary"}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Child
        </Button>
        <Button
          size="sm"
          onClick={addSister}
          disabled={!selectedNode}
          variant={selectedNode ? "default" : "secondary"}
        >
          <Users className="h-4 w-4 mr-1" />
          Add Sister
        </Button>
        <Button size="sm" onClick={alignNodes} variant="outline">
          <AlignCenter className="h-4 w-4 mr-1" />
          Align Nodes
        </Button>
      </div>

      {/* Selected Node Info */}
      {selectedNode && (
        <div className="absolute top-4 right-4 z-10 bg-white border rounded-lg p-2 shadow-lg">
          <div className="text-sm font-medium">
            Selected: {String(selectedNode?.data?.label) ?? ""}
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodesWithEditHandler}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
        defaultEdgeOptions={{
          style: { strokeWidth: 2, stroke: "#374151" },
          type: "smoothstep",
          markerEnd: {
            // @ts-ignore
            type: "arrowclosed",
            color: "#374151",
          },
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
      </ReactFlow>

      {/* Add Node Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add {addMode === "child" ? "Child" : "Sister"} Node
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nodeText">Node Text</Label>
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
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddNode} disabled={!newNodeText.trim()}>
                Add Node
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Node Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editNodeText">Node Text</Label>
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
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
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

// Main component with provider
export default function Component() {
  // Example initial data using proper node types
  const initialNodes: Node[] = [
    {
      id: "1",
      type: "input", // Root node uses input type
      position: { x: 250, y: 50 },
      data: { label: "Root Node" },
    },
    {
      id: "2",
      type: "default", // Child nodes use default type
      position: { x: 100, y: 150 },
      data: { label: "Child 1" },
    },
    {
      id: "3",
      type: "default", // Child nodes use default type
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
