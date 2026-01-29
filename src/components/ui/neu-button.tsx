
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const neuButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-card text-foreground shadow-neu-button hover:-translate-y-0.5 hover:shadow-neu-button-hover active:scale-[0.98] active:shadow-neu-button-active",
        primary:
          "bg-gradient-to-r from-info to-blue-600 text-white shadow-glow-blue hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] active:scale-[0.98]",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
        outline:
          "border border-border/50 bg-transparent text-foreground hover:bg-secondary hover:border-white/10",
        link:
          "text-info underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground shadow-neu-button-sm hover:-translate-y-0.5 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-2 rounded-md",
        sm: "h-9 px-4 rounded-md text-xs",
        lg: "h-12 px-8 rounded-lg text-base",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface NeuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neuButtonVariants> {
  asChild?: boolean;
}

const NeuButton = React.forwardRef<HTMLButtonElement, NeuButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(neuButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
NeuButton.displayName = "NeuButton";

export { NeuButton, neuButtonVariants };
