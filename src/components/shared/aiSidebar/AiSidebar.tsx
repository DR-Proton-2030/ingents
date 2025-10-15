/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  LinkIcon,
  Maximize,
  MessageCircle,
  Navigation,
  RefreshCcw,
  RefreshCcwDot,
  Send,
  Wheat,
} from "lucide-react";
import ChatModal from "./ChatModal";
import FacebookPostBtn from "../facebookPostbtn/FacebookPostBtn";
import { BsFacebook, BsSignRailroadFill } from "react-icons/bs";

type Msg = { role: "user" | "assistant"; content: string; imageUrl?: string; videoUrl?: string; platform?: string };

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
        }),
      });

      // Prefer JSON parsing if server sent application/json (non-streaming)
      const contentType = (res.headers && res.headers.get && res.headers.get("content-type")) || "";
      if (contentType.includes("application/json")) {
        // Non-streaming JSON response (preferred)
        const data = await res.json();
        const reply = (data && data.reply) || "(no reply)";
        const imageUrl = data && data.imageUrl;
        const videoUrl = data && data.videoUrl;
        const platform = data && data.platform;
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

        const assistantMsg: Msg = { role: "assistant", content: reply, imageUrl, videoUrl, platform };
        setMessages((s) => {
          const next = [...s, assistantMsg];
          try {
            localStorage.setItem(`ai_session_${aiUrl}_messages`, JSON.stringify(next));
          } catch (e) {
            /* ignore */
          }
          return next;
        });
      } else if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let partial = "";

        // create a placeholder assistant message and persist it
        const placeholder: Msg = { role: "assistant", content: "" };
        console.log("===>placeholder created", placeholder);
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

  // After stream completes, extract trailing JSON metadata (if any) and remove all such
        // metadata blocks from the assistant message so the chat only shows the human text.
        // Some servers may include the metadata multiple times; we'll parse the last one.
        let newSessionId: string | undefined;
        try {
          const text = partial;
          // Find the last occurrence of a JSON object starting with '{"sessionId"' (or simply '{')
          const lastJsonIndex = text.lastIndexOf('\n{');
          if (lastJsonIndex !== -1) {
            const jsonText = text.slice(lastJsonIndex + 1).trim();
              try {
              const parsed = JSON.parse(jsonText);
              newSessionId = parsed.sessionId;
              const imageUrl = parsed.imageUrl;
              const videoUrl = parsed.videoUrl;
              const platform = parsed.platform;

              // Remove ALL trailing JSON meta blocks from the displayed text
              const cleaned = text.slice(0, lastJsonIndex).trim();

              // attach cleaned text and media/platform to the last message
              setMessages((s) => {
                const copy = s.slice();
                const last = copy[copy.length - 1] as Msg | undefined;
                if (last && last.role === 'assistant') {
                  last.content = cleaned || last.content;
                  if (imageUrl) last.imageUrl = imageUrl;
                  if (videoUrl) last.videoUrl = videoUrl;
                  if (platform) last.platform = platform;
                }
                try { localStorage.setItem(`ai_session_${aiUrl}_messages`, JSON.stringify(copy)); } catch (e) {}
                return copy;
              });

              // Log parsed metadata (includes platform)
              console.log('===>stream parsed meta', { sessionId: newSessionId, imageUrl, videoUrl, platform, cleaned });
            } catch (parseErr) {
              // If parsing failed, fall back to previous behavior: try single-match regex
              const jsonMatch = text.match(/\{\s*"sessionId"[\s\S]*\}$/);
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                newSessionId = parsed.sessionId;
                const imageUrl = parsed.imageUrl;
                const videoUrl = parsed.videoUrl;
                const platform = parsed.platform;
                const cleaned = text.replace(/\n\{[\s\S]*\}$/, "").trim();
                setMessages((s) => {
                  const copy = s.slice();
                  const last = copy[copy.length - 1] as Msg | undefined;
                  if (last && last.role === 'assistant') {
                    last.content = cleaned || last.content;
                    if (imageUrl) last.imageUrl = imageUrl;
                    if (videoUrl) last.videoUrl = videoUrl;
                    if (platform) last.platform = platform;
                  }
                  try { localStorage.setItem(`ai_session_${aiUrl}_messages`, JSON.stringify(copy)); } catch (e) {}
                  return copy;
                });

                // Log parsed metadata from fallback parse
                console.log('===>stream parsed meta (fallback)', { sessionId: newSessionId, imageUrl, videoUrl, platform, cleaned });
              }
            }
          } else {
            // no trailing JSON found; nothing to clean
          }
        } catch (e) {
          // ignore JSON/parse errors
        }

        if (newSessionId && newSessionId !== sessionId) {
          setSessionId(newSessionId);
          try { localStorage.setItem(`ai_session_${aiUrl}_id`, newSessionId); } catch (e) {}
        }
      } else {
        // No body stream and not JSON: treat as empty response
        console.warn('AI response had no readable body and was not JSON');
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
          className="flex-1 overflow-auto hidescroll  rounded-2xl p-3 bg-gradient-to-br from-gray-50 via-white to-gray-100 shadow-inner"
        >
          <div className="flex flex-col gap-4">
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const hasFile = /Example File|Downloads/i.test(m.content);
              // derive a lightweight message id for persisted posted state
              const messageId = `${sessionId || 'anon'}_${i}_${String(m.content || '').slice(0,40).replace(/\s+/g,'_')}`;

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
                    className={`rounded-t-[1.3rem]  px-4 py-2 ${
                      isUser
                        ? "rounded-l-[1.3rem] bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "rounded-r-[1.3rem] bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-200 shadow-lg"
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
                    {/* If assistant message includes a platform hint, surface Post buttons accordingly */}
                   
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
                   {m.role === 'assistant' && m.platform && (
                      <div className="-mt-2 flex items-center gap-2">
                        {m.platform === 'facebook' ? (
                          <FacebookPostBtn message={m.content} file={m.imageUrl} messageId={messageId} />
                        ) : null}

                        {m.platform === 'all' ? (
                          <>
                            {[
                              { id: 'facebook', label: 'Facebook' },
                              { id: 'instagram', label: 'Instagram' },
                              { id: 'linkedin', label: 'LinkedIn' },
                              { id: 'x', label: 'X' },
                            ].map((p) => (
                              <button
                                key={p.id}
                                onClick={()=>{console.log("=====>message",m.content)}}
                                className="px-3 py-1 rounded bg-sky-600 text-white text-sm"
                              >
                                Post to {p.label}
                              </button>
                            ))}
                          </>
                        ) : null}

                        <div
                          onClick={async () => {
                            const userMsg: Msg = { role: 'user', content: 'regenerate' };
                            setMessages((s) => [...s, userMsg]);
                            try {
                              await fetch(`/api/${aiUrl}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ messages: [...messages, userMsg], sessionId }),
                              });
                            } catch (e) {
                              console.error('Regenerate request failed', e);
                            }
                          }}
                          
                        >
                        {/* <button
                          className="group flex items-center justify-start w-11 h-11 bg-gray-800 rounded-full cursor-pointer relative overflow-hidden
                           transition-all duration-200 shadow-lg hover:w-40 hover:rounded-full active:translate-x-1 active:translate-y-1"
                        >
                          <div
                            className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3"
                          >
                           <RefreshCcwDot className="text-white"/>
                          </div>
                          <div
                            className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                          >
                            Regenerate
                          </div>
                        </button> */}
                        </div>
                     
                      </div>
                    )}
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
