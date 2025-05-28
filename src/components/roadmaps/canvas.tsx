"use client";
import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button, buttonVariants } from "../ui/button";
import {
  Child,
  Sister,
  AlignHorizontal,
  AlignVertical,
  AlignAllNodes,
} from "../icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const initialNodes = [
  {
    id: "1",
    position: { x: 500, y: 500 },
    type: "input",
    data: { label: "1" },
  },
  { id: "2", position: { x: 500, y: 600 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [newChildText, setNewChildText] = useState<string>("");
  const [parentNode, setParentNode] = useState("1");

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleAddChild = () => {
    const newChild = {
      id: (nodes.length + 1).toString(),
      position: {
        x: nodes[nodes.length - 1].position.x,
        y: nodes[nodes.length - 1].position.y + 100,
      },
      data: { label: newChildText.toString() },
    };

    const newEdge = {
      id: `e${nodes.length}-${nodes.length + 1})`,
      source: String(nodes.length),
      target: String(nodes.length + 1),
    };

    const newNodeArray = [...nodes, newChild];
    setNodes(newNodeArray);
    const newEdgeArray = [...edges, newEdge];
    setEdges(newEdgeArray);
    setNewChildText("");
    setParentNode(String(parseInt(newChild.id) - 1));
  };

  const handleAddSister = () => {
    const newSister = {
      id: (nodes.length + 1).toString(),
      position: {
        x: nodes[nodes.length - 1].position.x + 200,
        y: nodes[nodes.length - 1].position.y,
      },
      data: { label: (nodes.length + 1).toString() },
    };

    const newEdge = {
      id: `e${parentNode}-${nodes.length + 1})`,
      source: String(parentNode),
      target: String(nodes.length + 1),
    };

    const newNodeArray = [...nodes, newSister];
    setNodes(newNodeArray);
    const newEdgeArray = [...edges, newEdge];
    setEdges(newEdgeArray);
    setNewChildText("");
  };

  const handleAlignHorizontal = () => {
    throw new Error("Not yet implemented");
  };

  const handleAlignVertical = () => {
    throw new Error("Not yet implemented");
  };

  const handleAlignAll = () => {
    throw new Error("Not yet implemented");
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
          <Dialog>
            <DialogTrigger
              className={cn(
                "aspect-square relative",
                buttonVariants({ variant: "outline" })
              )}
            >
              <Child />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a child</DialogTitle>
                <DialogDescription className="pt-4 flex flex-col items-end gap-4">
                  <Input
                    placeholder="Child text"
                    value={newChildText}
                    onChange={(e) => setNewChildText(e.target.value)}
                  />
                  <Button onClick={handleAddChild} className="">
                    Add child
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Button
            variant={"outline"}
            onClick={handleAddSister}
            className="aspect-square relative"
          >
            <Sister />
          </Button>
          <Button
            variant={"outline"}
            onClick={handleAlignHorizontal}
            className="aspect-square relative"
          >
            <AlignHorizontal />
          </Button>
          <Button
            variant={"outline"}
            onClick={handleAlignVertical}
            className="aspect-square relative"
          >
            <AlignVertical />
          </Button>
          <Button
            variant={"outline"}
            onClick={handleAlignAll}
            className="aspect-square relative"
          >
            <AlignAllNodes />
          </Button>
        </div>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
