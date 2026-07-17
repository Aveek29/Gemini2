"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore, useAppStore } from "@/store";
import { useRouter } from "next/navigation";
import { GeminiSpark } from "@/components/ui/gemini-spark";
import { useAuth } from "@/hooks";

interface ChatItem {
  id: string;
  title: string;
  updated_at: string;
}

export function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const { isMobile, setSidebarOpen } = useAppStore();
  const router = useRouter();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const { signOut } = useAuth();

  const fetchChats = useCallback(() => {
    fetch("/api/chats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.items) setChats(data.items);
      })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchChats(); }, [fetchChats]);

  const handleClose = useCallback(() => {
    if (isMobile) setSidebarOpen(false);
    else toggleSidebar();
  }, [isMobile, setSidebarOpen, toggleSidebar]);

  const handleNewChat = useCallback(() => {
    router.push("/chat");
    if (isMobile) setSidebarOpen(false);
  }, [router, isMobile, setSidebarOpen]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      router.push("/login");
      if (isMobile) setSidebarOpen(false);
    } catch {
      // Silent fail
    }
  }, [signOut, router, isMobile, setSidebarOpen]);

  const groupedChats = groupChatsByDate(chats);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#171717]">
      {/* Top bar: hamburger + new chat */}
      <div className="flex items-center gap-1 px-2 pt-2 pb-1">
        <button
          onClick={handleClose}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#282a2a] transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-[#9aa0a6]" />
        </button>
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 flex-1 rounded-full px-4 py-2.5 text-sm text-[#e3e3e3] hover:bg-[#282a2a] transition-colors"
        >
          <span className="text-[#9aa0a6]">New chat</span>
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {Object.entries(groupedChats).map(([label, groupChats]) => (
          <div key={label} className="mb-3">
            <p className="px-3 py-1.5 text-xs font-medium text-[#9aa0a6]">{label}</p>
            {groupChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  router.push(`/chat/${chat.id}`);
                  if (isMobile) setSidebarOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-full text-sm text-[#e3e3e3] truncate hover:bg-[#282a2a] transition-colors"
              >
                {chat.title}
              </button>
            ))}
          </div>
        ))}
        {chats.length === 0 && (
          <div className="px-3 py-12 text-center">
            <p className="text-sm text-[#5f6368]">No conversations yet</p>
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="border-t border-[#3c4043] px-2 py-2 space-y-0.5">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-full text-sm text-[#e3e3e3] hover:bg-[#282a2a] transition-colors"
        >
          <LogOut className="w-5 h-5 text-[#9aa0a6]" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden lg:block h-screen overflow-hidden shrink-0"
      >
        <div className="w-[280px] h-full">{sidebarContent}</div>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function groupChatsByDate(chats: ChatItem[]): Record<string, ChatItem[]> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const groups: Record<string, ChatItem[]> = {};
  for (const chat of chats) {
    const d = new Date(chat.updated_at);
    let label: string;
    if (d >= today) label = "Today";
    else if (d >= yesterday) label = "Yesterday";
    else if (d >= weekAgo) label = "Previous 7 days";
    else if (d >= monthAgo) label = "Previous 30 days";
    else label = "Older";
    if (!groups[label]) groups[label] = [];
    groups[label].push(chat);
  }
  return groups;
}
