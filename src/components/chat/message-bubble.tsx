"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown";
import { GeminiSpark } from "@/components/ui/gemini-spark";
import type { Message } from "@/types";
import { MessageRole } from "@/types";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

function StreamingCursor() {
  return <span className="inline-block w-[2px] h-[18px] bg-[#8ab4f8] ml-0.5 animate-pulse" />;
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const isUser = message.role === MessageRole.USER;
  const isEmpty = !message.content && isStreaming;

  const handleCopy = async () => {
    await copyToClipboard(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex justify-center">
      <div
        className="w-full max-w-[768px] px-4"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {isUser ? (
          <div className="flex justify-end py-3">
            <div className="max-w-[85%] rounded-3xl bg-[#282a2a] px-5 py-3 text-sm text-[#e3e3e3] leading-relaxed">
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="py-3"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <GeminiSpark size={28} />
              </div>
              <div className="flex-1 min-w-0">
                {isEmpty ? (
                  <div className="flex items-center gap-1 py-2">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="block h-2 w-2 rounded-full bg-[#4285f4]"
                        style={{ animation: "typing-dot 1.4s infinite ease-in-out", animationDelay: `${i * 0.16}s` }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-[#e3e3e3] leading-relaxed">
                    <MarkdownRenderer content={message.content} />
                    {isStreaming && <StreamingCursor />}
                  </div>
                )}

                {!isStreaming && message.content && (
                  <AnimatePresence>
                    {showActions && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="flex items-center gap-1 mt-3 -ml-1"
                      >
                        <button onClick={handleCopy} className="p-2 rounded-full hover:bg-[#282a2a] text-[#9aa0a6] hover:text-[#e3e3e3] transition-colors" title="Copy">
                          {copied ? <Check size={16} className="text-[#34a853]" /> : <Copy size={16} />}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
