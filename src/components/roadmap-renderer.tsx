"use client";

import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface RoadmapData {
  nodes: Array<{
    id: string;
    label: string;
    type?: "main" | "topic" | "subtopic";
    level?: number;
    description?: string;
    category?: string;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    label?: string;
    type?: "main" | "dotted";
  }>;
  metadata?: {
    topic?: string;
    timeframe?: string;
    difficulty?: string;
  };
}

interface RoadmapRendererProps {
  roadmapData: RoadmapData;
}

// Main milestone nodes (yellow) with named connection handles
const MainNode = ({ data }: { data: any }) => (
  <div className="px-6 py-4 shadow-lg rounded-lg bg-yellow-300 border-2 border-gray-800 min-w-[200px] font-bold text-center relative">
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
    <div className="text-sm text-gray-900">{data.label}</div>
  </div>
);

// Regular topic nodes (gray) with named connection handles
const TopicNode = ({ data }: { data: any }) => (
  <div className="px-4 py-3 shadow-md rounded-lg bg-gray-300 border-2 border-gray-800 min-w-[150px] font-semibold text-center relative">
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
    <div className="text-xs text-gray-900">{data.label}</div>
  </div>
);

// Small subtopic nodes with named connection handles
const SubtopicNode = ({ data }: { data: any }) => (
  <div className="px-3 py-2 shadow-sm rounded bg-gray-200 border border-gray-700 min-w-[80px] text-center relative">
    <Handle
      type="target"
      position={Position.Top}
      id="top"
      className="w-2 h-2"
    />
    <Handle
      type="target"
      position={Position.Bottom}
      id="bottom"
      className="w-2 h-2"
    />
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
    <div className="text-xs text-gray-800 font-medium">{data.label}</div>
  </div>
);

const nodeTypes = {
  main: MainNode,
  topic: TopicNode,
  subtopic: SubtopicNode,
};

