"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Assignee } from "@/types/interface/task.interface";
import { X } from "lucide-react";

interface AvatarGroupProps {
  assignees: Assignee[];
  taskId: string;
  max?: number;
  handleUnAssignTask: (taskId: string, userId: string) => void;
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-teal-500",
];

const getAvatarColor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  assignees,
  taskId,
  max = 3,
  handleUnAssignTask,
}) => {
  const visible = assignees.slice(0, max);
  const remaining = assignees.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((assignee) => (
        <div
          key={assignee._id}
          className="relative group"
          title={assignee.full_name}
        >
          {/* Avatar */}
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white ring-2 ring-white",
              assignee.avatar
                ? "bg-gray-200"
                : getAvatarColor(assignee._id || assignee.full_name)
            )}
          >
            {assignee.avatar ? (
              <img
                src={assignee.avatar}
                alt={assignee.full_name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              assignee.initials
            )}
          </div>

          {/* ❌ Unassign Button */}
          
            <button
              onClick={(e) => {
                e.stopPropagation();

                const confirmed = window.confirm(
                  `Unassign ${assignee.full_name} from this task?`
                );
                if (!confirmed) return;

                handleUnAssignTask(taskId, assignee._id);
              }}
              className="
                absolute -top-1 -right-1
                w-4 h-4 rounded-full
                bg-gray-200 text-gray-800
                flex items-center justify-center
                opacity-0 group-hover:opacity-100
                transition-opacity
                shadow
              "
            >
              <X size={10} />
            </button>
          
        </div>
      ))}

      {remaining > 0 && (
        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
