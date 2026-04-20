"use client";

import React, { useState, useRef, useEffect } from "react";
import Layout from "@/screens/layout/Layout";
import { api } from "@/utils/api";
import { Send, Bot, User, Sparkles, Loader2, ArrowLeft, MoreHorizontal, Eraser, Github, Slack, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface VirtualAssistantProps {
    isEmbedded?: boolean;
    projectContext?: string;
}

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({ 
    isEmbedded = false, 
    projectContext 
}) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I'm your Ingents Assistant. Connect your favorite tools in the Integrations tab so I can help you automate tasks on GitHub, Slack, and more. How can I assist you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await api.virtualAssistant.chatWithAssistant(
                [...messages, userMessage],
                projectContext
            );
            if (res?.message) {
                setMessages(prev => [...prev, { role: "assistant", content: res.message }]);
            }
        } catch (err) {
            console.error("Chat Error:", err);
            setMessages(prev => [...prev, { role: "assistant", content: "I encountered an error while processing your request. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([{ role: "assistant", content: "Chat cleared. How can I help you now?" }]);
    };

    const Content = (
        <div className={`mx-auto max-w-5xl ${isEmbedded ? "h-full" : "h-[calc(100vh-120px)]"} flex flex-col px-4 py-4`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6 bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Virtual Assistant</h2>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs text-gray-500 font-medium">AI Agent Online</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={clearChat}
                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                            title="Clear Chat"
                        >
                            <Eraser className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Chat Container */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-2 space-y-6 custom-scrollbar pb-6"
                >
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                                        msg.role === "user" ? "bg-gray-100" : "bg-indigo-50"
                                    }`}>
                                        {msg.role === "user" ? (
                                            <User className="h-5 w-5 text-gray-600" />
                                        ) : (
                                            <Bot className="h-5 w-5 text-indigo-600" />
                                        )}
                                    </div>
                                    
                                    <div className={`relative px-5 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                                        msg.role === "user" 
                                            ? "bg-slate-900 text-white rounded-tr-none" 
                                            : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                                    }`}>
                                        {msg.content}
                                        {msg.role === "assistant" && idx === 0 && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
                                                <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg text-[10px] text-gray-500">
                                                    <Github className="h-3 w-3" /> GitHub
                                                </div>
                                                <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg text-[10px] text-gray-500">
                                                    <Slack className="h-3 w-3" /> Slack
                                                </div>
                                                <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg text-[10px] text-gray-500">
                                                    <Calendar className="h-3 w-3" /> Calendar
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-start"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                        <Bot className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
                                        <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="mt-4 relative bg-white border border-gray-100 rounded-3xl p-2 shadow-xl focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all">
                    <input 
                        type="text"
                        placeholder="Ask me to schedule a meeting, check GitHub PRs, or send messages..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        className="w-full pl-6 pr-16 py-4 text-sm font-medium focus:outline-none"
                    />
                    <button 
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg shadow-indigo-500/20"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </button>
                    
                    <div className="absolute -bottom-8 left-6 flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 text-indigo-500" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Powered by GPT-4o & Composio</span>
                    </div>
                </div>
            </div>
    );

    if (isEmbedded) return Content;

    return (
        <Layout showSidebar={true}>
            {Content}
        </Layout>
    );
};

export default VirtualAssistant;
