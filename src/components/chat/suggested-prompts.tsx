"use client";

import React from "react";
import { motion } from "framer-motion";
import { SUGGESTED_PROMPTS } from "@/config/constants";
import { cn } from "@/lib/utils";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } };

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {SUGGESTED_PROMPTS.map((suggestion) => (
        <motion.button
          key={suggestion.title}
          variants={item}
          onClick={() => onSelect(suggestion.prompt)}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2.5 text-left",
            "border border-[#3c4043] bg-[#282a2a]/50",
            "transition-all duration-150",
            "hover:bg-[#3c4043] hover:border-[#5f6368]",
            "active:scale-[0.98]"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-sm">{suggestion.icon}</span>
          <span className="text-sm text-[#e3e3e3] whitespace-nowrap">{suggestion.title}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
