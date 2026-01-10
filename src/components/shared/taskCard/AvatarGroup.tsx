"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Assignee } from "@/types/interface/task.interface";
import { X } from "lucide-react";
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

  /* 🔒 Always safe array */
  const safeAssignees = assignees ?? [];

  /* 🧠 Memoized visible & remaining */
  const { visible, remaining } = useMemo(() => {
    return {
      visible: safeAssignees.slice(0, max),
      remaining: Math.max(safeAssignees.length - max, 0),
    };
  }, [safeAssignees, max]);

  /* Assigned user ids */
  const assignedIds = useMemo(
    () => safeAssignees.map((a) => a._id),
    [safeAssignees]
  );

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        // no-op (SearchAndAssign handles itself)
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex items-center -space-x-1 relative" ref={ref}>
      {/* Avatars */}
      {visible.map((assignee) => (
        <div key={assignee._id} className="relative group">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white ring-2 ring-white transition-all duration-200",
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
              if (
                window.confirm(`Unassign ${assignee.full_name} from this task?`)
              ) {
                handleUnAssignTask(taskId, assignee._id);
              }
            }}
            className="absolute -top-2 -right-1 w-4 h-4 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
          >
            <X size={10} />
          </button>
        </div>
      ))}

      {/* Remaining count */}
      {remaining > 0 && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700 ring-2 ring-white">
          +{remaining}
        </div>
      )}

      {/* Assign new user */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className="ml-2"
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
