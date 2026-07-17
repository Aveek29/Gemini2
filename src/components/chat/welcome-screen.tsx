"use client";

import React from "react";
import { motion } from "framer-motion";
import { GeminiSpark } from "@/components/ui/gemini-spark";
import { SuggestedPrompts } from "./suggested-prompts";
import { ChatInput } from "./chat-input";

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
  isStreaming?: boolean;
}

export function WelcomeScreen({ onSelectPrompt, isStreaming = false }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <motion.div
          className="flex flex-col items-center text-center max-w-2xl w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <GeminiSpark size={40} />
          </motion.div>

          <motion.h1
            className="mt-6 text-3xl font-normal text-[#e3e3e3] sm:text-4xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            Hello, there
          </motion.h1>

          <motion.p
            className="mt-2 text-base text-[#9aa0a6]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            What can I help with?
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        className="w-full max-w-[768px] mx-auto px-4 pb-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <SuggestedPrompts onSelect={onSelectPrompt} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <ChatInput
          onSend={onSelectPrompt}
          onStop={() => {}}
          isStreaming={isStreaming}
          variant="home"
        />
      </motion.div>
    </div>
  );
}
