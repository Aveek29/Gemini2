"use client";

import { useCallback } from "react";
import { useChatStore } from "@/store/use-chat-store";
import { useSettingsStore } from "@/store/use-settings-store";
import { MessageRole } from "@/types";
import type { Message, Chat } from "@/types";

export function useChat() {
  const {
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    addMessage,
    isStreaming,
    setIsStreaming,
    streamingContent,
    setStreamingContent,
    appendStreamingContent,
    error,
    setError,
    abortController,
    setAbortController,
    resetChat,
  } = useChatStore();

  const settings = useSettingsStore();

  const loadMessages = useCallback(
    async (chatId: string) => {
      try {
        const res = await fetch(`/api/chats/${chatId}/messages`);
        if (!res.ok) throw new Error("Failed to load messages");
        const data = await res.json();
        setMessages(data);
      } catch {
        setMessages([]);
      }
    },
    [setMessages]
  );

  const sendMessage = useCallback(
    async (content: string, chatId?: string) => {
      const id = chatId || currentChat?.id;
      if (!id) return;

      setError(null);

      const userMessage: Message = {
        id: crypto.randomUUID(),
        chat_id: id,
        role: MessageRole.USER,
        content,
        token_count: null,
        created_at: new Date().toISOString(),
      };
      addMessage(userMessage);

      try {
        await fetch(`/api/chats/${id}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: MessageRole.USER, content }),
        });
      } catch {
      }

      setIsStreaming(true);
      setStreamingContent("");
      const controller = new AbortController();
      setAbortController(controller);

      try {
        const allMessages = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId: id,
            messages: allMessages,
            systemPrompt: settings.systemPrompt,
            temperature: settings.temperature,
            topP: settings.topP,
            topK: settings.topK,
            maxTokens: settings.maxTokens,
            model: currentChat?.model,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(errData?.error || "Failed to get response");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";
        let buffer = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const parts = buffer.split("\n\n");
            buffer = parts.pop() || "";

            for (const part of parts) {
              for (const line of part.split("\n")) {
                if (line.startsWith("data: ")) {
                  const payload = line.slice(6).trim();
                  if (!payload) continue;
                  try {
                    const data = JSON.parse(payload);
                    if (data.error) {
                      throw new Error(data.error);
                    }
                    if (data.text) {
                      assistantContent += data.text;
                      appendStreamingContent(data.text);
                    }
                  } catch (parseErr) {
                    if (parseErr instanceof Error && parseErr.message !== "Unexpected end of JSON input") {
                      throw parseErr;
                    }
                  }
                }
              }
            }
          }
        }

        if (assistantContent) {
          try {
            await fetch(`/api/chats/${id}/messages`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                role: MessageRole.ASSISTANT,
                content: assistantContent,
              }),
            });
          } catch {
          }

          addMessage({
            id: crypto.randomUUID(),
            chat_id: id,
            role: MessageRole.ASSISTANT,
            content: assistantContent,
            token_count: null,
            created_at: new Date().toISOString(),
          });
        }

        setStreamingContent("");
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
        } else {
          setError(
            err instanceof Error ? err.message : "An error occurred"
          );
        }
      } finally {
        setIsStreaming(false);
        setAbortController(null);
        setStreamingContent("");
      }
    },
    [
      currentChat,
      messages,
      addMessage,
      setIsStreaming,
      setStreamingContent,
      appendStreamingContent,
      setError,
      setAbortController,
      settings,
    ]
  );

  const stopGeneration = useCallback(() => {
    abortController?.abort();
    setIsStreaming(false);
    setStreamingContent("");
  }, [abortController, setIsStreaming, setStreamingContent]);

  const createNewChat = useCallback(
    async (title?: string): Promise<Chat | null> => {
      try {
        const res = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title || "New Chat" }),
        });
        if (!res.ok) throw new Error("Failed to create chat");
        const chat = await res.json();
        setCurrentChat(chat);
        setMessages([]);
        return chat;
      } catch {
        return null;
      }
    },
    [setCurrentChat, setMessages]
  );

  return {
    currentChat,
    setCurrentChat,
    messages,
    isStreaming,
    streamingContent,
    error,
    sendMessage,
    stopGeneration,
    loadMessages,
    createNewChat,
    resetChat,
  };
}
