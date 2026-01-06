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
  <div className="flex items-center space-x-2" key={assignee._id}>
    <div
      className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white ring-2 ring-white",
        assignee.color || "bg-blue-500"
      )}
      title={assignee.full_name}
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
    <p className="text-sm font-medium text-gray-800">{assignee.full_name}</p>
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
