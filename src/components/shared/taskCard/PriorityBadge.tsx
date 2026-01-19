import React from "react";
import { cn } from "@/lib/utils";
import { PriorityBadgeProps } from "@/types/interface/props/TaskCard.props";
import { Flag } from "@solar-icons/react";

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config: Record<
    string,
    { color: string; bg: string; text: string }
  > = {
    High: {
      color: "text-red-500",
      bg: "bg-red-200",
      text: "text-red-700",
    },
    Normal: {
      color: "text-blue-500",
      bg: "bg-blue-200",
      text: "text-blue-700",
    },
    Low: {
      color: "text-gray-400",
      bg: "bg-gray-200",
      text: "text-gray-600",
    },
  };

  const current = config[priority] || config.Low;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold   transition-all text-black/70",
        current.bg,

        "border border-white/50 shado"
      )}
    >
      {/* <Flag className={cn("w-3.5 h-3.5", current.color)} /> */}
      {priority}
    </span>
  );
};
