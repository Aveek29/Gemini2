"use client";

import { useEffect } from "react";
import { Sidebar } from "./sidebar";
import { useAppStore, useSidebarStore } from "@/store";
import { useMediaQuery } from "@/hooks";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isMobile, setIsMobile, setSidebarOpen } = useAppStore();
  const { isOpen } = useSidebarStore();
  const isMobileQuery = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setIsMobile(isMobileQuery);
    if (isMobileQuery) setSidebarOpen(false);
  }, [isMobileQuery, setIsMobile, setSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#000000]">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </main>
    </div>
  );
}
