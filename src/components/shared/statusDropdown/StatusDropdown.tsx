"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AltArrowDown,
  CheckCircle,
  PlayCircle,
  ClockCircle,
  PointOnMap
} from "@solar-icons/react";
import { Plus, Pen } from "lucide-react";
import { api } from "@/utils/api";
import CreateNewPhase from "../createNewPhase/createNewPhase";
import { StatusDropdownProps } from "@/types/interface/props/statusDropDown.props";
import { IPhase } from "@/types/interface/phase.interface";

// Helper to get matching Solar icon based on phase name
const getPhaseIcon = (name: string) => {
  const n = (name || "").toLowerCase();
  if (n.includes("progress")) return PlayCircle;
  if (n.includes("review") || n.includes("check")) return PointOnMap;
  if (n.includes("complete") || n.includes("done")) return CheckCircle;
  if (n.includes("not started") || n.includes("start") || n.includes("backlog")) return ClockCircle;
  return ClockCircle;
};

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  taskId,
  currentStatus,
  phaseInfo,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [phases, setPhases] = useState<IPhase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // OPTIMISTIC UPDATE STATE
  const [localStatusId, setLocalStatusId] = useState(currentStatus);

  // Sync with prop when it changes
  useEffect(() => {
    setLocalStatusId(currentStatus);
  }, [currentStatus]);

  const fetchPhases = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.taskPhase.getTaskPhases();
      if (response?.data) {
        setPhases(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch task phases:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhases();
  }, [fetchPhases]);

  const handleUpdatePhase = async (phaseId: string) => {
    if (isUpdating) return;
    if (!editValue.trim()) {
      setEditingPhaseId(null);
      return;
    }
    try {
      setIsUpdating(true);
      await api.taskPhase.updateTaskPhase(phaseId, { name: editValue });
      api.taskPhase.clearTaskPhasesCache();
      await fetchPhases();
      setEditingPhaseId(null);
    } catch (error) {
      console.error("Failed to update phase:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const updatePosition = () => {
        const rect = triggerRef.current?.getBoundingClientRect();
        if (rect) {
          setMenuPosition({
            top: rect.bottom + 8,
            left: rect.left,
            width: rect.width
          });
        }
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [isOpen]);

  const activePhase = phases.find(p =>
    p._id === localStatusId ||
    p.name === localStatusId ||
    p.name.toLowerCase().replace(/ /g, "-") === (localStatusId || "").toLowerCase().replace(/ /g, "-")
  );

  const currentLabel = activePhase ? activePhase.name : (phaseInfo?.name || localStatusId);
  const currentColor = activePhase?.color || phaseInfo?.color || "#9a49e1ff";
  const CurrentIcon = getPhaseIcon(currentLabel);

  const getAlphaBgColor = (hex: string, alpha: string = "10") => {
    const cleanHex = hex.replace("#", "").substring(0, 8);
    return `#${cleanHex}${alpha}`;
  };

  const menuContent = (
    <div className="fixed inset-0 z-[99999]" onClick={() => setIsOpen(false)}>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.95 }}
        transition={{ type: "spring", damping: 18, stiffness: 220 }}
        className="fixed w-64 p-2.5 bg-white/80 backdrop-blur-xl rounded-2xl flex flex-col gap-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.05)] border border-white/60"
        style={{
          top: menuPosition.top,
          left: Math.min(menuPosition.left, typeof window !== 'undefined' ? window.innerWidth - 270 : menuPosition.left)
        }}
        onClick={(e) => e.stopPropagation()}
      >


        <div className="px-2.5 py-1.5 border-b border-gray-100/50 mb-1 flex items-center justify-between">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Status</p>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentColor }} />
        </div>

        <div className="max-h-60 overflow-y-auto flex flex-col gap-1 pr-1 custom-scrollbar">
          {isLoading ? (
            <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-100 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-[10px] text-gray-400 font-semibold tracking-wide">Fetching phases...</p>
            </div>
          ) : phases.length > 0 ? (
            [...phases].sort((a, b) => a.index - b.index).map((phase) => {
              const Icon = getPhaseIcon(phase.name);
              const isSelected = (
                localStatusId === phase.name ||
                localStatusId === phase._id ||
                (localStatusId || "").toLowerCase().replace(/ /g, "-") === phase.name.toLowerCase().replace(/ /g, "-")
              );

              const isEditing = editingPhaseId === phase._id;
              const itemColor = phase.color || currentColor;

              return (
                <div key={phase._id} className="relative group/parent flex items-center w-full">
                  <button
                    onClick={() => {
                      if (!isEditing) {
                        setLocalStatusId(phase._id);
                        onStatusChange(taskId, phase._id);
                        setIsOpen(false);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 w-full px-2.5 py-2 rounded-xl transition-all duration-200 text-left relative cursor-pointer group",
                      isSelected
                        ? "font-semibold "
                        : "hover:bg-gray-100 "
                    )}
                    style={{
                      backgroundColor: isSelected ? getAlphaBgColor(itemColor, "08") : undefined,
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 shrink-0"
                      style={{
                        backgroundColor: getAlphaBgColor(itemColor, isSelected ? "15" : "08"),
                      }}
                    >
                      <Icon
                        className="w-4 h-4 shrink-0 transition-transform duration-300"
                        style={{ color: itemColor }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdatePhase(phase._id);
                            if (e.key === "Escape") setEditingPhaseId(null);
                          }}
                          onBlur={() => handleUpdatePhase(phase._id)}
                          className="w-full bg-white border border-gray-200/80 rounded-lg px-2 py-1 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span
                          className="text-xs truncate block tracking-wide font-medium"
                          style={{ color: isSelected ? "#111827" : "#4b5563" }}
                        >
                          {phase.name}
                        </span>
                      )}
                    </div>

                    {isSelected && !isEditing && (
                      <motion.span
                        layoutId={`active-dot-${taskId}`}
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: itemColor }}
                      />
                    )}
                  </button>

                  {!phase.is_default && !isEditing && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPhaseId(phase._id);
                        setEditValue(phase.name);
                      }}
                      className="absolute right-2.5 opacity-0 group-hover/parent:opacity-100 p-1.5 bg-white/95 hover:bg-gray-100 rounded-lg border border-gray-100 shadow-sm transition-all duration-200 z-10 cursor-pointer"
                    >
                      <Pen className="w-2.5 h-2.5 text-gray-400 hover:text-gray-700" />
                    </button>
                  )}

                  {isUpdating && isEditing && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-20">
                      <div className="w-3.5 h-3.5 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center">
              <p className="text-xs text-gray-400 font-medium">No phases found</p>
            </div>
          )}
        </div>

        <div className="mt-1 pt-1.5 border-t border-gray-100/50">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setIsOpen(false);
            }}
            className="px-3 py-1.5 rounded-lg text-xs flex  transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-gray-400  transition-colors" />
            <span>Add Custom Phase</span>
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.25);
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.4);
        }
      `}} />

      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 w-max cursor-pointer select-none ",
          isOpen
            ? "scale-[1.02] "
            : "hover:scale-[1.02] active:scale-[0.98] "
        )}
        style={{
          backgroundColor: getAlphaBgColor(currentColor, "15"),
          color: activePhase?.color || currentColor,
        }}
      >
        <span>{currentLabel}</span>
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && menuContent}
        </AnimatePresence>,
        document.body
      )}

      <CreateNewPhase
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={async (newPhaseId) => {
          await fetchPhases();
          if (newPhaseId && taskId) {
            setLocalStatusId(newPhaseId);
            onStatusChange(taskId, newPhaseId);
          }
        }}
        task_object_id={taskId}
      />
    </>
  );
};

export default StatusDropdown;
