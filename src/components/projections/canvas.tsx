//@ts-nocheck
"use client";

import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  BackgroundVariant,
  Handle,
  Position,
  Controls,
  useReactFlow,
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
import {
  Edit,
  Trash2,
  ArrowLeft,
  Save,
  MapPin,
  Layers,
  FileText,
  RotateCcw,
  Plus,
  Workflow,
} from "lucide-react";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { AlignAllNodes } from "./canvas-icons";
import { BsNodePlus } from "react-icons/bs";

interface CustomNodeProps {
  data: {
    label: string;
    type?: "main" | "topic" | "subtopic";
    level?: number;
    onEdit?: (id: string, label: string) => void;
    onAddMilestone?: (id: string) => void;
    onAddTopic?: (id: string) => void;
    onAddSubtopic?: (id: string) => void;
    onDelete?: (id: string) => void;
    [key: string]: any;
  };
  selected: boolean;
  id: string;
}

// Main milestone nodes (yellow) with editing capabilities
const EditableMainNode = ({ data, selected, id }: CustomNodeProps) => {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="w-3 h-3"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3"
      />

      <div className="px-6 py-4 shadow-lg rounded-lg bg-yellow-300 border-2 border-gray-800 min-w-[200px] font-bold text-center">
        <div className="text-sm text-gray-900">{data.label}</div>
      </div>

      {selected && (
        <>
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white border rounded-md shadow-lg p-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => data.onEdit?.(id, data.label)}
              title="Edit Milestone"
            >
              <Edit size={14} />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => data.onAddTopic?.(id)}
              title="Add Topic"
            >
              <Workflow size={14}/>
            </Button>
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => data.onAddMilestone?.(id)}
            title="Add New Milestone"
            className="mt-4 left-[50%] -translate-x-[50%] absolute"
          >
            <Plus size={14} />
          </Button>
        </>
      )}
    </div>
  );
};

// Topic nodes (gray) - only left/right handles for side connections
const EditableTopicNode = ({ data, selected, id }: CustomNodeProps) => {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className="w-3 h-3"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-3 h-3"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-3 h-3"
      />

      <div className="px-4 py-3 shadow-md rounded-lg bg-gray-300 border-2 border-gray-800 min-w-[150px] font-semibold text-center">
        <div className="text-xs text-gray-900">{data.label}</div>
      </div>

      {selected && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white border rounded-md shadow-lg p-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => data.onEdit?.(id, data.label)}
            title="Edit Topic"
          >
            <Edit size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => data.onAddSubtopic?.(id)}
            title="Add Subtopic"
          >
            <FileText size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => data.onDelete?.(id)}
            title="Delete Topic"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )}
    </div>
  );
};

// Subtopic nodes - only left/right handles for side connections
const EditableSubtopicNode = ({ data, selected, id }: CustomNodeProps) => {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-2 h-2"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className="w-2 h-2"
      />

      <div className="px-3 py-2 shadow-sm rounded bg-gray-200 border border-gray-700 min-w-[80px] text-center">
        <div className="text-xs text-gray-800 font-medium">{data.label}</div>
      </div>

      {selected && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white border rounded-md shadow-lg p-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => data.onEdit?.(id, data.label)}
            title="Edit Subtopic"
          >
            <Edit size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => data.onDelete?.(id)}
            title="Delete Subtopic"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  main: EditableMainNode,
  topic: EditableTopicNode,
  subtopic: EditableSubtopicNode,
};

