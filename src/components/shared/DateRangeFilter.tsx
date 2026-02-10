"use client";
import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type DateRangeOption = {
  label: string;
  value: string;
};

const DEFAULT_OPTIONS: DateRangeOption[] = [
  { label: "Last 7 Days", value: "LAST_7_DAYS" },
  { label: "Last 28 Days", value: "LAST_28_DAYS" },
  { label: "Last 90 Days", value: "LAST_90_DAYS" },
  { label: "Last 365 Days", value: "LAST_365_DAYS" },
  { label: "Lifetime", value: "LIFETIME" },
];

interface DateRangeFilterProps {
  value: string;
  onChange: (value: string) => void;
  options?: DateRangeOption[];
  className?: string;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[1];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-sm font-black text-slate-700 uppercase tracking-widest"
      >
        <Calendar className="w-4 h-4 text-blue-500" />
        <span>{selectedOption.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-64 bg-white rounded-[24px] shadow-2xl border border-slate-50 p-2 z-50 overflow-hidden"
          >
            <div className="py-2 px-4 mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Period</span>
            </div>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  value === option.value
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {option.label}
                {value === option.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateRangeFilter;
