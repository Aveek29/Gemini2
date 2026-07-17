"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODELS } from "@/config/constants";
import { useSidebarStore, useAppStore, useChatStore } from "@/store";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { toggleSidebar } = useSidebarStore();
  const { isMobile } = useAppStore();
  const { currentChat, setCurrentChat } = useChatStore();

  const selectedModel = currentChat?.model || MODELS[0].id;
  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleModelChange = useCallback((modelId: string) => {
    if (currentChat) {
      setCurrentChat({ ...currentChat, model: modelId });
      fetch(`/api/chats/${currentChat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: modelId }),
      }).catch(() => {});
    }
    setIsOpen(false);
  }, [currentChat, setCurrentChat]);

  return (
    <header className="sticky top-0 z-30 flex items-center px-3 py-2 bg-[#000000]">
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#282a2a] transition-colors mr-1"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5 text-[#9aa0a6]" />
      </button>

      <div ref={ref} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-[#e3e3e3] hover:bg-[#282a2a] transition-colors"
        >
          <span>{currentModel.name}</span>
          <ChevronDown className={cn("w-4 h-4 text-[#9aa0a6] transition-transform duration-200", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-72 rounded-2xl bg-[#282a2a] border border-[#3c4043] shadow-2xl overflow-hidden z-50">
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelChange(model.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#3c4043] transition-colors",
                  model.id === selectedModel && "bg-[#3c4043]"
                )}
              >
                <div>
                  <p className="text-sm text-[#e3e3e3]">{model.name}</p>
                  <p className="text-xs text-[#9aa0a6] mt-0.5">{model.description}</p>
                </div>
                {model.id === selectedModel && <Check className="w-4 h-4 text-[#8ab4f8] shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
