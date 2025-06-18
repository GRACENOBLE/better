import { create } from "zustand";

export const useStore = create((set) => ({
  roadmapData: null,
  setRoadmapData: (data: any) => set({ roadmapData: data}),
  removeAllBears: () => set({ roadmapData: null }),
}));
