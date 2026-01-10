"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
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
    setText(value);
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
          "w-full text-sm p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500",
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
          "text-sm px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500",
          className
        )}
      />
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <span className={cn("text-sm", className)}>
        {value || <span className="text-gray-400">{placeholder}</span>}
      </span>

      {!disabled && (
       <button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation(); // ✅ THIS FIXES 404
    setIsEditing(true);
  }}
  className="text-gray-500 hover:text-orange-600 transition"
>
  <Pencil size={14} />
</button>

      )}
    </div>
  );
}
