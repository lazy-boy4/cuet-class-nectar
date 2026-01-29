
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glowBadgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-secondary text-foreground border border-border/50",
        blue: "bg-info/10 text-info border border-info/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
        purple: "bg-icon-purple/10 text-icon-purple border border-icon-purple/20 shadow-[0_0_10px_rgba(147,51,234,0.2)]",
        green: "bg-success/10 text-success border border-success/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
        orange: "bg-warning/10 text-warning border border-warning/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
        red: "bg-destructive/10 text-destructive border border-destructive/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
        platinum: "bg-luxe-platinum/10 text-luxe-platinum border border-luxe-platinum/20",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface GlowBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof glowBadgeVariants> {}

const GlowBadge = React.forwardRef<HTMLSpanElement, GlowBadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(glowBadgeVariants({ variant, size, className }))}
      {...props}
    />
  )
);
GlowBadge.displayName = "GlowBadge";

export { GlowBadge, glowBadgeVariants };
