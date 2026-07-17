import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Settings {
  theme: "dark" | "light" | "system";
  language: string;
  temperature: number;
  topP: number;
  topK: number;
  maxTokens: number;
  systemPrompt: string;
  sendOnEnter: boolean;
}

interface SettingsState extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: "dark",
  language: "en",
  temperature: 1.0,
  topP: 0.95,
  topK: 40,
  maxTokens: 8192,
  systemPrompt:
    "You are Gemini, a helpful, harmless, and honest AI assistant.",
  sendOnEnter: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({ ...state, ...newSettings })),
      resetSettings: () => set(defaultSettings),
    }),
    { name: "gemini-settings" }
  )
);
