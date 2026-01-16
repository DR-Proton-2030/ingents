"use client";
import React, { useState } from "react";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    MonitorUp,
    Phone,
    MoreVertical,
    ChevronUp,
    Smile,
    LayoutGrid,
    Info,
    Users,
    MessageSquare,
    Bot,
    Sparkles,
    HandIcon,
    Settings,
} from "lucide-react";
import { UserHandUp } from "@solar-icons/react/ssr";
import { ParticipantState } from "./types";
import { FaRegHandPaper } from "react-icons/fa";
import { FiVoicemail } from "react-icons/fi";

interface MeetingControlsProps {
    isMuted: boolean;
    isVideoOff: boolean;
    isScreenSharing: boolean;
    isHandRaised: boolean;
    onToggleMute: () => void;
    onToggleVideo: () => void;
    onToggleScreenShare: () => void;
    onToggleHandRaise: () => void;
    onSendReaction: (emoji: string) => void;
    onLeave: () => void;
    toggleChat: () => void;
    togglePeople: () => void;
    toggleSummary: () => void;
    toggleLayout: () => void;
    showChat: boolean;
    showPeople: boolean;
    showSummary: boolean;
    hasUnreadMsg: boolean;
    allParticipants: ParticipantState[];
    meetingCode: string;
    meetingTitle?: string;
    isTranscriptionActive: boolean;
    onToggleTranscription: () => void;
    onToggleVisualEffects: () => void;
    showVisualEffects: boolean;
}

const avatarColors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-cyan-500",
];

