"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked: controlledChecked, defaultChecked = false, onCheckedChange, ...props }, ref) => {
    const [uncontrolledChecked, setUncontrolledChecked] =
      React.useState(defaultChecked);
    const checked = controlledChecked ?? uncontrolledChecked;

    const handleClick = React.useCallback(() => {
      const next = !checked;
      if (controlledChecked === undefined) {
        setUncontrolledChecked(next);
      }
      onCheckedChange?.(next);
    }, [checked, controlledChecked, onCheckedChange]);

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleClick}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000] disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "bg-[#1a73e8]"
            : "bg-[#3c4043]",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
