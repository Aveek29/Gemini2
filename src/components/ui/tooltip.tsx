"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextValue>({
  open: false,
  onOpenChange: () => {},
});

interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
}

function TooltipProvider({
  children,
  delayDuration = 300,
}: TooltipProviderProps) {
  return (
    <TooltipProviderInternal delayDuration={delayDuration}>
      {children}
    </TooltipProviderInternal>
  );
}

const TooltipProviderInternal = ({
  children,
  delayDuration,
}: {
  children: React.ReactNode;
  delayDuration: number;
}) => {
  return (
    <TooltipDelayContext.Provider value={{ delayDuration }}>
      {children}
    </TooltipDelayContext.Provider>
  );
};

const TooltipDelayContext = React.createContext({ delayDuration: 300 });

function useTooltipDelay() {
  return React.useContext(TooltipDelayContext);
}

interface TooltipProps {
  children: React.ReactNode;
}

function Tooltip({ children }: TooltipProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipContext.Provider value={{ open, onOpenChange: setOpen }}>
      <div className="relative inline-block">{children}</div>
    </TooltipContext.Provider>
  );
}

interface TooltipTriggerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const TooltipTrigger = React.forwardRef<HTMLDivElement, TooltipTriggerProps>(
  ({ children, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }, ref) => {
    const { onOpenChange } = React.useContext(TooltipContext);
    const { delayDuration } = useTooltipDelay();
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleOpen = React.useCallback(() => {
      timeoutRef.current = setTimeout(() => {
        onOpenChange(true);
      }, delayDuration);
    }, [onOpenChange, delayDuration]);

    const handleClose = React.useCallback(() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      onOpenChange(false);
    }, [onOpenChange]);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    return (
      <div
        ref={ref}
        onMouseEnter={(e) => {
          handleOpen();
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          handleClose();
          onMouseLeave?.(e);
        }}
        onFocus={(e) => {
          handleOpen();
          onFocus?.(e);
        }}
        onBlur={(e) => {
          handleClose();
          onBlur?.(e);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TooltipTrigger.displayName = "TooltipTrigger";

interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, side = "top", sideOffset = 8, children, ...props }, ref) => {
    const { open } = React.useContext(TooltipContext);

    if (!open) return null;

    const positionClasses = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 max-w-xs rounded-lg border border-white/10 bg-gray-900/90 backdrop-blur-xl px-3 py-1.5 text-xs text-white shadow-xl animate-in fade-in zoom-in-95 duration-150",
          positionClasses[side],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
