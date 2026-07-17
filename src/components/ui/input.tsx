"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-[#3c4043] bg-[#282a2a] px-3 py-2 text-sm text-[#e3e3e3] placeholder:text-[#5f6368] transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/50 focus-visible:border-[#1a73e8]/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
