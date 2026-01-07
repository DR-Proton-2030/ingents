import { cn } from "@/lib/utils";
import { PriorityBadgeProps } from "@/types/interface/props/TaskCard.props";

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config: Record<
    string,
    { icon: string; bg: string; text: string }
  > = {
    High: {
      icon: "🔴",
      bg: "bg-red-100",
      text: "text-red-700",
    },
    Normal: {
      icon: "🟢",
      bg: "bg-green-100",
      text: "text-green-700",
    },
    Low: {
      icon: "🟡",
      bg: "bg-yellow-100",
      text: "text-yellow-700",
    },
  };

  const current =
    config[priority] ?? {
      icon: "❓",
      bg: "bg-gray-100",
      text: "text-gray-600",
    };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
       
        current.text
      )}
    >
      <span>{current.icon}</span>
      {priority}
    </span>
  );
};
