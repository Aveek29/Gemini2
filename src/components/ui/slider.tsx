"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  disabled?: boolean;
  className?: string;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      min = 0,
      max = 100,
      step = 1,
      value: controlledValue,
      defaultValue,
      onValueChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const trackRef = React.useRef<HTMLDivElement>(null);
    const [internalValue, setInternalValue] = React.useState<number[]>(
      defaultValue ?? [min]
    );
    const values = controlledValue ?? internalValue;
    const [isDragging, setIsDragging] = React.useState(false);

    const percentage = React.useCallback(
      (val: number) => ((val - min) / (max - min)) * 100,
      [min, max]
    );

    const updateValue = React.useCallback(
      (clientX: number) => {
        const track = trackRef.current;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const raw = min + ratio * (max - min);
        const stepped = Math.round(raw / step) * step;
        const clamped = Math.max(min, Math.min(max, stepped));
        const next = [clamped];
        if (controlledValue === undefined) {
          setInternalValue(next);
        }
        onValueChange?.(next);
      },
      [min, max, step, controlledValue, onValueChange]
    );

    const handlePointerDown = React.useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return;
        e.preventDefault();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        setIsDragging(true);
        updateValue(e.clientX);
      },
      [disabled, updateValue]
    );

    const handlePointerMove = React.useCallback(
      (e: React.PointerEvent) => {
        if (!isDragging || disabled) return;
        updateValue(e.clientX);
      },
      [isDragging, disabled, updateValue]
    );

    const handlePointerUp = React.useCallback(() => {
      setIsDragging(false);
    }, []);

    const fillLeft = values.length > 0 ? percentage(values[0]) : 0;

    return (
      <div
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        {...props}
      >
        <div
          ref={trackRef}
          className={cn(
            "relative h-2 w-full cursor-pointer rounded-full bg-[#3c4043]",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={values[0] ?? min}
        >
          <div
            className="absolute h-full rounded-full bg-[#1a73e8] transition-all duration-75"
            style={{ width: `${fillLeft}%` }}
          />
          {values.map((val, i) => (
            <div
              key={i}
              className={cn(
                "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#1a73e8] bg-white shadow-lg transition-transform duration-100",
                isDragging && "scale-110"
              )}
              style={{ left: `${percentage(val)}%` }}
            />
          ))}
        </div>
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