export default function RoadmapStudio() {
  const router = useRouter();
  const { currentRoadmap, setRoadmap } = useRoadmapStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node<any> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editNodeId, setEditNodeId] = useState<string>("");
  const [editNodeText, setEditNodeText] = useState("");
  const [newNodeText, setNewNodeText] = useState("");
  const [addMode, setAddMode] = useState<"milestone" | "topic" | "subtopic">(
    "topic"
  );
  const [parentNodeId, setParentNodeId] = useState<string>("");
  const { fitView } = useReactFlow();

  // Load roadmap data from store and apply the same positioning algorithm
  useEffect(() => {
    if (currentRoadmap) {
      console.log("Loading roadmap into studio:", currentRoadmap);
      applyRoadmapLayout(currentRoadmap.nodes, currentRoadmap.edges);
    } else {
      // Create a default starter roadmap with one main milestone
      const defaultRoadmap = {
        nodes: [
          {
            id: "starter",
            label: "Start Here",
            type: "main" as const,
            level: 0,
          },
        ],
        edges: [],
        metadata: { topic: "New Roadmap" },
      };
      setRoadmap(defaultRoadmap);
      applyRoadmapLayout(defaultRoadmap.nodes, defaultRoadmap.edges);
    }
  }, [currentRoadmap]);

  // Function to apply the roadmap layout and update nodes/edges
  const applyRoadmapLayout = (roadmapNodes: any[], roadmapEdges: any[]) => {
    const nodePositions = calculateAllNodePositions(roadmapNodes, roadmapEdges);

    const flowNodes: Node[] = roadmapNodes.map((node) => {
      const position = nodePositions[node.id] || { x: 100, y: 100 };

      return {
        id: node.id,
        type: node.type || "topic",
        position,
        data: {
          label: node.label,
          type: node.type,
          level: node.level,
          onEdit: handleEditNode,
          onAddMilestone: handleAddMilestone,
          onAddTopic: handleAddTopic,
          onAddSubtopic: handleAddSubtopic,
          onDelete: handleDeleteNode,
        },
        draggable: true,
      };
    });

    const flowEdges: Edge[] = roadmapEdges
      .map((edge) => {
        const sourceNode = roadmapNodes.find((n) => n.id === edge.source);
        const targetNode = roadmapNodes.find((n) => n.id === edge.target);

        if (!sourceNode || !targetNode) return null;

        const sourcePos = nodePositions[edge.source];
        const targetPos = nodePositions[edge.target];

        // Use the same handle logic as the renderer
        let sourceHandle = "bottom";
        let targetHandle = "top";

        if (edge.type === "main") {
          sourceHandle = "bottom";
          targetHandle = "top";
        } else if (edge.type === "dotted") {
          if (sourceNode.type === "main" && targetNode.type === "topic") {
            if (targetPos.x < sourcePos.x) {
              sourceHandle = "left";
              targetHandle = "right";
            } else {
              sourceHandle = "right";
              targetHandle = "left";
            }
          } else if (
            sourceNode.type === "topic" &&
            targetNode.type === "subtopic"
          ) {
            const centerX = 400;
            const isParentOnLeft = sourcePos.x < centerX;

            if (isParentOnLeft) {
              sourceHandle = "left-source";
              targetHandle = "right";
            } else {
              sourceHandle = "right-source";
              targetHandle = "left";
            }
          }
        }

        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle,
          targetHandle,
          type: edge.type === "dotted" ? "straight" : "smoothstep",
          animated: false,
          style: {
            stroke: "#000000",
            strokeWidth: edge.type === "main" ? 4 : 2,
            strokeDasharray: edge.type === "dotted" ? "5,5" : undefined,
          },
        };
      })
      .filter(Boolean) as Edge[];

    setNodes(flowNodes);
    setEdges(flowEdges);
  };

  // Improved positioning algorithm that handles dynamic changes better
  function calculateAllNodePositions(allNodes: any[], edges: any[]) {
    const positions: Record<string, { x: number; y: number }> = {};
    const centerX = 400;
    const topicSpacing = 300;

    // Sort main nodes by level to ensure proper ordering
    const mainNodes = allNodes
      .filter((n) => n.type === "main")
      .sort((a, b) => (a.level || 0) - (b.level || 0));
    const topicNodes = allNodes.filter((n) => n.type === "topic");
    const subtopicNodes = allNodes.filter((n) => n.type === "subtopic");

    // Group subtopics by their parent topic
    const subtopicGroups: Record<string, any[]> = {};
    subtopicNodes.forEach((subtopic) => {
      const parentEdge = edges.find(
        (edge) => edge.target === subtopic.id && edge.type === "dotted"
      );
      if (parentEdge) {
        const parentTopic = allNodes.find(
          (n) => n.id === parentEdge.source && n.type === "topic"
        );
        if (parentTopic) {
          if (!subtopicGroups[parentTopic.id]) {
            subtopicGroups[parentTopic.id] = [];
          }
          subtopicGroups[parentTopic.id].push(subtopic);
        }
      }
    });

    // Calculate space requirements for each topic group
    const topicSpaceRequirements: Record<string, number> = {};
    Object.entries(subtopicGroups).forEach(([topicId, subtopics]) => {
      const baseSpacing = 70;
      const minSpacing = 50;
      const maxSpacing = 90;

      let subtopicSpacing = baseSpacing;
      if (subtopics.length > 5) {
        subtopicSpacing = Math.max(
          minSpacing,
          baseSpacing - (subtopics.length - 5) * 3
        );
      } else if (subtopics.length < 3) {
        subtopicSpacing = Math.min(
          maxSpacing,
          baseSpacing + (3 - subtopics.length) * 10
        );
      }

      const totalHeight = Math.max(
        120,
        (subtopics.length - 1) * subtopicSpacing + 80
      );
      topicSpaceRequirements[topicId] = totalHeight;
    });

    // Calculate space requirements for each main node based on connected topics
    const mainNodeSpaceRequirements: Record<string, number> = {};
    mainNodes.forEach((mainNode) => {
      const connectedTopics = topicNodes.filter((topic) => {
        return edges.some(
          (edge) =>
            edge.source === mainNode.id &&
            edge.target === topic.id &&
            edge.type === "dotted"
        );
      });

      if (connectedTopics.length === 0) {
        mainNodeSpaceRequirements[mainNode.id] = 200;
        return;
      }

      // Group topics by side (left/right) based on their connection order
      const leftTopics: any[] = [];
      const rightTopics: any[] = [];

      connectedTopics.forEach((topic, index) => {
        if (index % 2 === 0) {
          leftTopics.push(topic);
        } else {
          rightTopics.push(topic);
        }
      });

      const leftSpaceNeeded =
        leftTopics.reduce((sum, topic) => {
          return sum + (topicSpaceRequirements[topic.id] || 120);
        }, 0) +
        Math.max(0, leftTopics.length - 1) * 40;

      const rightSpaceNeeded =
        rightTopics.reduce((sum, topic) => {
          return sum + (topicSpaceRequirements[topic.id] || 120);
        }, 0) +
        Math.max(0, rightTopics.length - 1) * 40;

      const requiredSpace = Math.max(leftSpaceNeeded, rightSpaceNeeded, 200);
      mainNodeSpaceRequirements[mainNode.id] = requiredSpace;
    });

    // Position main nodes with dynamic spacing
    let currentMainY = 100;
    mainNodes.forEach((node) => {
      const spaceNeeded = mainNodeSpaceRequirements[node.id];

      positions[node.id] = {
        x: centerX,
        y: currentMainY + spaceNeeded / 2,
      };

      currentMainY += spaceNeeded + 100;
    });

    // Position topic nodes relative to their connected main nodes
    mainNodes.forEach((mainNode) => {
      const connectedTopics = topicNodes.filter((topic) => {
        return edges.some(
          (edge) =>
            edge.source === mainNode.id &&
            edge.target === topic.id &&
            edge.type === "dotted"
        );
      });

      if (connectedTopics.length === 0) return;

      const baseY = positions[mainNode.id].y;

      // Group topics by side
      const leftTopics: any[] = [];
      const rightTopics: any[] = [];

      connectedTopics.forEach((topic, index) => {
        if (index % 2 === 0) {
          leftTopics.push(topic);
        } else {
          rightTopics.push(topic);
        }
      });

      // Position left-side topics
      let currentY = baseY;
      if (leftTopics.length > 1) {
        const totalSpaceNeeded = leftTopics.reduce((sum, topic) => {
          return sum + (topicSpaceRequirements[topic.id] || 120);
        }, 0);
        currentY = baseY - totalSpaceNeeded / 2;
      }

      leftTopics.forEach((node, index) => {
        const spaceNeeded = topicSpaceRequirements[node.id] || 120;

        positions[node.id] = {
          x: centerX - topicSpacing - index * 50,
          y: currentY + spaceNeeded / 2,
        };

        currentY += spaceNeeded + 40;
      });

      // Position right-side topics
      currentY = baseY;
      if (rightTopics.length > 1) {
        const totalSpaceNeeded = rightTopics.reduce((sum, topic) => {
          return sum + (topicSpaceRequirements[topic.id] || 120);
        }, 0);
        currentY = baseY - totalSpaceNeeded / 2;
      }

      rightTopics.forEach((node, index) => {
        const spaceNeeded = topicSpaceRequirements[node.id] || 120;

        positions[node.id] = {
          x: centerX + topicSpacing + index * 50,
          y: currentY + spaceNeeded / 2,
        };

        currentY += spaceNeeded + 40;
      });
    });

    // Position subtopic nodes within their allocated space
    Object.entries(subtopicGroups).forEach(([parentId, siblingSubtopics]) => {
      const parentPos = positions[parentId];
      if (!parentPos) return;

      const isParentOnLeft = parentPos.x < centerX;

      const baseSpacing = 70;
      const minSpacing = 50;
      const maxSpacing = 90;

      let subtopicSpacing = baseSpacing;
      if (siblingSubtopics.length > 5) {
        subtopicSpacing = Math.max(
          minSpacing,
          baseSpacing - (siblingSubtopics.length - 5) * 3
        );
      } else if (siblingSubtopics.length < 3) {
        subtopicSpacing = Math.min(
          maxSpacing,
          baseSpacing + (3 - siblingSubtopics.length) * 10
        );
      }

      const horizontalOffset = 200;
      const totalHeight = (siblingSubtopics.length - 1) * subtopicSpacing;
      const startY = parentPos.y - totalHeight / 2;

      siblingSubtopics.forEach((subtopic, index) => {
        const proposedY = startY + index * subtopicSpacing;

        if (isParentOnLeft) {
          positions[subtopic.id] = {
            x: parentPos.x - horizontalOffset,
            y: proposedY,
          };
        } else {
          positions[subtopic.id] = {
            x: parentPos.x + horizontalOffset,
            y: proposedY,
          };
        }
      });
    });

    return positions;
  }

  // Function to realign all nodes
  const handleRealignNodes = () => {
    const roadmapNodes = nodes.map((node) => ({
      id: node.id,
      label: node.data.label,
      type: node.type as "main" | "topic" | "subtopic",
      level: node.data.level || 0,
    }));

    const roadmapEdges = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.style?.strokeDasharray
        ? ("dotted" as const)
        : ("main" as const),
    }));

    applyRoadmapLayout(roadmapNodes, roadmapEdges);
    setTimeout(() => fitView(), 100);
  };

  const handleEditNode = useCallback((nodeId: string, currentText: string) => {
    setEditNodeId(nodeId);
    setEditNodeText(currentText);
    setIsEditDialogOpen(true);
  }, []);

  const handleAddMilestone = useCallback((nodeId: string) => {
    setParentNodeId(nodeId);
    setAddMode("milestone");
    setIsAddDialogOpen(true);
  }, []);

  const handleAddTopic = useCallback((nodeId: string) => {
    setParentNodeId(nodeId);
    setAddMode("topic");
    setIsAddDialogOpen(true);
  }, []);

  const handleAddSubtopic = useCallback((nodeId: string) => {
    setParentNodeId(nodeId);
    setAddMode("subtopic");
    setIsAddDialogOpen(true);
  }, []);

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
      setEdges((edges) =>
        edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  const updateNodeText = () => {
    if (!editNodeText.trim()) return;

    const updatedNodes = nodes.map((node) =>
      node.id === editNodeId
        ? { ...node, data: { ...node.data, label: editNodeText } }
        : node
    );
    setNodes(updatedNodes);
    setIsEditDialogOpen(false);
    setEditNodeText("");
    setEditNodeId("");
  };

  const handleAddNode = () => {
    if (!newNodeText.trim()) return;

    const newNodeId = `node-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const parentNode = nodes.find((n) => n.id === parentNodeId);

    // Determine the level for the new node
    let level = 0;
    if (addMode === "milestone") {
      // For new milestones, if no parent, level 0, else next level
      level = parentNodeId ? (parentNode?.data.level || 0) + 1 : 0;
    } else if (addMode === "topic") {
      // Topics use the same level as their parent main node
      level = parentNode?.data.level || 0;
    } else if (addMode === "subtopic") {
      // Subtopics use the same level as their parent topic node
      level = parentNode?.data.level || 0;
    }

    const newNode: Node = {
      id: newNodeId,
      type: addMode === "milestone" ? "main" : addMode,
      position: { x: 200, y: 200 }, // Will be recalculated
      data: {
        label: newNodeText,
        type: addMode === "milestone" ? "main" : addMode,
        level: level,
        onEdit: handleEditNode,
        onAddMilestone: handleAddMilestone,
        onAddTopic: handleAddTopic,
        onAddSubtopic: handleAddSubtopic,
        onDelete: handleDeleteNode,
      },
    };

    const updatedNodes = [...nodes, newNode];
    let updatedEdges = [...edges];

    // Create appropriate edge based on the add mode
    if (parentNodeId) {
      const edgeType = addMode === "milestone" ? "main" : "dotted";
      const newEdge: Edge = {
        id: `edge-${parentNodeId}-${newNodeId}`,
        source: parentNodeId,
        target: newNodeId,
        type: edgeType === "dotted" ? "straight" : "smoothstep",
        style: {
          stroke: "#000000",
          strokeWidth: edgeType === "main" ? 4 : 2,
          strokeDasharray: edgeType === "dotted" ? "5,5" : undefined,
        },
      };
      updatedEdges = [...edges, newEdge];
    }

    setNodes(updatedNodes);
    setEdges(updatedEdges);

    // Recalculate positions after a short delay
    setTimeout(() => {
      const roadmapNodes = updatedNodes.map((node) => ({
        id: node.id,
        label: node.data.label,
        type: node.type as "main" | "topic" | "subtopic",
        level: node.data.level || 0,
      }));

      const roadmapEdges = updatedEdges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.style?.strokeDasharray
          ? ("dotted" as const)
          : ("main" as const),
      }));

      applyRoadmapLayout(roadmapNodes, roadmapEdges);
    }, 100);

    setNewNodeText("");
    setIsAddDialogOpen(false);
    setParentNodeId("");
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      // Determine edge type based on node types
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);

      let edgeType = "straight";
      let strokeWidth = 2;
      let strokeDasharray = "5,5";

      if (sourceNode?.type === "main" && targetNode?.type === "main") {
        edgeType = "smoothstep";
        strokeWidth = 4;
        strokeDasharray = undefined;
      } else if (sourceNode?.type === "main" && targetNode?.type === "topic") {
        edgeType = "straight";
        strokeWidth = 2;
        strokeDasharray = "5,5";
      } else if (
        sourceNode?.type === "topic" &&
        targetNode?.type === "subtopic"
      ) {
        edgeType = "straight";
        strokeWidth = 2;
        strokeDasharray = "5,5";
      }

      const newEdge = {
        ...params,
        type: edgeType,
        style: {
          stroke: "#000000",
          strokeWidth,
          strokeDasharray,
        },
      };

      const newEdges = addEdge(newEdge, edges);
      setEdges(newEdges);
    },
    [edges, setEdges, nodes]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleSave = () => {
    // Convert React Flow nodes/edges back to roadmap format
    const roadmapNodes = nodes.map((node) => ({
      id: node.id,
      label: node.data.label,
      type: node.type as "main" | "topic" | "subtopic",
      level: node.data.level || 0,
    }));

    const roadmapEdges = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.style?.strokeDasharray
        ? ("dotted" as const)
        : ("main" as const),
    }));

    const updatedRoadmap = {
      nodes: roadmapNodes,
      edges: roadmapEdges,
      metadata: currentRoadmap?.metadata,
    };

    setRoadmap(updatedRoadmap);
    router.push("/");
  };

  return (
    <div className="w-full h-full relative">
      {/* React Flow Canvas */}
      <div className="h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.2,
            includeHiddenNodes: false,
          }}
          className="bg-white"
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{
            style: { strokeWidth: 2, stroke: "#000000" },
            type: "straight",
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#000000"
          />
          <Controls />
        </ReactFlow>
      </div>

      {/* Edit Node Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={editNodeText}
              onChange={(e) => setEditNodeText(e.target.value)}
              placeholder="Enter node text..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateNodeText();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button onClick={updateNodeText} disabled={!editNodeText.trim()}>
                Update Node
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Node Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add New{" "}
              {addMode === "milestone"
                ? "Milestone"
                : addMode === "topic"
                ? "Topic"
                : "Subtopic"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newNodeText}
              onChange={(e) => setNewNodeText(e.target.value)}
              placeholder={`Enter ${addMode} text...`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddNode();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button onClick={handleAddNode} disabled={!newNodeText.trim()}>
                Add{" "}
                {addMode === "milestone"
                  ? "Milestone"
                  : addMode === "topic"
                  ? "Topic"
                  : "Subtopic"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
