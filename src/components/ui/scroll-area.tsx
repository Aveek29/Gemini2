"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ScrollAreaContextValue {
  scrollbarWidth: number;
  thumbTop: number;
  thumbHeight: number;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  setThumbTop: (top: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const ScrollAreaContext = React.createContext<ScrollAreaContextValue>({
  scrollbarWidth: 0,
  thumbTop: 0,
  thumbHeight: 0,
  isDragging: false,
  setIsDragging: () => {},
  setThumbTop: () => {},
  containerRef: { current: null },
  contentRef: { current: null },
});

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: number | string;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, maxHeight, style, ...props }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [thumbHeight, setThumbHeight] = React.useState(0);
    const [thumbTop, setThumbTop] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);
    const scrollRatioRef = React.useRef(0);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    React.useEffect(() => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      const update = () => {
        const scrollHeight = content.scrollHeight;
        const clientHeight = container.clientHeight;
        if (scrollHeight <= clientHeight) {
          setThumbHeight(0);
          return;
        }
        const ratio = clientHeight / scrollHeight;
        setThumbHeight(Math.max(20, clientHeight * ratio));
        scrollRatioRef.current =
          (container.clientHeight - thumbHeight) /
          (scrollHeight - clientHeight);
      };

      const handleScroll = () => {
        const scrollRatio =
          container.scrollTop / (content.scrollHeight - container.clientHeight);
        const maxTop = container.clientHeight - thumbHeight;
        setThumbTop(scrollRatio * maxTop);
      };

      update();
      handleScroll();

      const resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(container);
      resizeObserver.observe(content);

      container.addEventListener("scroll", handleScroll);

      return () => {
        resizeObserver.disconnect();
        container.removeEventListener("scroll", handleScroll);
      };
    }, [thumbHeight]);

    const handleThumbMouseDown = React.useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        const startY = e.clientY;
        const startTop = thumbTop;
        const container = containerRef.current;
        if (!container) return;

        const contentScrollHeight = container.scrollHeight - container.clientHeight;

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const delta = moveEvent.clientY - startY;
          const maxTop = container.clientHeight - thumbHeight;
          const newTop = Math.min(maxTop, Math.max(0, startTop + delta));
          const scrollRatio = maxTop > 0 ? newTop / maxTop : 0;
          container.scrollTop = scrollRatio * contentScrollHeight;
        };

        const handleMouseUp = () => {
          setIsDragging(false);
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      },
      [thumbTop, thumbHeight]
    );

    return (
      <ScrollAreaContext.Provider
        value={{
          scrollbarWidth: 8,
          thumbTop,
          thumbHeight,
          isDragging,
          setIsDragging,
          setThumbTop,
          containerRef,
          contentRef,
        }}
      >
        <div
          ref={setRefs}
          className={cn("relative overflow-hidden", className)}
          style={{ maxHeight, ...style }}
          {...props}
        >
          <div
            ref={contentRef}
            className="h-full w-full overflow-y-auto overflow-x-hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {children}
          </div>
          {thumbHeight > 0 && (
            <div
              className="absolute right-0 top-0 h-full w-2"
              onMouseDown={(e) => {
                const container = containerRef.current;
                if (!container) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const clickY = e.clientY - rect.top;
                const currentThumbCenter = thumbTop + thumbHeight / 2;
                if (Math.abs(clickY - currentThumbCenter) > thumbHeight / 2) {
                  const scrollRatio = clickY / rect.height;
                  const contentScrollHeight =
                    container.scrollHeight - container.clientHeight;
                  container.scrollTop = scrollRatio * contentScrollHeight;
                }
              }}
            >
              <div
                className="absolute right-0.5 rounded-full bg-white/20 transition-colors hover:bg-white/30"
                style={{
                  width: 6,
                  height: thumbHeight,
                  top: thumbTop,
                  transform: isDragging ? "scaleX(1.2)" : "scaleX(1)",
                }}
                onMouseDown={handleThumbMouseDown}
              />
            </div>
          )}
        </div>
      </ScrollAreaContext.Provider>
    );
  }
);
ScrollArea.displayName = "ScrollArea";

interface ScrollBarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
}

const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" &&
          "h-full w-2 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" &&
          "h-2 flex-col border-t border-t-transparent p-[1px]",
        className
      )}
      {...props}
    />
  )
);
ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
