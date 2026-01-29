
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const neuCardVariants = cva(
  "rounded-lg transition-all duration-200",
  {
    variants: {
      variant: {
        raised: "bg-card shadow-neu-raised",
        inset: "bg-luxe-black shadow-neu-inset",
        flat: "bg-card border border-border/50",
        glass: "bg-card/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
      },
      hover: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "raised",
        hover: true,
        className: "hover:-translate-y-1 hover:shadow-neu-button-hover cursor-pointer",
      },
      {
        variant: "flat",
        hover: true,
        className: "hover:bg-secondary hover:border-white/10 cursor-pointer",
      },
      {
        variant: "glass",
        hover: true,
        className: "hover:bg-card/90 hover:border-white/[0.12] cursor-pointer",
      },
    ],
    defaultVariants: {
      variant: "raised",
      hover: false,
    },
  }
);

export interface NeuCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof neuCardVariants> {}

const NeuCard = React.forwardRef<HTMLDivElement, NeuCardProps>(
  ({ className, variant, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(neuCardVariants({ variant, hover, className }))}
      {...props}
    />
  )
);
NeuCard.displayName = "NeuCard";

const NeuCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
NeuCardHeader.displayName = "NeuCardHeader";

const NeuCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
NeuCardTitle.displayName = "NeuCardTitle";

const NeuCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
NeuCardDescription.displayName = "NeuCardDescription";

const NeuCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
NeuCardContent.displayName = "NeuCardContent";

const NeuCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
NeuCardFooter.displayName = "NeuCardFooter";

export {
  NeuCard,
  NeuCardHeader,
  NeuCardFooter,
  NeuCardTitle,
  NeuCardDescription,
  NeuCardContent,
  neuCardVariants,
};
