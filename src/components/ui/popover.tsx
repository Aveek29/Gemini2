"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextValue>({
  open: false,
  onOpenChange: () => {},
});

interface PopoverProps {
  children: React.ReactNode;
}

function Popover({ children }: PopoverProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <PopoverContext.Provider value={{ open, onOpenChange: setOpen }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

interface PopoverTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ children, onClick, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(PopoverContext);

    return (
      <button
        ref={ref}
        onClick={(e) => {
          onClick?.(e);
          onOpenChange(!open);
        }}
        aria-expanded={open}
        {...props}
      >
        {children}
      </button>
    );
  }
);
PopoverTrigger.displayName = "PopoverTrigger";

interface PopoverContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = "center", sideOffset = 4, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(PopoverContext);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = React.useState(false);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    React.useEffect(() => {
      setMounted(true);
    }, []);

    React.useEffect(() => {
      if (!open || !mounted) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(e.target as Node)
        ) {
          onOpenChange(false);
        }
      };

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onOpenChange(false);
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [open, mounted, onOpenChange]);

    if (!open || !mounted) return null;

    const alignClasses = {
      start: "left-0",
      center: "left-1/2 -translate-x-1/2",
      end: "right-0",
    };

    return (
      <div
        ref={setRefs}
        className={cn(
          "absolute z-50 w-72 rounded-xl border border-white/10 bg-gray-900/80 backdrop-blur-xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200",
          alignClasses[align],
          className
        )}
        style={{ top: `calc(100% + ${sideOffset}px)` }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
