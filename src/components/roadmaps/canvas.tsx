"use client";
import React, { useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Goal, Step } from "../icons";

const initialNodes = [
  { id: "1", position: { x: 500, y: 500 }, data: { label: "1" } },
  { id: "2", position: { x: 500, y: 600 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const newChild = {
    id: (nodes.length + 1).toString(),
    position: {
      x: nodes[nodes.length - 1].position.x,
      y: nodes[nodes.length - 1].position.y + 100,
    },
    data: { label: (nodes.length + 1).toString() },
  };

  const newSister = {
    id: (nodes.length + 1).toString(),
    position: {
      x: nodes[nodes.length - 1].position.x + 200,
      y: nodes[nodes.length - 1].position.y,
    },
    data: { label: (nodes.length + 1).toString() },
  };

  const handleAddChild = () => {
    const newNodeArray = [...nodes, newChild];
    setNodes(newNodeArray);
  };
  const handleAddSister = () => {
    const newNodeArray = [...nodes, newSister];
    setNodes(newNodeArray);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        {/* <MiniMap /> */}
        <div className="border flex gap-4 rounded-md absolute z-4 bottom-4 -translate-x-[50%] left-[50%] px-8 py-6 bg-white">
          <Button
            variant={"outline"}
            onClick={handleAddChild}
            className="aspect-square relative"
          >
            <Step />
          </Button>
          <Button
            variant={"outline"}
            onClick={handleAddSister}
            className="aspect-square relative"
          >
            <Goal />
          </Button>
        </div>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
