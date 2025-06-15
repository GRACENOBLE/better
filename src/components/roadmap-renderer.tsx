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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface RoadmapData {
  nodes: Array<{
    id: string;
    label: string;
    type?: string;
    level?: number;
    description?: string;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    label?: string;
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

//This is the custom node for my roadmaps.
const CustomNode = ({ data }: { data: any }) => (
  <div className="px-4 py-3 shadow-lg rounded-lg bg-white border-2 border-gray-300 min-w-[180px] max-w-[250px] hover:shadow-xl transition-shadow">
    <div className="font-bold text-sm text-gray-800 mb-1">{data.label}</div>
    {data.description && (
      <div className="text-xs text-gray-600 leading-relaxed">
        {data.description}
      </div>
    )}
    {data.level !== undefined && (
      <div className="text-xs text-blue-600 font-medium mt-2 bg-blue-50 px-2 py-1 rounded">
        Level {data.level + 1}
      </div>
    )}
  </div>
);
  
//Making my custom node the default node
const nodeTypes = {
  default: CustomNode,
};

export default function RoadmapRenderer({ roadmapData }: RoadmapRendererProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (roadmapData?.nodes && roadmapData?.edges) {
      // Create a more sophisticated layout
      const flowNodes: Node[] = roadmapData.nodes.map((node, index) => {
        const level = node.level || 0;
        const nodesAtLevel = roadmapData.nodes.filter(
          (n) => (n.level || 0) === level
        ).length;
        const indexAtLevel = roadmapData.nodes
          .filter((n) => (n.level || 0) === level)
          .indexOf(node);

        return {
          id: node.id,
          type: "default",
          position: {
            x: level * 300 + 50,
            y: (indexAtLevel - (nodesAtLevel - 1) / 2) * 120 + 200,
          },
          data: {
            label: node.label,
            description: node.description,
            level: node.level,
          },
          style: {
            background: getNodeColor(level),
            border: "2px solid #374151",
            borderRadius: "12px",
          },
        };
      });

      const flowEdges: Edge[] = roadmapData.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: "smoothstep",
        animated: true,
        style: {
          stroke: "#374151",
          strokeWidth: 2,
        },
        labelStyle: {
          fontSize: "11px",
          fontWeight: "600",
          background: "white",
          padding: "2px 6px",
          borderRadius: "4px",
          border: "1px solid #d1d5db",
        },
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [roadmapData, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getNodeColor = (level: number): string => {
    const colors = [
      "#dbeafe", // Light blue - Getting started
      "#f0f9ff", // Very light blue - Fundamentals
      "#ecfdf5", // Light green - Intermediate
      "#fef3c7", // Light yellow - Advanced
      "#fce7f3", // Light pink - Mastery
      "#f3e8ff", // Light purple - Specialization
    ];
    return colors[level % colors.length];
  };

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
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      attributionPosition="bottom-left"
      className="bg-gray-50"
    >
      <Controls className="bg-white border border-gray-300 rounded-lg shadow-sm" />
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="#e5e7eb"
      />
      <MiniMap
        className="bg-white border border-gray-300 rounded-lg"
        nodeColor={(node) => node.style?.background || "#f3f4f6"}
      />
    </ReactFlow>
  );
}