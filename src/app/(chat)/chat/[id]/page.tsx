"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useChat, useAuth } from "@/hooks";
import { Header } from "@/components/layout/header";
import { MessageBubble } from "@/components/chat/message-bubble";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { ChatInput } from "@/components/chat/chat-input";
import type { Message } from "@/types";
import { MessageRole } from "@/types";

export default function ChatIdPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const {
    messages,
    isStreaming,
    streamingContent,
    error,
    sendMessage,
    stopGeneration,
    loadMessages,
  } = useChat();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && params.id) loadMessages(params.id);
  }, [user, params.id, loadMessages]);

  useEffect(() => {
    const el = document.getElementById("chat-scroll-container");
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streamingContent]);

  const handleSendMessage = async (content: string) => {
    if (!params.id) return;
    await sendMessage(content, params.id);
  };

  if (authLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <TypingIndicator />
      </div>
    );
  }
  if (!user) return null;

  const streamingMessage: Message | null = isStreaming
    ? {
        id: "streaming",
        chat_id: params.id,
        role: MessageRole.ASSISTANT,
        content: streamingContent,
        token_count: null,
        created_at: new Date().toISOString(),
      }
    : null;

  return (
    <div className="flex h-full flex-col bg-[#000000]">
      <Header />
      <div
        id="chat-scroll-container"
        className="flex-1 overflow-y-auto"
      >
        <div className="mx-auto max-w-[768px] py-2">
          {messages.length === 0 && !isStreaming && (
            <div className="flex h-full items-center justify-center py-20">
              <p className="text-sm text-[#5f6368]">
                Send a message to start the conversation.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isStreaming && streamingMessage && (
            <MessageBubble message={streamingMessage} isStreaming />
          )}

          {error && (
            <div className="mx-4 my-2 rounded-xl border border-[#ea4335]/30 bg-[#ea4335]/10 px-4 py-3 text-sm text-[#ea4335]">
              {error}
            </div>
          )}
        </div>
      </div>

      <ChatInput
        onSend={handleSendMessage}
        onStop={stopGeneration}
        isStreaming={isStreaming}
        variant="chat"
      />
    </div>
  );
}
