import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) =>
    set((state) => ({
      sidebarOpen: typeof open === "function" ? open(state.sidebarOpen) : open,
    })),
  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),
}));
