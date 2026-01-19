"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Assignee } from "@/types/interface/task.interface";
import { CloseCircle, AddCircle, TrashBin2, TrashBinMinimalistic } from "@solar-icons/react";
import SearchAndAssign from "../searchAndAssign/SearchAndAssign";

interface UserOption {
  _id: string;
  full_name: string;
  email: string;
}

interface AvatarGroupProps {
  assignees?: Assignee[];
  taskId: string;
  max?: number;
  handleUnAssignTask: (taskId: string, userId: string) => void;
  handleAssignTask: (taskId: string, userId: string) => void;
  searchUsers: (query: string) => Promise<UserOption[]>;
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-orange-500",
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

export const getInitials = (name: string = "") => {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  assignees = [],
  taskId,
  max = 3,
  handleUnAssignTask,
  handleAssignTask,
  searchUsers,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const safeAssignees = assignees ?? [];

  const { visible, remaining } = useMemo(() => {
    return {
      visible: safeAssignees.slice(0, max),
      remaining: Math.max(safeAssignees.length - max, 0),
    };
  }, [safeAssignees, max]);

  const assignedIds = useMemo(
    () => safeAssignees.map((a) => a._id),
    [safeAssignees]
  );

  return (
    <div className="flex items-center -space-x-1.5 relative group/avatars" ref={ref}>
      {/* Avatars */}
      {visible.map((assignee) => (
        <div key={assignee._id} className="relative group transition-all hover:z-10 hover:-translate-y-0.5">
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black text-white border border-white shadow-sm transition-all duration-300",
              getAvatarColor(assignee._id)
            )}
            title={assignee.full_name}
          >
            {getInitials(assignee.full_name)}
          </div>

          {/* Unassign button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Unassign ${assignee.full_name}?`)) {
                handleUnAssignTask(taskId, assignee._id);
              }
            }}
            className="absolute -top-0.5 -right-1.5 w-4 h-4 rounded-full bg-white cursor-pointer text-red-400 hover:text-white hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md active:scale-90"
          >
            <TrashBinMinimalistic size={12} />
          </button>
        </div>
      ))}

      {/* Remaining count */}
      {remaining > 0 && (
        <div className="w-7 h-7 rounded-sm bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-600 border border-white shadow-sm">
          +{remaining}
        </div>
      )}

      {/* Assign new user */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className="pl-2 opacity-0 group-hover/avatars:opacity-100 transition-opacity"
      >
        <SearchAndAssign
          searchApi={searchUsers}
          onSelect={(user) => {
            if (!assignedIds.includes(user._id)) {
              handleAssignTask(taskId, user._id);
            }
          }}
        />
      </div>
    </div>
  );
};

export default AvatarGroup;
