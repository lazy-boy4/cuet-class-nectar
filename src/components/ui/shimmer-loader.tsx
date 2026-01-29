
import * as React from "react";
import { cn } from "@/lib/utils";

interface ShimmerLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
}

const ShimmerLoader = React.forwardRef<HTMLDivElement, ShimmerLoaderProps>(
  ({ className, width = "100%", height = "20px", style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-md bg-secondary",
        "before:absolute before:inset-0",
        "before:translate-x-[-100%]",
        "before:animate-shimmer",
        "before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
        className
      )}
      style={{ width, height, ...style }}
      {...props}
    />
  )
);
ShimmerLoader.displayName = "ShimmerLoader";

// Card skeleton with multiple shimmer elements
const CardSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg bg-card p-6 shadow-neu-raised-sm space-y-4",
      className
    )}
    {...props}
  >
    <ShimmerLoader height="24px" width="60%" />
    <ShimmerLoader height="16px" width="100%" />
    <ShimmerLoader height="16px" width="80%" />
    <div className="flex gap-2 pt-2">
      <ShimmerLoader height="32px" width="80px" className="rounded-full" />
      <ShimmerLoader height="32px" width="80px" className="rounded-full" />
    </div>
  </div>
));
CardSkeleton.displayName = "CardSkeleton";

// Stat skeleton
const StatSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center rounded-xl bg-secondary/50 p-4 space-y-2",
      className
    )}
    {...props}
  >
    <ShimmerLoader height="36px" width="60px" />
    <ShimmerLoader height="14px" width="80px" />
  </div>
));
StatSkeleton.displayName = "StatSkeleton";

export { ShimmerLoader, CardSkeleton, StatSkeleton };
