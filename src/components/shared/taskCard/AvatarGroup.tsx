"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Assignee } from "@/types/interface/task.interface";

interface AvatarGroupProps {
  assignees: Assignee[];
  max?: number;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ assignees, max = 3 }) => {
  const visible = assignees.slice(0, max);
  const remaining = assignees.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((assignee) => (
        <div
          key={assignee.id}
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white ring-2 ring-white",
            assignee.color
          )}
          title={assignee.name}
        >
          {assignee.avatar ? (
            <img
              src={assignee.avatar}
              alt={assignee.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            assignee.initials
          )}
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
