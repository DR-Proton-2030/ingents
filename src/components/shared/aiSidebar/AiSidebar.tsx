/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  LinkIcon,
  Maximize,
  MessageCircle,
  Navigation,
  Send,
  Wheat,
} from "lucide-react";
import ChatModal from "./ChatModal";

type Msg = { role: "user" | "assistant"; content: string; imageUrl?: string; videoUrl?: string };

export default function AiSidebar({ aiUrl = "social", context }: any) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [sessionId, setSessionId] = useState<string>(""); // Track session ID
  const [clearing, setClearing] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages come in
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Restore sessionId and messages from localStorage if available
  useEffect(() => {
    try {
      const keyId = `ai_session_${aiUrl}_id`;
      const keyMsgs = `ai_session_${aiUrl}_messages`;
      const storedId = localStorage.getItem(keyId);
      const storedMsgs = localStorage.getItem(keyMsgs);
      if (storedId) setSessionId(storedId);
      if (storedMsgs) {
        const parsed = JSON.parse(storedMsgs) as Msg[];
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch (e) {
      // ignore localStorage errors
      console.warn("Failed to restore AI session from localStorage", e);
    }
  }, [aiUrl]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { role: "user", content: text };
    setMessages((s) => [...s, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Ensure context is a serialized string so backend receives full details
      const serializedContext =
        context && typeof context === "object" ? JSON.stringify(context) : context;
      // Ask for a streaming response so we can show progressive assistant typing
      const res = await fetch(`/api/${aiUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-ai-stream": "1" },
        body: JSON.stringify({
          context: serializedContext,
          messages: [...messages, userMsg], // Send full conversation history
          sessionId: sessionId || undefined, // Include session ID if exists
        }),
      });

      // If server responded with a streaming body, consume it progressively
      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let partial = "";

        // create a placeholder assistant message and persist it
        const placeholder: Msg = { role: "assistant", content: "" };
        setMessages((s) => {
          const next = [...s, placeholder];
          try { localStorage.setItem(`ai_session_${aiUrl}_messages`, JSON.stringify(next)); } catch (e) {}
          return next;
        });

        // read chunks
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          partial += chunk;

          // update the last assistant message with current partial text
          setMessages((s) => {
            const copy = s.slice();
            const last = copy[copy.length - 1];
            if (last && last.role === "assistant") {
              last.content = partial;
            }
            try { localStorage.setItem(`ai_session_${aiUrl}_messages`, JSON.stringify(copy)); } catch (e) {}
            return copy;
          });
        }

        // After stream completes, attempt to get sessionId/image/video fields from trailing JSON (if server sends JSON)
        // Some servers may not append JSON; we'll do a best-effort fetch of headers/body fallback
        let newSessionId: string | undefined;
        try {
          const text = partial.trim();
          // If server appended a JSON blob after a delimiter, try to parse it
          const jsonMatch = text.match(/\{\s*"sessionId"[\s\S]*\}$/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            newSessionId = parsed.sessionId;
            const imageUrl = parsed.imageUrl;
            const videoUrl = parsed.videoUrl;
            // attach media if present to the last message
            setMessages((s) => {
              const copy = s.slice();
              const last = copy[copy.length - 1];
              if (last && last.role === "assistant") {
                if (imageUrl) last.imageUrl = imageUrl;
                if (videoUrl) last.videoUrl = videoUrl;
              }
              try { localStorage.setItem(`ai_session_${aiUrl}_messages`, JSON.stringify(copy)); } catch (e) {}
              return copy;
            });
          }
        } catch (e) {
          // ignore JSON parse errors
        }

        if (newSessionId && newSessionId !== sessionId) {
          setSessionId(newSessionId);
          try { localStorage.setItem(`ai_session_${aiUrl}_id`, newSessionId); } catch (e) {}
        }

      } else {
        // fallback: non-streaming JSON response
        const data = await res.json();
        const reply = (data && data.reply) || "(no reply)";
        const imageUrl = data && data.imageUrl;
        const videoUrl = data && data.videoUrl;
        const newSessionId = data && data.sessionId;

        // Update session ID if received from server
        if (newSessionId && newSessionId !== sessionId) {
          setSessionId(newSessionId);
          try {
            localStorage.setItem(`ai_session_${aiUrl}_id`, newSessionId);
          } catch (e) {
            /* ignore */
          }
        }
        const assistantMsg: Msg = { role: "assistant", content: reply, imageUrl, videoUrl };
        setMessages((s) => {
          const next = [...s, assistantMsg];
          try {
            localStorage.setItem(`ai_session_${aiUrl}_messages`, JSON.stringify(next));
          } catch (e) {
            /* ignore */
          }
          return next;
        });
      }
      
      // Response handled (streamed or non-streaming) above; nothing more to do here.
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
        onClick={() => setIsModalOpen(true)}
        className="ml-auto p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Fullscreen"
      >
        <Maximize size={18} className="text-gray-600" />
      </button>
    ),
    []
  );

  return (
    <>
      {/* Sidebar Version */}
      <aside className="max-w-full h-[80vh] bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl p-4 flex flex-col gap-4 shadow">
        {/* Header */}
        <div className="flex items-start gap-1">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="h-12 w-12"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdBjDZmgcjezH0XD9snFi0tWGxgCzwB5Zpzg&s"
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
                <div className="ml-2 text-xs text-gray-500 flex items-center gap-2">
                  {sessionId ? (
                    <>
                      <span className="font-mono text-[12px] px-2 py-1 bg-gray-100 rounded">{sessionId.slice(0,8)}</span>
                      <button
                        onClick={() => {
                          try { navigator.clipboard.writeText(sessionId); } catch (e) {}
                        }}
                        className="text-xs text-sky-600 hover:underline"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => {
                          setClearing(true);
                          try {
                            localStorage.removeItem(`ai_session_${aiUrl}_id`);
                            localStorage.removeItem(`ai_session_${aiUrl}_messages`);
                          } catch (e) {}
                          setMessages([]);
                          setSessionId("");
                          setClearing(false);
                        }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Clear
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">no session</span>
                  )}
                </div>
                {headerAction}
              </div>
            </div>
        </div>

        {/* Chat window */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-auto hidescroll rounded-2xl p-3 bg-gradient-to-br from-gray-50 via-white to-gray-100 shadow-inner"
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
                  className={`max-w-[85%] ${
                    isUser ? "self-end" : "self-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 ${
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
                        <div className="bg-white rounded-xl p-3 border border-gray-200 flex items-center gap-3">
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
                    {m.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={m.imageUrl}
                          alt="Generated image"
                          className="rounded-lg"
                        />
                      </div>
                    )}
                    {m.videoUrl && (
                      <div className="mt-2">
                        <video
                          src={m.videoUrl}
                          controls
                          className="rounded-lg max-w-full h-auto"
                        />
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
                <div className="h-10 w-10 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center border border-gray-200">
                  <Wheat className="text-gray-200" />
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
                loading
                  ? "Analyzing..."
                  : "Ask, write or search for anything..."
              }
              className="flex-1 rounded-full border border-gray-300 px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
              aria-label="Ask Seomi AI"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={send}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full p-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md disabled:opacity-50"
            >
              <Send size={16} />
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Chat Modal */}
      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        messages={messages}
        input={input}
        setInput={setInput}
        loading={loading}
        onSend={send}
      />
    </>
  );
}
