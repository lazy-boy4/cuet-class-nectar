
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const progressVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        default: "bg-foreground",
        success: "bg-success",
        warning: "bg-warning",
        destructive: "bg-destructive",
        info: "bg-info",
        gradient: "bg-gradient-to-r from-info to-icon-purple",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface NeuProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  showValue?: boolean;
}

const NeuProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  NeuProgressProps
>(({ className, value, variant, showValue, ...props }, ref) => (
  <div className="relative">
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        "bg-luxe-black shadow-neu-inset",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          progressVariants({ variant }),
          "rounded-full",
          "after:absolute after:inset-0 after:bg-gradient-to-r after:from-white/20 after:to-transparent after:rounded-full"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
    {showValue && (
      <span className="absolute -right-2 -top-6 text-xs font-medium text-muted-foreground">
        {value}%
      </span>
    )}
  </div>
));
NeuProgress.displayName = "NeuProgress";

export { NeuProgress, progressVariants };
