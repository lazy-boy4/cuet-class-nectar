
import * as React from "react";
import { cn } from "@/lib/utils";

export interface NeuInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const NeuInput = React.forwardRef<HTMLInputElement, NeuInputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const inputId = id || React.useId();
    
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-muted-foreground transition-colors peer-focus:text-foreground"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-md px-4 py-3 text-base transition-all duration-150",
            "bg-luxe-black border border-white/[0.08]",
            "shadow-neu-inset",
            "text-foreground placeholder:text-muted-foreground/60",
            "focus:outline-none focus:border-info focus:ring-2 focus:ring-info/10",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus:border-destructive focus:ring-destructive/10",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
NeuInput.displayName = "NeuInput";

export { NeuInput };
