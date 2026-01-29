
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statVariants = cva(
  "flex flex-col items-center justify-center rounded-xl p-4 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-secondary/50",
        success: "bg-success/10",
        warning: "bg-warning/10",
        destructive: "bg-destructive/10",
        info: "bg-info/10",
        neu: "bg-card shadow-neu-raised-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const valueVariants = cva(
  "text-3xl font-bold tabular-nums",
  {
    variants: {
      variant: {
        default: "text-foreground",
        success: "text-success",
        warning: "text-warning",
        destructive: "text-destructive",
        info: "text-info",
        neu: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const labelVariants = cva(
  "text-sm mt-1",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        success: "text-success/80",
        warning: "text-warning/80",
        destructive: "text-destructive/80",
        info: "text-info/80",
        neu: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatDisplayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statVariants> {
  value: number | string;
  label: string;
  animate?: boolean;
}

const StatDisplay = React.forwardRef<HTMLDivElement, StatDisplayProps>(
  ({ className, variant, value, label, animate = false, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(animate ? 0 : value);
    
    React.useEffect(() => {
      if (animate && typeof value === "number") {
        const duration = 1000;
        const steps = 30;
        const increment = value / steps;
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= value) {
            setDisplayValue(value);
            clearInterval(timer);
          } else {
            setDisplayValue(Math.round(current));
          }
        }, duration / steps);
        
        return () => clearInterval(timer);
      } else {
        setDisplayValue(value);
      }
    }, [value, animate]);
    
    return (
      <div
        ref={ref}
        className={cn(statVariants({ variant, className }))}
        {...props}
      >
        <span className={cn(valueVariants({ variant }))}>
          {displayValue}
        </span>
        <span className={cn(labelVariants({ variant }))}>
          {label}
        </span>
      </div>
    );
  }
);
StatDisplay.displayName = "StatDisplay";

export { StatDisplay, statVariants };