const MeetingControls: React.FC<MeetingControlsProps> = ({
    isMuted,
    isVideoOff,
    isScreenSharing,
    isHandRaised,
    onToggleMute,
    onToggleVideo,
    onToggleScreenShare,
    onToggleHandRaise,
    onSendReaction,
    onLeave,
    toggleChat,
    togglePeople,
    toggleSummary,
    toggleLayout,
    showChat,
    showPeople,
    showSummary,
    hasUnreadMsg,
    allParticipants,
    meetingCode,
    meetingTitle,
    isTranscriptionActive,
    onToggleTranscription,
    onToggleVisualEffects,
    showVisualEffects,
}) => {
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="h-20 bg-white border-t border-gray-200 px-6 flex items-center justify-between z-50">
            {/* Left - Meeting Info */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-gray-900 font-medium">{formatTime(currentTime)} | {meetingTitle || meetingCode}</span>
                </div>
            </div>

            {/* Center - Primary Actions */}
            <div className="flex items-center gap-3">
                <div className="flex items-center">

                    <button
                        onClick={onToggleMute}
                        className={`p-3 rounded-full transition-all ${isMuted ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-200 text-gray-700"}`}
                    >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={onToggleVideo}
                        className={`p-3 rounded-full transition-all ${isVideoOff ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-200 text-gray-700"}`}
                    >
                        {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                    </button>
                </div>

                <button
                    onClick={onToggleScreenShare}
                    className={`p-3 rounded-full transition-all ${isScreenSharing ? "bg-blue-100 text-blue-600" : "bg-gray-200 hover:bg-gray-200 text-gray-700"}`}
                >
                    <MonitorUp className="w-6 h-6" />
                </button>

                <div className="relative">
                    {showReactionPicker && (
                        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-[#202124] rounded-full p-1.5 flex items-center gap-1 shadow-2xl border border-white/10 z-[100]">
                            {["💖", "👍", "🎉", "👏", "😂", "😮", "😢", "🤔", "👎"].map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => {
                                        onSendReaction(emoji);
                                        setShowReactionPicker(false);
                                    }}
                                    className="w-9 h-9 flex items-center justify-center text-xl hover:bg-white/10 rounded-full transition-colors"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}
                    <button
                        onClick={() => setShowReactionPicker(!showReactionPicker)}
                        className={`p-3 rounded-full transition-all ${showReactionPicker ? "bg-blue-100 text-blue-600" : "bg-gray-200 hover:bg-gray-200 text-gray-700"}`}
                    >
                        <Smile className="w-6 h-6" />
                    </button>
                </div>

                <button
                    onClick={toggleLayout}
                    className={`p-3 rounded-full transition-all bg-gray-200 hover:bg-gray-200 text-gray-700`}
                >
                    <LayoutGrid className="w-6 h-6" />
                </button>

                <button
                    onClick={onToggleHandRaise}
                    className={`p-3 rounded-full transition-all ${isHandRaised ? "bg-yellow-400 text-white shadow-lg" : "bg-gray-200 hover:bg-gray-200 text-gray-700"}`}
                >
                    <FaRegHandPaper className="w-6 h-6" fill={isHandRaised ? "white" : "currentColor"} />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className={`p-3 rounded-full transition-all ${showMoreMenu ? "bg-blue-100 text-blue-600" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                        title="More options"
                    >
                        <MoreVertical className="w-6 h-6" />
                    </button>

                    {showMoreMenu && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200">
                            <button
                                onClick={() => {
                                    onToggleVisualEffects();
                                    setShowMoreMenu(false);
                                }}
                                className="w-full px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors group">
                                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-100 transition-colors">
                                    <Sparkles className="w-5 h-5 text-gray-600" />
                                </div>
                                <span className="text-sm font-medium">Apply Filters</span>
                            </button>
                            <button
                                onClick={() => {
                                    toggleLayout()
                                    setShowMoreMenu(false)
                                }}
                                className="w-full px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors group">
                                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-100 transition-colors">
                                    <LayoutGrid className="w-5 h-5 text-gray-600" />
                                </div>
                                <span className="text-sm font-medium">Adjust View</span>
                            </button>
                            <div className="h-px bg-gray-100 my-1 mx-4" />
                            <button className="w-full px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors group">
                                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-100 transition-colors">
                                    <Settings className="w-5 h-5 text-gray-600" />
                                </div>
                                <span className="text-sm font-medium">Settings</span>
                            </button>
                        </div>
                    )}
                </div>

                <button onClick={onLeave} className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors ml-2 shadow-lg shadow-red-100">
                    <Phone className="w-6 h-6 rotate-[135deg]" />
                </button>
            </div>

            {/* Right - Additional Controls */}
            <div className="flex items-center gap-1">


                <button
                    onClick={togglePeople}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${showPeople ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200 bg-gray-100 text-gray-600"}`}
                >
                    <div className="flex -space-x-2">
                        {allParticipants.slice(0, 3).map((p, i) => (
                            <div key={p.id} className={`w-6 h-6 rounded-full ${avatarColors[i % avatarColors.length]} border-2 border-white flex items-center justify-center text-[10px] font-medium text-white`}>
                                {p.name.charAt(0).toUpperCase()}
                            </div>
                        ))}
                    </div>
                    <span className="text-sm font-medium ml-1">{allParticipants.length}</span>
                </button>

                <button
                    onClick={toggleChat}
                    className={`p-2.5 rounded-full transition-colors relative ${showChat ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200 text-gray-600"}`}
                >
                    <MessageSquare className="w-6 h-6" />
                    {hasUnreadMsg && <div className="absolute top-2 right-2 w-3 h-3 bg-blue-600 border-2 border-white rounded-full" />}
                </button>

                <button
                    onClick={onToggleTranscription}
                    className={`p-2.5 rounded-full transition-all relative ${isTranscriptionActive ? "bg-red-50 text-red-600 ring-2 ring-red-100" : "hover:bg-gray-200 text-gray-600"}`}
                    title={isTranscriptionActive ? "Transcription Active (Click to Stop)" : "Start AI Transcription"}
                >
                    <FiVoicemail className={`w-6 h-6 ${isTranscriptionActive ? "animate-pulse" : ""}`} />
                    {isTranscriptionActive && (
                        <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 border-2 border-white rounded-full" />
                    )}
                </button>

                <button
                    onClick={toggleSummary}
                    className={`p-2.5 rounded-full transition-colors ${showSummary ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200 text-gray-600"}`}
                    title="Meeting Summary & AI Insights"
                >
                    <Sparkles className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default MeetingControls;
