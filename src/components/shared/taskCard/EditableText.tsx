"use client";

import { useState } from "react";
import { Pen } from "@solar-icons/react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function EditableText({
  value,
  onSave,
  placeholder = "Edit",
  multiline = false,
  disabled = false,
  className,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);

  const save = () => {
    if (!text.trim() || text === value) {
      cancel();
      return;
    }
    onSave(text.trim());
    setIsEditing(false);
  };

  const cancel = () => {
    setText(value || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return multiline ? (
      <textarea
        autoFocus
        value={text}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => e.key === "Escape" && cancel()}
        className={cn(
          "w-full text-sm p-4 bg-gray-50 border border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all resize-none shadow-sm",
          className
        )}
      />
    ) : (
      <input
        autoFocus
        value={text}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") cancel();
        }}
        className={cn(
          "text-sm px-3 py-1.5 bg-gray-50 border border-orange-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm",
          className
        )}
      />
    );
  }

  return (
    <div
      className="flex items-center gap-2 group/edit cursor-pointer"
      onClick={() => !disabled && setIsEditing(true)}
    >
      <span className={cn("text-sm transition-colors group-hover/edit:text-orange-600", className)}>
        {value || <span className="text-gray-400 italic font-normal">{placeholder}</span>}
      </span>

      {!disabled && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="opacity-0 group-hover/edit:opacity-100 text-gray-400 hover:text-orange-500 transition-all duration-300"
        >
          <Pen size={12} />
        </button>
      )}
    </div>
  );
}
