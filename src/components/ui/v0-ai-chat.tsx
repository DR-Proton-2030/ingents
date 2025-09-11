"use client";

import { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUpIcon } from "lucide-react";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      // Temporarily shrink to get the right scrollHeight
      textarea.style.height = `${minHeight}px`;

      // Calculate new height
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    // Set initial height
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  // Adjust height on window resize
  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

export interface VercelV0ChatProps {
  onSend?: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function VercelV0Chat({
  onSend,
  disabled,
  placeholder,
}: VercelV0ChatProps) {
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSend?.(value.trim());
        setValue("");
        adjustHeight(true);
      }
    }
  };

  return (
    <div className="w-full">
      <div className=" bg-neutral-900 rounded-xl border border-neutral-800">
        <div className="overflow-y-auto">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? "Ask v0 a question..."}
            className={cn(
              "w-full px-4 py-3",
              "resize-none",
              "bg-transparent",
              "border-none",
              "text-white text-sm",
              "focus:outline-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-neutral-500 placeholder:text-sm",
              ""
            )}
            style={{ overflow: "hidden" }}
          />
        </div>

        <div className="flex items-center justify-end p-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!value.trim()) return;
                onSend?.(value.trim());
                setValue("");
                adjustHeight(true);
              }}
              className="px-3 py-1 rounded-lg text-sm text-gray-800  bg-white
                transition-colors border  border-zinc-700 hover:border-zinc-600
                 hover:bg-zinc-800 flex items-center justify-between gap-2"
              disabled={disabled || !value.trim()}
            >
              <ArrowUpIcon
                className={cn(
                  "w-4 h-4",
                  value.trim() ? "text-black" : "text-black rotate-45"
                )}
              />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Action buttons removed from this input-only component. Use the screen-level UI for extra actions.
