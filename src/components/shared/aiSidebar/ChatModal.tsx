/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Maximize, Send, Wheat, Mic } from "lucide-react";
import FacebookPostBtn from "../facebookPostbtn/FacebookPostBtn";
import { BsFacebook } from "react-icons/bs";

// Define Msg type to include platform, imageUrl, and videoUrl
type Msg = { role: "user" | "assistant"; content: string; imageUrl?: string; videoUrl?: string; platform?: string };

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Msg[];
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  onSend: () => void;
}

export default function ChatModal({
  isOpen,
  onClose,
  messages,
  input,
  setInput,
  loading,
  onSend,
}: ChatModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [isMicActive, setIsMicActive] = useState(false);
  const recognitionRef = useRef<any>(null);
  const autoStopTimerRef = useRef<number | null>(null);

  // Auto scroll to bottom when new messages come in
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Restore sessionId from localStorage if available
  useEffect(() => {
    try {
      const storedId = localStorage.getItem("ai_session_modal_id");
      if (storedId) setSessionId(storedId);
    } catch (e) {
      console.warn("Failed to restore session ID from localStorage", e);
    }
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
        recognitionRef.current = null;
      }
      if (autoStopTimerRef.current) {
        window.clearTimeout(autoStopTimerRef.current);
        autoStopTimerRef.current = null;
      }
    };
  }, []);

  const getSpeechRecognition = () => window.SpeechRecognition || window.webkitSpeechRecognition || null;

  const handleSpeechToText = (autoStopMs = 10000) => {
    const SR = getSpeechRecognition();
    if (!SR) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    // If already active, stop
    if (isMicActive && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      setIsMicActive(false);
      if (autoStopTimerRef.current) {
        window.clearTimeout(autoStopTimerRef.current);
        autoStopTimerRef.current = null;
      }
      recognitionRef.current = null;
      return;
    }

  const recognition: any = new SR();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsMicActive(true);
      // schedule auto-stop
      if (autoStopMs && !autoStopTimerRef.current) {
        autoStopTimerRef.current = window.setTimeout(() => {
          if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) {}
            recognitionRef.current = null;
            setIsMicActive(false);
          }
          if (autoStopTimerRef.current) {
            window.clearTimeout(autoStopTimerRef.current);
            autoStopTimerRef.current = null;
          }
        }, autoStopMs);
      }
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      let finalText = input || "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += t;
        else interim += t;
      }
      setInput(finalText + interim);
    };

    recognition.onerror = (_e: any) => {
      setIsMicActive(false);
      recognitionRef.current = null;
      if (autoStopTimerRef.current) {
        window.clearTimeout(autoStopTimerRef.current);
        autoStopTimerRef.current = null;
      }
    };

    recognition.onend = () => {
      setIsMicActive(false);
      recognitionRef.current = null;
      if (autoStopTimerRef.current) {
        window.clearTimeout(autoStopTimerRef.current);
        autoStopTimerRef.current = null;
      }
    };

    recognition.start();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center w-full justify-center p-4 bg-white/10 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-8xl h-[94vh] bg-white rounded-3xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="h-12 w-12"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdBjDZmgcjezH0XD9snFi0tWGxgCzwB5Zpzg&s"
                alt="Seomi AI"
                className="h-10 w-10 rounded-full"
              />
            </motion.div>
            <div>
              <div className="text-lg font-semibold">Seomi AI</div>
              <div className="text-sm text-gray-500">Advanced AI Assistant</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close Chat Modal"
          >
            <Maximize size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-auto hidescroll bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col"
        >
          <div className="flex flex-col gap-4 max-w-4xl mx-auto p-8 w-full pb-32">
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const messageId = `${sessionId || "anon"}_${i}_${String(m.content || "").slice(0, 40).replace(/\s+/g, "_")}`;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.02 }}
                  className={`max-w-[85%] ${isUser ? "self-end" : "self-start"}`}
                >
                  <div
                    className={`rounded-t-[1.3rem] px-4 py-2 ${
                      isUser
                        ? "rounded-l-[1.3rem] bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "rounded-r-[1.3rem] bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-200 shadow-lg"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-md">{m.content}</div>
                    {m.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={m.imageUrl}
                          alt="Generated image"
                          className="rounded-lg w-96 mt-5"
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
                  {m.role === "assistant" && m.platform && (
                    <div className="-mt-2 flex items-center gap-2">
                      {m.platform === "facebook" ? (
                        <FacebookPostBtn message={m.content} file={m.imageUrl} messageId={messageId} />
                      ) : null}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 text-sm text-gray-500 self-start"
              >
                <div className="h-10 w-10 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center border border-gray-200">
                  <Wheat className="text-gray-200" />
                </div>
                <div>
                  <div className="animate-pulse">Analyzing data, please wait...</div>
                  <div className="text-xs text-gray-400">Creating in-depth analysis · Identifying tasks</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer Input */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="flex gap-3 items-center max-w-6xl mx-auto">

            <button
              onClick={() => handleSpeechToText()}
              className={`p-3 rounded-full shadow-lg hover:shadow-xl transition-all ${
                isMicActive
                  ? "bg-gradient-to-r from-red-400 to-red-500"
                  : "bg-gradient-to-r from-blue-400 to-blue-500"
              } text-white`}
              aria-label={isMicActive ? "Stop speech-to-text" : "Activate speech-to-text"}
            >
              {isMicActive ? (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
              ) : (
                <Mic size={20} />
              )}
            </button>

            <div className="flex-1 max-w-4xl">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) onSend();
                }}
                placeholder={
                  loading
                    ? "Seomi AI is responding..."
                    : "Ask Seomi AI anything..."
                }
                className="w-full rounded-full border border-gray-300 px-6 py-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 disabled:opacity-50"
                disabled={loading}
                aria-label="Chat with Seomi AI"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSend}
              disabled={loading || !input.trim()}
              className="rounded-full p-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
