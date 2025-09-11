"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  LinkIcon,
  Maximize,
  MessageCircle,
  Navigation,
  Send,
} from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function AiSidebar() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Based on recent data, the spike in traffic is primarily from increased referrals from Social Media (45%) and Organic Search (35%). Bounce rate on the homepage has dropped by 10% compared to last week.\n\nExample File\nDownloads\n500 KB",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages come in
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { role: "user", content: text };
    setMessages((s) => [...s, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      const reply = (data && data.reply) || "(no reply)";
      setMessages((s) => [...s, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("AI request failed:", err);
      setMessages((s) => [
        ...s,
        { role: "assistant", content: "⚠️ Error: failed to reach API" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const headerAction = useMemo(
    () => (
      <button
        className="ml-auto p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Fullscreen"
      >
        <Maximize size={18} className="text-gray-600" />
      </button>
    ),
    []
  );

  return (
    <aside className="max-w-full h-[80vh] bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl p-4 flex flex-col gap-4 shado">
      {/* Header */}
      <div className="flex items-start gap-1">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="h-12 w-12 "
        >
          <img
            src="https://chatgpt.com/backend-api/estuary/content?id=file-IrBNu77AV10e4xnLWISJNrh3&gizmo_id=g-iYSeH3EAI&ts=488180&p=gpp&cid=1&sig=517d39aa5d52cfd8ea55ccb3c9a5ad43ed879f13e095e4365cf4214dcd4be2f6&v=0"
            alt=""
            className="h-10 w-10 rounded-full"
          />
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-sm font-semibold">Seomi AI</div>
              <div className="text-xs text-gray-500">Social quick help</div>
            </div>
            {headerAction}
          </div>
        </div>
      </div>

      {/* Chat window */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto hidescroll rounded-2xl  p-3 bg-gradient-to-br from-gray-50 via-white to-gray-100 shadow-inner"
      >
        <div className="flex flex-col gap-4">
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const hasFile = /Example File|Downloads/i.test(m.content);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.02 }}
                className={`max-w-[85%] ${isUser ? "self-end" : "self-start"}`}
              >
                <div
                  className={`rounded-2xl px-4  py-2 ${
                    isUser
                      ? "bg-gradient from:gray-100 to:white border border-gray-200 text-sky-900"
                      : "bg-white text-gray-900 border border-gray-100"
                  }`}
                >
                  {hasFile ? (
                    <div className="flex flex-col gap-3">
                      <div className="text-sm leading-6 whitespace-pre-wrap">
                        {m.content.split("\n").slice(0, 2).join("\n")}
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-gray-200  flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="text-sm text-sky-600 font-medium"
                        >
                          Download
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-sm">
                      {m.content}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-sm text-gray-500"
            >
              <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                🤖
              </div>
              <div>
                <div className="animate-pulse">
                  Analyzing data, please wait...
                </div>
                <div className="text-xs text-gray-400">
                  Creating in-depth analysis · Identifying tasks
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Input */}
      <div className="pt-2">
        <div className="flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder={
              loading ? "Analyzing..." : "Ask, write or search for anything..."
            }
            className="flex-1  rounded-full border border-gray-300 px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            aria-label="Ask Seomi AI"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={send}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full p-3  bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md disabled:opacity-50"
          >
            <Send size={16} />
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
