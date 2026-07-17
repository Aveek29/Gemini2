"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const autoResize = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }, []);

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        autoResize();
        onChange?.(e);
      },
      [autoResize, onChange]
    );

    React.useEffect(() => {
      autoResize();
    }, [autoResize]);

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-[#3c4043] bg-[#282a2a] px-3 py-2 text-sm text-[#e3e3e3] placeholder:text-[#5f6368] transition-all duration-200 resize-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/50 focus-visible:border-[#1a73e8]/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={setRefs}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
