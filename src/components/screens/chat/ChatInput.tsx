import React, { useState } from "react";
import { Flower, Globe, LucideMic, LucideSend } from "lucide-react";

export const ChatInput: React.FC<{
  onSend: (text: string) => void;
  disabled?: boolean;
}> = ({ onSend, disabled }) => {
  const [value, setValue] = useState("");

  const submit = () => {
    const t = value.trim();
    if (!t) return;
    onSend(t);
    setValue("");
  };

  return (
    <div className="flex  items-center gap-3 bg-white/90 rounded-full ">
      <div className="flex-1">
        <div className="relative">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Ask me anything..."
            className="w-full rounded-full bg-white/6 placeholder-white/50 text-black px-16 py-4 focus:outline-none placeholder:text-black/70"
            disabled={disabled}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              title="voice"
              className="p-2 rounded-full bg-white/4 text-gray-800"
            >
              <Globe size={24} />
            </button>
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              onClick={submit}
              title="send"
              className="p-3 rounded-full bg-gray-800 text-white"
            >
              <LucideSend size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
