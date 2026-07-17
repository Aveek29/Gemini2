"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const SelectContext = React.createContext<SelectContextValue>({
  open: false,
  onOpenChange: () => {},
  value: "",
  onValueChange: () => {},
});

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

function Select({ value: controlledValue, defaultValue = "", onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = controlledValue ?? internalValue;

  const handleValueChange = React.useCallback(
    (v: string) => {
      if (controlledValue === undefined) {
        setInternalValue(v);
      }
      onValueChange?.(v);
      setOpen(false);
    },
    [controlledValue, onValueChange]
  );

  return (
    <SelectContext.Provider
      value={{
        open,
        onOpenChange: setOpen,
        value,
        onValueChange: handleValueChange,
      }}
    >
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  placeholder?: string;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, placeholder = "Select...", ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(SelectContext);

    return (
      <button
        ref={ref}
        type="button"
        role="combobox"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-xl border border-[#3c4043] bg-[#282a2a] px-3 py-2 text-sm text-[#e3e3e3] transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/50 focus-visible:border-[#1a73e8]/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "h-4 w-4 shrink-0 text-white/40 transition-transform duration-200",
            open && "rotate-180"
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder: propPlaceholder, ...props }, ref) => {
  const { value, placeholder: contextPlaceholder } = React.useContext(SelectContext);
  const displayPlaceholder = propPlaceholder ?? contextPlaceholder ?? "Select...";

  return (
    <span
      ref={ref}
      className={cn(
        "truncate",
        !value && "text-white/40",
        className
      )}
      {...props}
    >
      {value || displayPlaceholder}
    </span>
  );
});
SelectValue.displayName = "SelectValue";

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(SelectContext);
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

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, mounted, onOpenChange]);

    if (!open || !mounted) return null;

    return (
      <div
        ref={setRefs}
        className={cn(
          "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-[#3c4043] bg-[#1e1f20] p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-200",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectContent.displayName = "SelectContent";

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value: itemValue, ...props }, ref) => {
    const { value, onValueChange } = React.useContext(SelectContext);
    const isSelected = value === itemValue;

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        onClick={() => onValueChange(itemValue)}
        className={cn(
          "relative flex cursor-pointer select-none items-center rounded-lg px-2 py-1.5 text-sm text-[#9aa0a6] outline-none transition-colors hover:bg-[#282a2a] hover:text-[#e3e3e3]",
          isSelected && "bg-[#1a73e8]/10 text-[#e3e3e3]",
          className
        )}
        {...props}
      >
        {isSelected && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 shrink-0"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
        <span className="truncate">{children}</span>
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-white/10", className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectSeparator };
