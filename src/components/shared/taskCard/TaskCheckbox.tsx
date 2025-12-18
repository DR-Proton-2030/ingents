"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface TaskCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const TaskCheckbox: React.FC<TaskCheckboxProps> = ({ checked, onChange }) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
        checked
          ? "bg-blue-500 border-blue-500"
          : "border-gray-300 hover:border-blue-400"
      )}
    >
      {checked && (
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </button>
  );
};

export default TaskCheckbox;
