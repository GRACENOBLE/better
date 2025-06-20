import { create } from "zustand";

export const useStore = create((set) => ({
  roadmapData: null,
  conversationStarter: null,
  setRoadmapData: (data: any) => set({ roadmapData: data }),
  removeRoadmapData: () => set({ roadmapData: null }),
  setConversationStarter: (data: any) => set({ conversationStarter: data }),
  clearConversationStarter: () => set({ conversationStarter: null }),
}));
