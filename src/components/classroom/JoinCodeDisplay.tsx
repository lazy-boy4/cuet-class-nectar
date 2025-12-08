import React, { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface JoinCodeDisplayProps {
  code: string;
  variant?: "default" | "compact";
}

const JoinCodeDisplay: React.FC<JoinCodeDisplayProps> = ({ code, variant = "default" }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Code Copied!",
        description: "Classroom code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the code manually",
        variant: "destructive",
      });
    }
  };

  const shareCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join My Classroom",
          text: `Join my classroom using this code: ${code}`,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      copyCode();
    }
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-white/70">{code}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            copyCode();
          }}
          className="h-6 w-6 text-white/50 hover:text-white"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
      <div className="text-center">
        <p className="text-xs text-white/50">Join Code</p>
        <p className="font-mono text-lg font-bold tracking-widest text-white">{code}</p>
      </div>
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            copyCode();
          }}
          className="h-7 w-7 text-white/70 hover:text-white"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            shareCode();
          }}
          className="h-7 w-7 text-white/70 hover:text-white"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default JoinCodeDisplay;
