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
import { Plus } from "lucide-react";
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
    p._id === currentStatus ||
    p.name === currentStatus ||
    p.name.toLowerCase().replace(/ /g, "-") === (currentStatus || "").toLowerCase().replace(/ /g, "-")
  );

  const currentLabel = activePhase ? activePhase.name : (phaseInfo?.name || currentStatus);
  const currentColor = activePhase?.color || phaseInfo?.color || "#9a49e1ff";
  const CurrentIcon = getPhaseIcon(currentLabel);

  const menuContent = (
    <div className="fixed inset-0 z-[99999]" onClick={() => setIsOpen(false)}>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed w-64 p-2 bg-white/95 backdrop-blur-xl rounded-xl flex flex-col gap-1 overflow-hidden border-2 border-gray-100/50"
        style={{
          top: menuPosition.top,
          left: Math.min(menuPosition.left, typeof window !== 'undefined' ? window.innerWidth - 270 : menuPosition.left)
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-2 py-1 mb-1 ">
          <p className="text-[10px] font-bold text-gray-600 uppercase ">Select Status</p>
        </div>

        <div className="max-h-64 overflow-y-auto border-2 border-gray-100/50 rounded-xl flex flex-col gap-1 pr-1 custom-scrollbar">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Fetching Phases...</p>
            </div>
          ) : phases.length > 0 ? (
            [...phases].sort((a, b) => a.index - b.index).map((phase) => {
              const Icon = getPhaseIcon(phase.name);
              const isSelected = (
                currentStatus === phase.name ||
                currentStatus === phase._id ||
                (currentStatus || "").toLowerCase().replace(/ /g, "-") === phase.name.toLowerCase().replace(/ /g, "-")
              );

              return (
                <button
                  key={phase._id}
                  onClick={() => {
                    onStatusChange(taskId, phase._id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 w-full p-2.5 rounded- transition-all duration-200 group/item text-left",
                    isSelected
                      ? "bg-gray-100 border border-gray-100/50 "
                      : "hover:bg-gray-50/50 hover:translate-x-1"
                  )}
                >


                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black  transition-colors "
                      style={{ color: isSelected ? (phase.color || '#25272aff') : '#9ca3af' }}>
                      {phase.name}
                    </p>
                    {isSelected && (
                      <p className="text-[9px] text-gray-400 font-bold">Current Status</p>
                    )}
                  </div>



                </button>
              );
            })
          ) : (
            <div className="p-4 text-center">
              <p className="text-xs text-gray-400 font-bold">No phases found</p>
            </div>
          )}
        </div>

        <div className="mt-1 pt-1 border-t border-gray-100/50">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setIsOpen(false);
            }}
            className="flex items-center gap-3 w-full p-2.5 rounded-xl transition-all duration-200 hover:bg-orange-50/50 group/add"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Plus className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-[11px] font-black uppercase text-orange-600 tracking-tight">Create New Phase</p>
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 active:scale-95 group ",
          isOpen ? "ring-4 ring-gray-100" : "hover:shadow-m"
        )}
        style={{
          backgroundColor: currentColor + '50', // Subtle background color
          borderColor: currentColor + '30'      // Subtle border color
        }}
      >

        <span className="text-xs font-semibold text-black/80"
        >
          {currentLabel}
        </span>
        <AltArrowDown
          className={cn(
            "w-3.5 h-3.5 transition-transform duration-300",
            isOpen ? "rotate-180" : ""
          )}
          style={{ color: currentColor + '80' }}
        />
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
            onStatusChange(taskId, newPhaseId);
          }
        }}
        task_object_id={taskId}
      />
    </>
  );
};

export default StatusDropdown;
