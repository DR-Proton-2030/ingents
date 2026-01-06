import { cn } from "@/lib/utils";
import { PriorityBadgeProps } from "@/types/interface/props/TaskCard.props";

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  // const config = {
  //   urgent: {
  //     bg: "bg-red-100",
  //     text: "text-red-700",
  //     icon: "🚩",
  //     label: "Urgent",
  //   },
  //   High: {
  //     bg: "bg-orange-50",
  //     text: "text-red-600",
  //     icon: "🚩",
  //     label: "High",
  //   },
  //   Normal: {
  //     bg: "bg-blue-50",
  //     text: "text-blue-600",
  //     icon: "🔵",
  //     label: "Normal",
  //   },
  //   Low: {
  //     bg: "bg-yellow-50",
  //     text: "text-yellow-600",
  //     icon: "⚠️",
  //     label: "Low",
  //   },
  // };

  // const { bg, text, icon, label } =
  //   config[priority] ?? {
  //     bg: "bg-gray-600",
  //     text: "text-gray-400",
  //     icon: "❓",
  //     label: "Unknown",
  //   };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
     
      )}
    >
      {/* <span>{icon}</span> */}
      {priority}
    </span>
  );
};
