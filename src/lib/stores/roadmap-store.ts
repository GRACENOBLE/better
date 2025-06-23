import { create } from "zustand";

interface RoadmapNode {
  id: string;
  label: string;
  type?: "main" | "topic" | "subtopic";
  level?: number;
  description?: string;
}

interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: "main" | "dotted";
}

interface RoadmapData {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  metadata?: {
    topic?: string;
    timeframe?: string;
    difficulty?: string;
  };
}

interface RoadmapStore {
  currentRoadmap: RoadmapData | null;
  setRoadmap: (roadmap: RoadmapData) => void;
  updateNode: (nodeId: string, updates: Partial<RoadmapNode>) => void;
  addNode: (node: RoadmapNode) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: RoadmapEdge) => void;
  removeEdge: (edgeId: string) => void;
  clearRoadmap: () => void;
}

export const useRoadmapStore = create<RoadmapStore>((set, get) => ({
  currentRoadmap: null,

  setRoadmap: (roadmap) => set({ currentRoadmap: roadmap }),

  updateNode: (nodeId, updates) =>
    set((state) => {
      if (!state.currentRoadmap) return state;

      return {
        currentRoadmap: {
          ...state.currentRoadmap,
          nodes: state.currentRoadmap.nodes.map((node) =>
            node.id === nodeId ? { ...node, ...updates } : node
          ),
        },
      };
    }),

  addNode: (node) =>
    set((state) => {
      if (!state.currentRoadmap) return state;

      return {
        currentRoadmap: {
          ...state.currentRoadmap,
          nodes: [...state.currentRoadmap.nodes, node],
        },
      };
    }),

  removeNode: (nodeId) =>
    set((state) => {
      if (!state.currentRoadmap) return state;

      return {
        currentRoadmap: {
          ...state.currentRoadmap,
          nodes: state.currentRoadmap.nodes.filter(
            (node) => node.id !== nodeId
          ),
          edges: state.currentRoadmap.edges.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId
          ),
        },
      };
    }),

  addEdge: (edge) =>
    set((state) => {
      if (!state.currentRoadmap) return state;

      return {
        currentRoadmap: {
          ...state.currentRoadmap,
          edges: [...state.currentRoadmap.edges, edge],
        },
      };
    }),

  removeEdge: (edgeId) =>
    set((state) => {
      if (!state.currentRoadmap) return state;

      return {
        currentRoadmap: {
          ...state.currentRoadmap,
          edges: state.currentRoadmap.edges.filter(
            (edge) => edge.id !== edgeId
          ),
        },
      };
    }),

  clearRoadmap: () => set({ currentRoadmap: null }),
}));
