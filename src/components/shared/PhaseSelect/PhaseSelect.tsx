"use client";

import React, { useState, useRef, useEffect } from "react";
import { Widget, AltArrowDown } from "@solar-icons/react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { PhaseSelectProps } from "@/types/interface/props/phaseSelect.props";

const PhaseSelect: React.FC<PhaseSelectProps> = ({
  phases,
  selectedPhaseId,
  onPhaseChange,
  label = "Task Phase",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sortedPhases = [...phases].sort((a, b) => (a.index || 0) - (b.index || 0));
  const currentPhase = sortedPhases.find((p) => p._id === selectedPhaseId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4" ref={dropdownRef}>
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg">
          <Widget className="w-5 h-5 text-amber-500" />
        </div>
        {label}
      </h3>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full h-14 px-5 rounded-2xl border-2 transition-all flex items-center gap-3 active:scale-[0.98] shadow-sm bg-white group",
            isOpen
              ? "border-amber-400 ring-4 ring-amber-500/5"
              : "border-gray-100 hover:border-gray-200"
          )}
        >
          <div
            className="w-3 h-3 rounded-full shrink-0 shadow-sm animate-pulse"
            style={{ backgroundColor: currentPhase?.color || "#8350e8" }}
          />
          <div className="flex flex-col items-start leading-tight text-left overflow-hidden">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">
              Active Phase
            </span>
            <span className="text-sm font-bold text-gray-800 truncate w-full">
              {currentPhase?.name || "Select Phase"}
            </span>
          </div>
          <div className="ml-auto">
            <AltArrowDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform duration-300",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 origin-top">
            <div className="max-h-[240px] overflow-y-auto scrollbar-hide space-y-1">
              {sortedPhases.map((phase) => {
                const isActive = selectedPhaseId === phase._id;
                return (
                  <button
                    key={phase._id}
                    type="button"
                    onClick={() => {
                      onPhaseChange(phase._id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all relative group",
                      isActive ? "bg-amber-50" : "hover:bg-gray-50"
                    )}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: phase.color || "#8350e8" }}
                    />
                    <span
                      className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        isActive ? "text-amber-700" : "text-gray-500 group-hover:text-gray-700"
                      )}
                    >
                      {phase.name}
                    </span>
                    {isActive && (
                      <div className="ml-auto">
                        <Check className="w-4 h-4 text-amber-500" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseSelect;
