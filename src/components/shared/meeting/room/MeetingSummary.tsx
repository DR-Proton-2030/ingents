"use client";
import React, { useState } from "react";
import {
    Smile,
    Sparkles,
    ScrollText,
    Bot,
} from "lucide-react";
import { ChatMessage } from "./types";

interface MeetingSummaryProps {
    chatMessages: ChatMessage[];
}

const MeetingSummary: React.FC<MeetingSummaryProps> = ({ chatMessages }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [summary, setSummary] = useState<{
        title: string;
        keyPoints: string[];
        actionItems: string[];
        sentiment: string;
    } | null>(null);

    const generateSummary = () => {
        setIsGenerating(true);
        // Simulate AI generation delay
        setTimeout(() => {
            setSummary({
                title: "Project Update & Sync",
                keyPoints: [
                    "Discussed the progress of the media sync feature implementation.",
                    "Identified issues with PeerJS initialization order and fixed them using hoisting.",
                    "Integrated real-time emoji reactions and hand-raising notifications.",
                    "Reviewed the premium UI design for the dashboard and meeting room."
                ],
                actionItems: [
                    "Complete the AI summary side panel integration.",
                    "Test multi-user media state synchronization in the production environment.",
                    "Optimize video grid layout for larger participant groups."
                ],
                sentiment: "Highly productive and collaborative session with clear outcomes."
            });
            setIsGenerating(false);
        }, 2500);
    };

    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
                </div>
                <div className="text-center">
                    <p className="text-gray-900 font-medium">Analyzing meeting data...</p>
                    <p className="text-gray-500 text-sm">Our AI is summarizing the discussion</p>
                </div>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Need a quick catch-up?</h4>
                <p className="text-gray-600 text-sm mb-6 max-w-[240px]">
                    Generate an AI-powered summary of everything discussed in this meeting so far.
                </p>
                <button
                    onClick={generateSummary}
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
                >
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Generate Summary
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto pb-4">
            {/* Title */}
            <div>
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Meeting Overview</h4>
                <h3 className="text-xl font-bold text-gray-900">{summary.title}</h3>
            </div>

            {/* Sentiment */}
            <div className="p-3 bg-green-50 rounded-xl border border-green-100 flex gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Smile className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-bold text-green-700 uppercase">Mojo Score</p>
                    <p className="text-sm text-green-800 font-medium">{summary.sentiment}</p>
                </div>
            </div>

            {/* Key Points */}
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

            {/* Action Items */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <ScrollText className="w-4 h-4 text-orange-600" />
                    <h4 className="font-bold text-gray-900">Action Items</h4>
                </div>
                <div className="space-y-2">
                    {summary.actionItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                            <div className="mt-1 w-2 h-2 rounded-full bg-orange-400" />
                            <p className="text-sm text-gray-700 font-medium">{item}</p>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={generateSummary}
                className="w-full py-2.5 text-sm text-blue-600 font-semibold hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors"
            >
                Refresh Summary
            </button>
        </div>
    );
};

export default MeetingSummary;
