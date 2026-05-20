"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  const [hoveredUser, setHoveredUser] = useState<{ id: string; name: string; rect: DOMRect } | null>(null);
  const [unassignTarget, setUnassignTarget] = useState<Assignee | null>(null);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const safeAssignees = assignees ?? [];

  useEffect(() => {
    setMounted(true);
  }, []);

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
        <div
          key={assignee._id}
          className="relative group transition-all hover:z-20 hover:-translate-y-1"
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setHoveredUser({ id: assignee._id, name: assignee.full_name, rect });
          }}
          onMouseLeave={() => setHoveredUser(null)}
        >
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black text-white border border-white shadow-sm shadow-gray-400 transition-all duration-300 overflow-hidden",
              !assignee.avatar && !(assignee as any).profile_picture && getAvatarColor(assignee._id)
            )}
          >
            {assignee.avatar || (assignee as any).profile_picture ? (
              <img
                src={assignee.avatar || (assignee as any).profile_picture}
                alt={assignee.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(assignee.full_name)
            )}
          </div>

          {/* Unassign button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setUnassignTarget(assignee);
            }}
            className="absolute -top-0.5 -right-1.5 w-4 h-4 rounded-full bg-white cursor-pointer text-red-400 hover:text-white hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md active:scale-90 z-[30]"
          >
            <TrashBinMinimalistic size={12} />
          </button>
        </div>
      ))}

      {/* Portalled Tooltip */}
      {mounted && createPortal(
        <AnimatePresence>
          {hoveredUser && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.9, x: "-50%" }}
              animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
              exit={{ opacity: 0, y: 5, scale: 0.9, x: "-50%" }}
              className="fixed z-[999999] px-3 py-2 bg-gray-900 text-white text-[10px] font-bold rounded-xl shadow-2xl pointer-events-none whitespace-nowrap"
              style={{
                top: hoveredUser.rect.top - 40,
                left: hoveredUser.rect.left + hoveredUser.rect.width / 2,
              }}
            >
              {hoveredUser.name}
              {/* Tooltip Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1.5 border-[6px] border-transparent border-t-gray-900" />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Unassign Confirmation Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {unassignTarget && (
            <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setUnassignTarget(null)}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-[360px] bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl border border-gray-100/80 overflow-hidden p-6 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-4 text-rose-600 transition-transform duration-300 hover:scale-105">
                  <TrashBinMinimalistic className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-2">Remove teammate?</h3>

                <p className="text-sm text-gray-500 font-normal leading-relaxed mb-6 px-1">
                  Are you sure you want to unassign <span className="font-semibold text-gray-800">"{unassignTarget.full_name}"</span> from this task?
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => setUnassignTarget(null)}
                    className="flex-1 h-11 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-700 font-medium text-sm rounded-full transition-all duration-200 flex items-center justify-center border border-gray-200/60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleUnAssignTask(taskId, unassignTarget._id);
                      setUnassignTarget(null);
                    }}
                    className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium text-sm rounded-full transition-all duration-200 flex items-center justify-center shadow-lg shadow-rose-600/10 active:scale-[0.98]"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

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
