import { cn } from "@/lib/utils";
import { ProgressBarProps } from "@/types/interface/props/ProgressBar.props";

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            progress === 100
              ? "bg-green-500"
              : progress >= 75
              ? "bg-blue-500"
              : progress >= 50
              ? "bg-yellow-500"
              : "bg-gray-400"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-8">{progress}%</span>
    </div>
  );
};