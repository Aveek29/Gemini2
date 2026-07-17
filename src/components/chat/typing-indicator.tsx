"use client";

import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-1.5 px-1 py-2", className)}>
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
  );
}
