"use client";

import React, { useState, useRef, useEffect } from "react";
import ChatLayout from "../../components/chat/ChatLayout";
import ChatMessage from "../../components/chat/ChatMessage";
import ChatInput from "../../components/chat/ChatInput";
import { LucideSparkles, LucideFileText } from "lucide-react";
// simple rendering — no framer-motion

type Msg = { id: string; role: "user" | "assistant"; text: string };

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "1",
      role: "assistant",
      text: "Hello Jake, allow us to introduce ourselves.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [context, setContext] = useState<string>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("latest_result") || ""
      : ""
  );
  const [error, setError] = useState<string | null>(null);

  const send = (text: string) => {
    // require a context to keep responses constrained
    if (!context || !context.trim()) {
      setError(
        "Please provide a context (paste text above) or set DEFAULT_CHAT_CONTEXT in your .env.local"
      );
      return;
    }
    setError(null);
    const userMsg: Msg = { id: Date.now().toString(), role: "user", text };
    setMessages((s) => [...s, userMsg]);
    setLoading(true);

    // call server API which talks to Gemini model constrained by context
    (async () => {
      try {
        const resp = await fetch("/api/seomi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            context,
            messages: [{ role: "user", content: text }],
          }),
        });

        if (!resp.ok) {
          const t = await resp.text().catch(() => "(no body)");
          throw new Error(`Server error: ${resp.status} ${t}`);
        }

        const data = await resp.json();
        const reply =
          typeof data.reply === "string" ? data.reply : JSON.stringify(data);

        setMessages((s) => [
          ...s,
          { id: Date.now().toString() + "a", role: "assistant", text: reply },
        ]);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setMessages((s) => [
          ...s,
          {
            id: Date.now().toString() + "a",
            role: "assistant",
            text: `Error: ${message}`,
          },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  };

  // auto-scroll to bottom when messages or loading changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // give framer motion layout a tick to settle
    const id = setTimeout(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 50);

    return () => clearTimeout(id);
  }, [messages.length, loading]);

  const footer = (
    <div>
      <div className="flex flex-col gap-3 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-white/60">
            <button className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/4">
              <LucideSparkles size={14} /> AI
            </button>
            <button className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/4">
              <LucideFileText size={14} /> Sources
            </button>
          </div>
        </div>

        {error && <div className="text-xs text-rose-400">{error}</div>}

        <div className="bg-transparent">
          <ChatInput onSend={send} disabled={loading} />
        </div>
      </div>
    </div>
  );

  return (
    <ChatLayout title="AI-powered design assistant" footer={footer}>
      <div
        ref={scrollRef}
        className="flex flex-col gap-4 h-[65vh] overflow-y-auto"
        id="chat-message-list"
        style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
      >
        <style jsx global>{`
          #chat-message-list::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {messages.map((m) => (
          <ChatMessage
            key={m.id}
            role={m.role}
            // time={new Date().toLocaleTimeString()}
          >
            {m.text}
          </ChatMessage>
        ))}

        {loading && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
              AI
            </div>
            <div className="max-w-[75%]">
              <div className="inline-block px-4 py-3 rounded-2xl bg-white/4 text-white/80">
                Typing...
              </div>
            </div>
          </div>
        )}
      </div>
    </ChatLayout>
  );
};

export default Chat;