export default function RoadmapRenderer({ roadmapData }: RoadmapRendererProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (roadmapData?.nodes && roadmapData?.edges) {
      console.log("Roadmap data:", roadmapData);

      // Calculate all positions in a single pass to avoid recursion
      const nodePositions = calculateAllNodePositions(
        roadmapData.nodes,
        roadmapData.edges
      );

      const flowNodes: Node[] = roadmapData.nodes.map((node) => {
        const position = nodePositions[node.id];
        console.log(`Node ${node.id} positioned at:`, position);

        return {
          id: node.id,
          type: node.type || "topic",
          position,
          data: {
            label: node.label,
            description: node.description,
          },
          draggable: true,
        };
      });

      const flowEdges: Edge[] = roadmapData.edges
        .map((edge) => {
          console.log(
            `Processing edge: ${edge.source} -> ${edge.target}, type: ${edge.type}`
          );

          // Find the actual nodes to determine positioning
          const sourceNode = roadmapData.nodes.find(
            (n) => n.id === edge.source
          );
          const targetNode = roadmapData.nodes.find(
            (n) => n.id === edge.target
          );

          if (!sourceNode || !targetNode) {
            console.warn(
              `Missing node for edge ${edge.source} -> ${edge.target}`
            );
            return null;
          }

          const sourcePos = nodePositions[edge.source];
          const targetPos = nodePositions[edge.target];

          // Determine handles based on node positions and relationship
          let sourceHandle = "bottom";
          let targetHandle = "top";

          if (edge.type === "main") {
            // Main flow - always vertical
            sourceHandle = "bottom";
            targetHandle = "top";
          } else if (edge.type === "dotted") {
            if (sourceNode.type === "main" && targetNode.type === "topic") {
              // Main to topic connections
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
              // Topic to subtopic connections - based on parent side
              const centerX = 400;
              const isParentOnLeft = sourcePos.x < centerX;

              if (isParentOnLeft) {
                // Left-side parent: use left-source → right
                sourceHandle = "left-source";
                targetHandle = "right";
              } else {
                // Right-side parent: use right-source → left
                sourceHandle = "right-source";
                targetHandle = "left";
              }
            }
          }

          console.log(
            `Edge ${edge.source} -> ${edge.target}: ${sourceHandle} -> ${targetHandle}`
          );

          return {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            sourceHandle,
            targetHandle,
            label: edge.label,
            type: edge.type === "dotted" ? "straight" : "smoothstep",
            animated: false,
            style: {
              stroke: "black",
              strokeWidth: edge.type === "main" ? 4 : 2,
              strokeDasharray: edge.type === "dotted" ? "5,5" : undefined,
            },
            labelStyle: {
              fontSize: "10px",
              fontWeight: "600",
              background: "white",
              padding: "1px 4px",
              borderRadius: "3px",
              border: "1px solid #d1d5db",
            },
          };
        })
        .filter(Boolean) as Edge[];

      // Add validation to ensure all subtopic nodes have connections
      const connectedSubtopics = new Set(flowEdges.map((edge) => edge.target));
      const allSubtopics = roadmapData.nodes.filter(
        (node) => node.type === "subtopic"
      );
      const disconnectedSubtopics = allSubtopics.filter(
        (node) => !connectedSubtopics.has(node.id)
      );

      if (disconnectedSubtopics.length > 0) {
        console.warn(
          "Disconnected subtopics found:",
          disconnectedSubtopics.map((n) => n.id)
        );

        // Try to connect disconnected subtopics to nearby topic nodes
        disconnectedSubtopics.forEach((subtopic) => {
          const subtopicPos = nodePositions[subtopic.id];
          const topicNodes = roadmapData.nodes.filter(
            (n) => n.type === "topic"
          );

          // Find the closest topic node
          //@ts-ignore
          let closestTopic: {
            id: string;
            label: string;
            type?: "main" | "topic" | "subtopic";
            level?: number;
            description?: string;
            category?: string;
          } = null;
          let minDistance = Number.POSITIVE_INFINITY;

          topicNodes.forEach((topic) => {
            const topicPos = nodePositions[topic.id];
            const distance = Math.sqrt(
              Math.pow(subtopicPos.x - topicPos.x, 2) +
                Math.pow(subtopicPos.y - topicPos.y, 2)
            );

            if (distance < minDistance) {
              minDistance = distance;
              closestTopic = topic;
            }
          });

          if (closestTopic && minDistance < 300) {
            // Create a connection to the closest topic
            const topicPos = nodePositions[closestTopic.id];
            const centerX = 400;
            const isParentOnLeft = topicPos.x < centerX;

            let sourceHandle = "right-source";
            let targetHandle = "left";

            if (isParentOnLeft) {
              sourceHandle = "left-source";
              targetHandle = "right";
            }

            flowEdges.push({
              id: `auto-${closestTopic.id}-${subtopic.id}`,
              source: closestTopic.id,
              target: subtopic.id,
              sourceHandle,
              targetHandle,
              type: "straight",
              animated: false,
              style: {
                stroke: "#7c3aed",
                strokeWidth: 2,
                strokeDasharray: "5,5",
              },
            });

            console.log(`Auto-connected ${subtopic.id} to ${closestTopic.id}`);
          }
        });
      }

      console.log("Generated nodes:", flowNodes);
      console.log("Generated edges:", flowEdges);
      console.log(
        "Total edges created:",
        flowEdges.length,
        "out of",
        roadmapData.edges.length
      );

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [roadmapData, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Calculate all node positions in a single pass to avoid recursion
  function calculateAllNodePositions(allNodes: any[], edges: any[]) {
    const positions: Record<string, { x: number; y: number }> = {};
    const centerX = 400;
    const levelSpacing = 250;
    const topicSpacing = 300;

    // First pass: Position main nodes
    const mainNodes = allNodes.filter((n) => n.type === "main");
    mainNodes.forEach((node, index) => {
      positions[node.id] = {
        x: centerX,
        y: 100 + index * levelSpacing,
      };
    });

    // Second pass: Position topic nodes
    const topicNodes = allNodes.filter((n) => n.type === "topic");
    topicNodes.forEach((node, index) => {
      const level = node.level || 0;
      const topicNodesAtLevel = topicNodes.filter(
        (n) => (n.level || 0) === level
      );
      const topicIndex = topicNodesAtLevel.findIndex((n) => n.id === node.id);

      // Distribute topics around the main flow
      const isLeft = topicIndex % 2 === 0;
      const sideIndex = Math.floor(topicIndex / 2);

      positions[node.id] = {
        x: isLeft
          ? centerX - topicSpacing - sideIndex * 50
          : centerX + topicSpacing + sideIndex * 50,
        y: 100 + level * levelSpacing + sideIndex * 80,
      };
    });

    // Third pass: Position subtopic nodes with improved spacing
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

    // Position each group of subtopics
    Object.entries(subtopicGroups).forEach(([parentId, siblingSubtopics]) => {
      const parentPos = positions[parentId];
      if (!parentPos) return;

      // Determine if parent is on left or right side of main flow
      const isParentOnLeft = parentPos.x < centerX;

      // Improved spacing calculations to prevent overlapping
      const baseSpacing = 70; // Base vertical spacing between subtopics
      const minSpacing = 50; // Minimum spacing to prevent overlap
      const maxSpacing = 90; // Maximum spacing to keep groups compact

      // Calculate dynamic spacing based on number of subtopics
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

      const horizontalOffset = 200; // Distance from parent

      // Calculate vertical offset to center the group around the parent
      const totalHeight = (siblingSubtopics.length - 1) * subtopicSpacing;
      const startY = parentPos.y - totalHeight / 2;

      // Position each subtopic in the group
      siblingSubtopics.forEach((subtopic, index) => {
        const proposedY = startY + index * subtopicSpacing;

        if (isParentOnLeft) {
          // Left-side parent: position subtopics to the LEFT
          positions[subtopic.id] = {
            x: parentPos.x - horizontalOffset,
            y: proposedY,
          };
        } else {
          // Right-side parent: position subtopics to the RIGHT
          positions[subtopic.id] = {
            x: parentPos.x + horizontalOffset,
            y: proposedY,
          };
        }
      });
    });

    // Handle orphaned subtopics (fallback positioning)
    subtopicNodes.forEach((node) => {
      if (!positions[node.id]) {
        const level = node.level || 0;
        const subtopicNodesAtLevel = subtopicNodes.filter(
          (n) => (n.level || 0) === level
        );
        const subtopicIndex = subtopicNodesAtLevel.findIndex(
          (n) => n.id === node.id
        );

        positions[node.id] = {
          x: centerX + 200,
          y: 150 + level * levelSpacing + subtopicIndex * 80,
        };
      }
    });

    return positions;
  }

  if (!roadmapData?.nodes || roadmapData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-lg mb-2">🗺️</div>
          <div>No roadmap data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        attributionPosition="bottom-right"
        className="bg-white"
        minZoom={0.1}
        maxZoom={2}
      >
        {/* <Controls className="bg-white border border-gray-300 rounded-lg shadow-sm" /> */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e5e7eb"
        />
        {/* <MiniMap
          className="bg-white border border-gray-300 rounded-lg"
          nodeColor={(node) => {
            if (node.type === "main") return "#fde047";
            if (node.type === "subtopic") return "#e5e7eb";
            return "#d1d5db";
          }}
        /> */}
      </ReactFlow>
    </div>
  );
}
