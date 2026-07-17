import { create } from "zustand";
import type { Chat, Message } from "@/types";

interface ChatState {
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat | null) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  streamingContent: string;
  setStreamingContent: (content: string) => void;
  appendStreamingContent: (content: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  abortController: AbortController | null;
  setAbortController: (controller: AbortController | null) => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentChat: null,
  setCurrentChat: (chat) => set({ currentChat: chat }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  isStreaming: false,
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),
  streamingContent: "",
  setStreamingContent: (content) => set({ streamingContent: content }),
  appendStreamingContent: (content) =>
    set((state) => ({
      streamingContent: state.streamingContent + content,
    })),
  error: null,
  setError: (error) => set({ error }),
  abortController: null,
  setAbortController: (controller) => set({ abortController: controller }),
  resetChat: () =>
    set({
      currentChat: null,
      messages: [],
      isStreaming: false,
      streamingContent: "",
      error: null,
      abortController: null,
    }),
}));
