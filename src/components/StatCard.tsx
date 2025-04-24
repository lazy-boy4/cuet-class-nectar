
import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
}

const StatCard = ({ title, value, icon: Icon, color = "from-blue-600 to-blue-800" }: StatCardProps) => {
  return (
    <div className="reveal rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/[0.07]">
      <div className="flex items-center">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-white/70">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
