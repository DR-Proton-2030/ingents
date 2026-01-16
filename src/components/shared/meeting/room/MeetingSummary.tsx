"use client";
import React, { useState, useEffect, useRef } from "react";
import {
    Smile,
    Sparkles,
    ScrollText,
    Bot,
    MessageSquareText,
    Clock,
    User,
    ChevronDown,
} from "lucide-react";
import { TranscriptEntry, MeetingAISummary } from "./types";
import axios from "axios";
import { toast } from "react-toastify";

interface MeetingSummaryProps {
    transcripts: TranscriptEntry[];
}

const MeetingSummary: React.FC<MeetingSummaryProps> = ({ transcripts }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [summary, setSummary] = useState<MeetingAISummary | null>(null);
    const [activeTab, setActiveTab] = useState<"transcript" | "summary">("transcript");
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeTab === "transcript") {
            transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [transcripts, activeTab]);

    const generateSummary = async () => {
        if (transcripts.length === 0) {
            toast.error("No transcript available to summarize.");
            return;
        }

        setIsGenerating(true);
        setActiveTab("summary");

        try {
            // Format transcript for AI
            const transcriptText = transcripts.map(t => `[${new Date(t.timestamp).toLocaleTimeString()}] ${t.senderName}: ${t.text}`).join("\n");

            const response = await axios.post("/api/meeting/ai-summary", { transcript: transcriptText });
            setSummary(response.data);
            toast.success("Summary generated successfully!");
        } catch (err: any) {
            console.error("AI Generation Error:", err);
            toast.error("Failed to generate summary. Please try again.");
            setActiveTab("transcript");
        } finally {
            setIsGenerating(false);
        }
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-4 gap-1">
                <button
                    onClick={() => setActiveTab("transcript")}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "transcript" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    <MessageSquareText className="w-4 h-4" />
                    Transcript
                </button>
                <button
                    onClick={() => setActiveTab("summary")}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "summary" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    <Bot className="w-4 h-4" />
                    AI Summary
                </button>
            </div>

            <div className="flex-1 overflow-hidden">
                {activeTab === "transcript" ? (
                    <div className="h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto px-1 space-y-4 custom-scrollbar pb-4">
                            {transcripts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-50">
                                    <Clock className="w-10 h-10 mb-2 text-gray-400" />
                                    <p className="text-gray-500 text-sm">Waiting for discussion to start...</p>
                                    <p className="text-xs text-gray-400 mt-1">Transcripts will appear here in real-time</p>
                                </div>
                            ) : (
                                transcripts.map((entry, i) => (
                                    <div key={entry.id} className="flex gap-3 group">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                                            <User className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-sm text-gray-900 truncate">{entry.senderName}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">{formatTime(entry.timestamp)}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                {entry.text}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={transcriptEndRef} />
                        </div>

                        <div className="pt-4 border-t border-gray-100 bg-white">
                            <button
                                onClick={generateSummary}
                                disabled={isGenerating || transcripts.length === 0}
                                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
                            >
                                <Sparkles className={`w-5 h-5 ${isGenerating ? "animate-spin" : "group-hover:rotate-12 transition-transform"}`} />
                                {isGenerating ? "Summarizing..." : "Generate AI Summary"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto px-1 space-y-6 pb-6 custom-scrollbar">
                        {isGenerating ? (
                            <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-900 font-medium">Analyzing discussion...</p>
                                    <p className="text-gray-500 text-sm">Gemini AI is processing your meeting</p>
                                </div>
                            </div>
                        ) : summary ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div>
                                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Meeting Overview</h4>
                                    <h3 className="text-xl font-bold text-gray-900">{summary.title}</h3>
                                </div>

                                <div className="p-3 bg-green-50 rounded-xl border border-green-100 flex gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                                        <Smile className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-green-700 uppercase">Atmosphere</p>
                                        <p className="text-sm text-green-800 font-medium">{summary.sentiment}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <ScrollText className="w-4 h-4 text-purple-600" />
                                        <h4 className="font-bold text-gray-900">Key Discussion Points</h4>
                                    </div>
                                    <ul className="space-y-3">
                                        {summary.keyPoints.map((point, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                                                <span className="w-5 h-5 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                                                    {i + 1}
                                                </span>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <ScrollText className="w-4 h-4 text-orange-600" />
                                        <h4 className="font-bold text-gray-900">Action Items</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {summary.actionItems.map((item, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                                                <p className="text-sm text-gray-700 font-medium">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={generateSummary}
                                    className="w-full py-2.5 text-sm text-blue-600 font-semibold hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors"
                                >
                                    Update Summary
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-10">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                                    <Bot className="w-8 h-8 text-blue-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready to summarize?</h4>
                                <p className="text-gray-600 text-sm mb-6 max-w-[240px]">
                                    Once you have some transcript data, click the button below to generate an AI summary.
                                </p>
                                <button
                                    onClick={generateSummary}
                                    disabled={transcripts.length === 0}
                                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
                                >
                                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    Generate Summary
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeetingSummary;
