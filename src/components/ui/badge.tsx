"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-200",
  {
    variants: {
      variant: {
        default:
          "border-[#1a73e8]/30 bg-[#1a73e8]/10 text-[#8ab4f8]",
        secondary:
          "border-[#3c4043] bg-[#282a2a] text-[#9aa0a6]",
        destructive:
          "border-[#ea4335]/30 bg-[#ea4335]/10 text-[#ea4335]",
        outline:
          "border-[#3c4043] text-[#9aa0a6]",
        success:
          "border-[#34a853]/30 bg-[#34a853]/10 text-[#34a853]",
        warning:
          "border-[#fbbc04]/30 bg-[#fbbc04]/10 text-[#fbbc04]",
        info:
          "border-[#4285f4]/30 bg-[#4285f4]/10 text-[#4285f4]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
