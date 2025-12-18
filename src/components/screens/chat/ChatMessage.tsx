import { CopyIcon } from "lucide-react";
import React, { useState } from "react";

export type Role = "user" | "assistant" | "system";

export const ChatMessage: React.FC<{
  role?: Role;
  children: React.ReactNode;
}> = ({ role = "assistant", children }) => {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      const text = typeof children === "string" ? children : String(children);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div
      className={`flex items-start gap-4 ${
        isUser ? "justify-start" : "justify-start"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
          isUser ? "bg-white/6 text-black" : "bg-gray-600 to-blue-500"
        }`}
      >
        {isUser ? "U" : "AI"}
      </div>

      <div className={`max-w-[75%] ${isUser ? "text-left" : "text-left"}`}>
        <div className="relative">
          <div
            className={`inline-block font-semibold py-2 rounded-2xl whitespace-pre-wrap break-words ${
              isUser ? " text-white" : "text-white/50"
            }`}
          >
            {children}
          </div>

          {!isUser && (
            <div className="absolute -right-30 top-0">
              <button
                onClick={onCopy}
                title="Copy"
                className="p-1 flex  gap-2 items-center rounded-md hover:bg-white/6 ml-10 text-white/60 "
              >
                {/* simple copy icon */}
                <CopyIcon size={14} />

                {copied ? "Copied" : "Copy Text"}
              </button>
            </div>
          )}
        </div>
        {/* {time && <  div className="text-xs text-white/40 mt-1">{time}</div>} */}
      </div>

      {/* Removed user avatar on the right */}
    </div>
  );
};

export default ChatMessage;
