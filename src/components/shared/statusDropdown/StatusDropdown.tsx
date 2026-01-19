"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { TaskStatus } from "@/types/interface/task.interface";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AltArrowDown,
  CheckCircle,
  PlayCircle,
  ClockCircle,
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
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuPostion, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });

  const current = statusConfig[currentStatus] || statusConfig.backlog;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      // Calculate position. We'll use fixed positioning for the portal.
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width
      });

      const handleResize = () => {
        const newRect = triggerRef.current?.getBoundingClientRect();
        if (newRect) {
          setMenuPosition({
            top: newRect.bottom + 8,
            left: newRect.left,
            width: newRect.width
          });
        }
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, true);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize, true);
      };
    }
  }, [isOpen]);

  const menuContent = (
    <div className="fixed inset-0 z-[99999]" onClick={() => setIsOpen(false)}>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed w-62 p-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100/50 flex flex-col gap-1 overflow-hidden"
        style={{
          top: menuPostion.top,
          left: Math.min(menuPostion.left, typeof window !== 'undefined' ? window.innerWidth - 260 : menuPostion.left)
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
                  ? "bg-gray-50 border border-gray-100/50 shadow-sm"
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
                  "text-[11px] font-black uppercase transition-colors tracking-tight",
                  isSelected ? config.text : "text-gray-400 group-hover/item:text-gray-600"
                )}>
                  {config.label}
                </p>
                {isSelected && (
                  <p className="text-[9px] text-gray-400 font-bold">Current Status</p>
                )}
              </div>

              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
              )}
            </button>
          );
        })}
      </motion.div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 active:scale-95 group",
          current.bg,
          isOpen ? "ring-4 ring-orange-500/10 border-orange-200" : "hover:shadow-sm"
        )}
      >
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

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && menuContent}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default StatusDropdown;
