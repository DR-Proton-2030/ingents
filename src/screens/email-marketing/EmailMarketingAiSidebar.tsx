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
} from "lucide-react";


type EmailReply = {
  subject: string;
  sender_name: string;
  sender_email: string;
  recipient: string;
  cc?: string;
  body: string;
  attachments: { file_name: string; file_url: string }[];
};

type Msg =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string | EmailReply };

export default function EmailMarketingAiSidebar({
  aiUrl,
  context,
  isFullScreen,
  setIsFullScreen,
}: any) {
  const [input, setInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
    if (!input.trim() && selectedFiles.length === 0) return;

    const userMsg: Msg = { role: "user", content: input };
    setMessages((s) => [...s, userMsg]);

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", input);
      selectedFiles.forEach((file) => formData.append("files", file));
      if (context?.chatId) formData.append("chatId", context.chatId);

      const response = await fetch(
        "http://localhost:8989/api/v1/messages/send",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();
      const parsedContent = data?.data?.parsedContent?.email;

      if (!parsedContent) throw new Error("No content returned");

      // Destructure reply
      const reply = {
        subject: parsedContent.subject,
        sender_name: parsedContent.sender_name,
        sender_email: parsedContent.sender_email,
        recipient: parsedContent.recipient,
        cc: parsedContent.cc,
        body: parsedContent.body,
        attachments: parsedContent.attachments || [],
      };

      // Push the structured reply to messages
      setMessages((s) => [...s, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((s) => [
        ...s,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setLoading(false);
      setInput("");
      setSelectedFiles([]);
    }
  };

  const headerAction = useMemo(
    () => (
      <button
        className="ml-auto p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Fullscreen"
        onClick={() => setIsFullScreen(true)}
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
              <div className="text-sm font-semibold">Email Marketing AI</div>
              <div className="text-xs text-gray-500">Quick help</div>
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

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.02 }}
                className={`max-w-[85%] ${isUser ? "self-end" : "self-start"}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    isUser
                      ? "bg-gradient from:gray-100 to:white border border-gray-200 text-sky-900"
                      : "bg-white text-gray-900 border border-gray-100"
                  }`}
                >
                  {typeof m.content === "string" ? (
                    <div className="whitespace-pre-wrap text-sm">
                      {m.content}
                    </div>
                  ) : (
                    // Render structured email reply
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="font-semibold">
                        Subject: {m.content.subject}
                      </div>
                      <div>
                        From: {m.content.sender_name} &lt;
                        {m.content.sender_email}&gt;
                      </div>
                      <div>To: {m.content.recipient}</div>
                      {m.content.cc && <div>CC: {m.content.cc}</div>}
                      <hr className="my-2 border-gray-300" />
                      <div className="whitespace-pre-wrap">
                        {m.content.body}
                      </div>
                      {m.content.attachments.length > 0 && (
                        <div className="mt-2 flex flex-col gap-1">
                          <div className="font-medium">Attachments:</div>
                          {m.content.attachments.map(
                            (att: any, idx: number) => (
                              <a
                                key={idx}
                                href={att.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-600 hover:underline text-sm"
                              >
                                {att.file_name}
                              </a>
                            )
                          )}
                        </div>
                      )}
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
      {/* Footer Input */}
      <div className="pt-2">
        {/* File preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs"
              >
                <span>{file.name}</span>
                <button
                  onClick={() =>
                    setSelectedFiles((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-center">
          {/* Hidden input */}
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setSelectedFiles((prev) => [...prev, ...files]);
            }}
          />

          {/* Upload button */}
          <button
            onClick={() => document.getElementById("fileUpload")?.click()}
            className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            <LinkIcon size={18} className="text-gray-600" />
          </button>

          {/* Text Input */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask, write or upload anything..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-3 text-sm bg-gray-50 focus:outline-none"
          />

          {/* Send button */}
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
