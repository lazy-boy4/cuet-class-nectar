
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
}

const ActionButton = ({ 
  label, 
  icon: Icon, 
  onClick, 
  variant = "default",
  size = "default",
  className = "",
  disabled = false
}: ActionButtonProps) => {
  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={onClick} 
      className={className}
      disabled={disabled}
    >
      <span>{label}</span>
      <Icon size={16} className="ml-2" />
    </Button>
  );
};

export default ActionButton;
