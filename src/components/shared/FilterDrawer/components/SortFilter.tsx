"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Filter as FilterIcon } from "@solar-icons/react";
import { Clock, History } from "lucide-react";

interface SortFilterProps {
  sortBy: "asc" | "desc" | null | undefined;
  onSortToggle: (value: "asc" | "desc") => void;
}

const SortFilter: React.FC<SortFilterProps> = ({ sortBy, onSortToggle }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <div className="p-2 bg-orange-50 border border-orange-100 rounded-lg">
          <FilterIcon className="w-5 h-5 text-orange-500" />
        </div>
        Sort Tasks
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSortToggle("desc")}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300",
            sortBy === "desc"
              ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm"
              : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
          )}
        >
          <div
            className={cn(
              "p-2 rounded-lg transition-colors",
              sortBy === "desc" ? "bg-orange-100" : "bg-gray-100"
            )}
          >
            <Clock
              className={cn(
                "w-5 h-5",
                sortBy === "desc" ? "text-orange-600" : "text-gray-400"
              )}
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Newest First
          </span>
        </button>
        <button
          type="button"
          onClick={() => onSortToggle("asc")}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300",
            sortBy === "asc"
              ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm"
              : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
          )}
        >
          <div
            className={cn(
              "p-2 rounded-lg transition-colors",
              sortBy === "asc" ? "bg-orange-100" : "bg-gray-100"
            )}
          >
            <History
              className={cn(
                "w-5 h-5",
                sortBy === "asc" ? "text-orange-600" : "text-gray-400"
              )}
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Oldest First
          </span>
        </button>
      </div>
    </div>
  );
};

export default SortFilter;
