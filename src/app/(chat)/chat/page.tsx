"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import { Header } from "@/components/layout/header";
import { useChat, useAuth } from "@/hooks";

export default function ChatPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { createNewChat, sendMessage, isStreaming } = useChat();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleSelectPrompt = useCallback(
    async (prompt: string) => {
      if (isCreating || !user) return;
      setIsCreating(true);

      try {
        const chat = await createNewChat();
        if (chat) {
          router.push(`/chat/${chat.id}`);
          await sendMessage(prompt, chat.id);
        }
      } finally {
        setIsCreating(false);
      }
    },
    [isCreating, user, createNewChat, router, sendMessage]
  );

  if (authLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-2 w-2 rounded-full bg-[#4285f4]"
              style={{
                animation: "typing-dot 1.4s infinite ease-in-out",
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <WelcomeScreen
          onSelectPrompt={handleSelectPrompt}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
