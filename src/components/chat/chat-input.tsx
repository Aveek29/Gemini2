"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Square, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store";
import { useVoice } from "@/hooks";

interface ChatInputProps {
  onSend: (content: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
  variant?: "home" | "chat";
}

export function ChatInput({ onSend, onStop, isStreaming, disabled = false, variant = "chat" }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const settings = useSettingsStore();
  const { isRecording, startRecording, stopRecording, transcript, isSupported: voiceSupported } = useVoice();

  const canSend = value.trim().length > 0 && !isStreaming && !disabled;
  const hasText = value.trim().length > 0;

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 6 * 24;
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  }, []);

  useEffect(() => { adjustHeight(); }, [value, adjustHeight]);
  useEffect(() => { if (transcript) setValue((prev) => (prev ? prev + " " + transcript : transcript)); }, [transcript]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [value, isStreaming, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (settings.sendOnEnter) {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
      } else {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleSend(); }
      }
    },
    [handleSend, settings.sendOnEnter]
  );

  return (
    <div className={cn("w-full mx-auto px-4", variant === "home" ? "" : "pb-4")}>
      <div className="relative rounded-3xl bg-[#282a2a] border border-[#3c4043] shadow-lg shadow-black/20">
        <div className="flex items-end gap-2 px-3 py-2.5">
          <div className="relative flex-1 min-h-[24px]">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isStreaming ? "Gemini is thinking..." : "Enter a prompt here"}
              disabled={isStreaming || disabled}
              rows={1}
              className={cn(
                "w-full resize-none bg-transparent text-sm text-[#e3e3e3] placeholder:text-[#9aa0a6]",
                "focus:outline-none border-none",
                "leading-6"
              )}
              style={{ maxHeight: `${6 * 24}px` }}
            />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {isStreaming ? (
              <button
                onClick={onStop}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-[#ea4335]/20 text-[#ea4335] hover:bg-[#ea4335]/30 transition-colors"
                aria-label="Stop generating"
              >
                <Square size={18} fill="currentColor" />
              </button>
            ) : canSend ? (
              <motion.button
                onClick={handleSend}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1a73e8] text-white hover:bg-[#1557b0] transition-colors"
                aria-label="Send message"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Send size={18} />
              </motion.button>
            ) : voiceSupported ? (
              <button
                onClick={() => (isRecording ? stopRecording() : startRecording())}
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-full transition-colors",
                  isRecording
                    ? "text-[#ea4335] bg-[#ea4335]/10"
                    : "text-[#9aa0a6] hover:text-[#e3e3e3] hover:bg-[#3c4043]"
                )}
                aria-label={isRecording ? "Stop recording" : "Voice input"}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            ) : null}
          </div>
        </div>

        <p className="text-center text-xs text-[#5f6368] pb-2 px-4">
          Gemini may display inaccurate info, including about people, so double-check its responses.
        </p>
      </div>
    </div>
  );
}
