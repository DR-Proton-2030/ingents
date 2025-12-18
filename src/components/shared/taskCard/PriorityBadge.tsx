import { cn } from "@/lib/utils";
import { PriorityBadgeProps } from "@/types/interface/props/TaskCard.props";

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = {
    urgent: {
      bg: "bg-red-50",
      text: "text-red-600",
      icon: "🚩",
      label: "Urgent",
    },
    normal: {
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      icon: "🚩",
      label: "Normal",
    },
    low: {
      bg: "bg-gray-50",
      text: "text-gray-500",
      icon: "🚩",
      label: "Low",
    },
  };

  const { bg, text, icon, label } = config[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
        bg,
        text
      )}
    >
      <span>{icon}</span>
      {label}
    </span>
  );
};