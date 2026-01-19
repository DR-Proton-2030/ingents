"use client";

import React, { useState, useRef, useEffect } from "react";
import { TaskStatus } from "@/types/interface/task.interface";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AltArrowDown,
  CheckCircle,
  PlayCircle,
  ClockCircle,
  MinusCircle,
  PointOnMap
} from "@solar-icons/react";

interface StatusDropdownProps {
  taskId: string;
  currentStatus: TaskStatus;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const statusConfig: Record<
  TaskStatus,
  { label: string; icon: any; color: string; bg: string; border: string; text: string }
> = {
  pending: {
    label: "In Progress",
    icon: PlayCircle,
    color: "text-purple-500",
    bg: "bg-purple-200",
    border: "border-purple-100",
    text: "text-purple-700",
  },
  "ready-to-check": {
    label: "Review",
    icon: PointOnMap,
    color: "text-blue-500",
    bg: "bg-blue-200",
    border: "border-blue-100",
    text: "text-blue-700",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-200",
    border: "border-green-100",
    text: "text-green-700",
  },
  backlog: {
    label: "Backlog",
    icon: ClockCircle,
    color: "text-gray-500",
    bg: "bg-gray-200",
    border: "border-gray-200",
    text: "text-gray-600",
  },
};

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  taskId,
  currentStatus,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = statusConfig[currentStatus] || statusConfig.backlog;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg  transition-all duration-300 active:scale-95 group",
          current.bg,
          // current.border,
          isOpen ? "ring-4 ring-orange-500/10 border-orange-200" : "hover:shadow"
        )}
      >
        {/* <current.icon className={cn("w-4 h-4 shrink-0 transition-transform duration-300", isOpen && "scale-110", current.color)} /> */}
        <span className={cn("text-xs font-bold whitespace-nowrap tracking-tight text-black/70")}>
          {current.label}
        </span>
        <AltArrowDown
          className={cn(
            "w-3.5 h-3.5 text-gray-400 transition-transform duration-300",
            isOpen ? "rotate-180 text-orange-500" : "group-hover:text-black"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-[100] top-full left-0 mt-2 w-62 p-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100"
          >
            <div className="flex flex-col gap-1">
              {(Object.keys(statusConfig) as TaskStatus[]).map((status) => {
                const config = statusConfig[status];
                const isSelected = currentStatus === status;

                return (
                  <button
                    key={status}
                    onClick={() => {
                      onStatusChange(taskId, status);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 w-full p-2.5 rounded-xl transition-all duration-200 group/item text-left",
                      isSelected
                        ? "bg-gray-50 border border-gray-100/50 shadow"
                        : "hover:bg-orange-50/50 hover:translate-x-1"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ",
                      isSelected ? config.bg : "bg-white"
                    )}>
                      <config.icon className={cn("w-4 h-4", isSelected ? config.color : "text-gray-400 group-hover/item:text-orange-500")} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-[11px] font-black uppercase  transition-colors",
                        isSelected ? config.text : "text-gray-400 group-hover/item:text-gray-600"
                      )}>
                        {config.label}
                      </p>
                      {isSelected && (
                        <p className="text-[9px] text-gray-400 font-bold ">Current Status</p>
                      )}
                    </div>

                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusDropdown;
