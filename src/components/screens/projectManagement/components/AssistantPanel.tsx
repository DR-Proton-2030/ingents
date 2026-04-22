import React from "react";
import { Stars, Pen2, Record, Donut } from "@solar-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { BsChatSquareDots } from "react-icons/bs";

interface AssistantPanelProps {
    assistantPrompt: string;
    assistantReply: string;
    isAssistantLoading: boolean;
    onSubmitAssistant: (event: React.FormEvent) => void;
    onPromptChange: (value: string) => void;
    onQuickPrompt: (prompt: string) => void;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({
    assistantPrompt,
    assistantReply,
    isAssistantLoading,
    onSubmitAssistant,
    onPromptChange,
    onQuickPrompt,
}) => {
    return (
        <div className="relative rounded-[30px] bg-transparent pt-6">
            <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-8 w-[78%] -translate-x-1/2 rounded-[24px] bg-gray-200 shadow-[0_1px_0_rgba(0,0,0,0.12)]" />
            <div className="pointer-events-none absolute left-1/2 top-2 z-0 h-8 w-[88%] -translate-x-1/2 rounded-[24px] bg-gray-300 shadow-[0_2px_0_rgba(0,0,0,0.2)]" />

            <div className="relative z-10 rounded-[26px] border border-[#5b5b5b] bg-[#2b2d31] px-5 pb-5 pt-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                {/* Header */}



                {/* Chat Area */}
                <div className="flex-1 p-2 overflow-y-auto space-y-4 min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {assistantReply && (
                            <motion.div
                                key={assistantReply}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-start gap-3"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#4a4d52] border-[#5e6167] flex items-center justify-center flex-shrink-0 ">
                                    <Donut className="w-6 h-6 text-white/60" />
                                </div>
                                <div className="flex-1 bg-white/20 rounded-2xl rounded-tl-none p-4 text-sm text-white/70 leading-relaxed ">
                                    {assistantReply}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isAssistantLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-xs font-medium text-white/20 ml-11"
                        >
                            <div className="flex gap-1">
                                <span className="w-1 h-1 bg-white/20 rounded-full animate-bounce" />
                                <span className="w-1 h-1 bg-white/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="w-1 h-1 bg-white/20 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                            Assistant is thinking...
                        </motion.div>
                    )}
                </div>

                {/* Input & Quick Actions */}
                <div className="p-5 pt-0 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {[
                            "What's pending?",
                            "Today's summary",
                            "Urgent issues",
                        ].map((prompt) => (
                            <button
                                key={prompt}
                                onClick={() => onQuickPrompt(prompt)}
                                className="bg-white/20 px-3 py-1.5 rounded-full text-[11px] font-bold text-white/70 hover:border-[#3B82F6] hover:text-[#3B82F6] hover:bg-[#F0F7FF] transition-all duration-300"
                                type="button"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={onSubmitAssistant} className="relative group">
                        <input
                            value={assistantPrompt}
                            onChange={(event) => onPromptChange(event.target.value)}
                            placeholder='Ask your project intelligence...'
                            className="w-full bg-white/20 rounded-2xl pl-4 pr-12 py-3.5 text-sm text-white placeholder:text-white/70 outline-none e focus:border-[#3B82F6] focus:ring-4 focus:ring-blue-500/5 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={isAssistantLoading || !assistantPrompt.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-[#1F5FDB] text-white flex items-center justify-center hover:bg-[#1A4FB7] disabled:opacity-0 disabled:scale-90 transition-all duration-300 shadow-lg shadow-blue-500/20"
                        >
                            <Pen2 className="w-4 h-4 translate-x-[1px]" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
