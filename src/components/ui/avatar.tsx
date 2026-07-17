"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarContextValue {
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
}

const AvatarContext = React.createContext<AvatarContextValue>({
  imageLoaded: false,
  setImageLoaded: () => {},
});

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, children, ...props }, ref) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);

    return (
      <AvatarContext.Provider value={{ imageLoaded, setImageLoaded }}>
        <div
          ref={ref}
          className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#282a2a] border border-[#3c4043]",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AvatarContext.Provider>
    );
  }
);
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, src, alt, onLoad, ...props }, ref) => {
  const { setImageLoaded } = React.useContext(AvatarContext);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    if (!src) {
      setImageLoaded(false);
      setHasError(true);
    }
  }, [src, setImageLoaded]);

  if (hasError || !src) return null;

  return (
    <img
      ref={ref}
      src={src}
      alt={alt ?? ""}
      className={cn("aspect-square h-full w-full object-cover", className)}
      onLoad={(e) => {
        setImageLoaded(true);
        onLoad?.(e);
      }}
      onError={() => {
        setHasError(true);
      }}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, name, ...props }, ref) => {
    const { imageLoaded } = React.useContext(AvatarContext);

    if (imageLoaded) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-[#1a73e8] text-sm font-medium text-white",
          className
        )}
        {...props}
      >
        {name ? getInitials(name) : children}
      </div>
    );
  }
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
