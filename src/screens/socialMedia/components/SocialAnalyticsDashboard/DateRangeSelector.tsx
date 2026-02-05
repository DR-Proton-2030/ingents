"use client";
import React from "react";
import { BarChart3, Calendar, ChevronDown } from "lucide-react";

export interface DateRangeSelectorProps {
  dateRange: string;
  onDateRangeChange?: (range: string) => void;
  showChartIcon?: boolean;
  showCalendarIcon?: boolean;
}

export default function DateRangeSelector({
  dateRange,
  onDateRangeChange,
  showChartIcon = true,
  showCalendarIcon = true,
}: DateRangeSelectorProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {showChartIcon && (
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <BarChart3 className="w-5 h-5 text-slate-500" />
          </button>
        )}
        {showCalendarIcon && (
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Calendar className="w-5 h-5 text-slate-500" />
          </button>
        )}
      </div>
      <button
        onClick={() => onDateRangeChange?.("Last 25 Days")}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        {dateRange}
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}
