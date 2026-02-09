import React from "react";
import { Info } from "lucide-react";

import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FBStatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  tooltipText?: string;
  variant?: "default" | "blue" | "emerald" | "red" | "amber";
  trend?: {
    value: number;
    isPositive: boolean;
  };
  formatter?: (val: any) => string;
}

const FBStatCard: React.FC<FBStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  disabled = false,
  tooltipText,
  variant = "default",
  trend,
  formatter = formatCompactNumber,
}) => {
  const variants = {
    default: "bg-white/60 border-white/40 shadow-black/5",
    blue: "bg-blue-50/40 border-blue-200/30 shadow-blue-500/5",
    emerald: "bg-emerald-50/40 border-emerald-200/30 shadow-emerald-500/5",
    red: "bg-red-50/40 border-red-200/30 shadow-red-500/5",
    amber: "bg-amber-50/40 border-amber-200/30 shadow-amber-500/5",
  };

  return (
    <div className={`group p-8 rounded-[40px] shadow-xl backdrop-blur-2xl border flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-1 ${variants[variant]} ${disabled ? "opacity-50 grayscale select-none" : ""}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl transition-all duration-500 shadow-sm ${variant === 'default' ? 'bg-white/80 text-blue-600 group-hover:bg-[#1877F2] group-hover:text-white' : 'bg-white/80 text-slate-900 group-hover:scale-110'}`}>
          {icon}
        </div>
        {tooltipText && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help p-1 -m-1 outline-none opacity-40 hover:opacity-100 transition-opacity text-slate-400">
                  <Info className="w-4 h-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-slate-900/90 backdrop-blur-md text-white rounded-xl px-4 py-2 text-xs border-none shadow-2xl">
                <p className="max-w-xs font-medium">{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${variant === 'default' ? 'text-slate-400' : 'text-slate-500 opacity-70'}`}>{title}</p>
        <div className="flex items-baseline gap-3">
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
            {disabled ? "---" : formatter(value)}
          </h3>
          {trend && !disabled && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${trend.isPositive ? "bg-emerald-400/20 text-emerald-700 shadow-sm shadow-emerald-500/10" : "bg-red-400/20 text-red-700 shadow-sm shadow-red-500/10"}`}>
              {trend.isPositive ? "+" : "-"}{trend.value}%
            </div>
          )}
        </div>
        {subtitle && <p className="text-[11px] font-medium text-slate-400 mt-2 leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  );
};




export default FBStatCard;
