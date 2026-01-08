"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option<T extends string> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

interface EditableSelectProps<T extends string> {
  value: T;
  options: Option<T>[];
  onSave: (value: T) => void;
  disabled?: boolean;
  className?: string;
}

export default function EditableSelect<T extends string>({
  value,
  options,
  onSave,
  disabled = false,
  className,
}: EditableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const current = options.find((o) => o.value === value);

  const handleSelect = (val: T) => {
    if (val !== value) {
      onSave(val);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border hover:bg-gray-50",
          className
        )}
      >
        {current?.icon}
        <span>{current?.label}</span>
        {!disabled && <ChevronDown size={12} />}
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-500 mt-1 min-w-[120px] rounded-md border bg-white shadow-md">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-100 text-left",
                opt.value === value && "bg-gray-50 font-medium"
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
