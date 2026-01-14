"use client";
import React, { useRef, useEffect, useState } from "react";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    MonitorUp,
    MessageSquare,
    Phone,
    Send,
    X,
    MoreVertical,
    ChevronUp,
    Smile,
    LayoutGrid,
    Hand,
    Info,
    Users,
    Grid3X3,
    UserPlus,
    Search,
    ChevronDown,
} from "lucide-react";

interface PeerStream {
    peerId: string;
    stream: MediaStream;
}

interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
}

interface MeetingRoomProps {
    meetingCode: string;
    peerId: string;
    localStream: MediaStream | null;
    remoteStreams: PeerStream[];
    isMuted: boolean;
    isVideoOff: boolean;
    isScreenSharing: boolean;
    showChat: boolean;
    chatMessages: ChatMessage[];
    hasUnreadMsg: boolean;
    onToggleMute: () => void;
    onToggleVideo: () => void;
    onToggleScreenShare: () => void;
    onToggleChat: () => void;
    onSendMessage: (text: string) => void;
    onLeave: () => void;
}

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
    meetingCode,
    peerId,
    localStream,
    remoteStreams,
    isMuted,
    isVideoOff,
    isScreenSharing,
    showChat,
    chatMessages,
    hasUnreadMsg,
    onToggleMute,
    onToggleVideo,
    onToggleScreenShare,
    onToggleChat,
    onSendMessage,
    onLeave,
}) => {
    const [chatInput, setChatInput] = useState("");
    const [showPeople, setShowPeople] = useState(false);
    const chatScrollRef = useRef<HTMLDivElement>(null);

    // Get current time
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // Auto-scroll chat
    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSendChat = () => {
        if (chatInput.trim()) {
            onSendMessage(chatInput);
            setChatInput("");
        }
    };

    // Toggle people panel (close chat if opening people)
    const togglePeople = () => {
        if (!showPeople) {
            onToggleChat(); // Close chat if open
        }
        setShowPeople(!showPeople);
    };

    // Toggle chat (close people if opening chat)
    const handleToggleChat = () => {
        if (!showChat) {
            setShowPeople(false); // Close people if open
        }
        onToggleChat();
    };

    const allParticipants = [
        { id: "local", stream: localStream, isLocal: true, name: "You", fullName: "You" },
        ...remoteStreams.map((p) => ({
            id: p.peerId,
            stream: p.stream,
            isLocal: false,
            name: p.peerId.substring(0, 8),
            fullName: `Participant ${p.peerId.substring(0, 4)}`,
        })),
    ];

    const mainSpeaker = allParticipants[0];

    // Avatar colors for participants
    const avatarColors = [
        "bg-blue-600",
        "bg-green-600",
        "bg-purple-600",
        "bg-orange-600",
        "bg-pink-600",
        "bg-teal-600",
    ];

    return (
        <div className="h-screen flex flex-col bg-[#f8f9fa] overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 flex min-h-0 p-2 gap-2">
                {/* Main Video Area - Full Width */}
                <div className="flex-1 relative rounded-lg overflow-hidden bg-[#3c4043] min-h-0">
                    <MainVideoFrame
                        stream={mainSpeaker?.stream || null}
                        name={mainSpeaker?.name || "You"}
                        isLocal={mainSpeaker?.isLocal || true}
                        isVideoOff={mainSpeaker?.isLocal ? isVideoOff : false}
                        isMuted={mainSpeaker?.isLocal ? isMuted : false}
                        isScreenSharing={isScreenSharing}
                    />

                    {/* Mute indicator on main video */}
                    {isMuted && mainSpeaker?.isLocal && (
                        <div className="absolute top-3 right-3 p-1.5 bg-red-500 rounded-full">
                            <MicOff className="w-3 h-3 text-white" />
                        </div>
                    )}
                </div>

                {/* People Panel (Google Meet style) */}
                {showPeople && (
                    <div className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">People</h3>
                            <button
                                onClick={togglePeople}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Add People Button */}
                        <div className="px-4 pt-4 pb-2">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors text-sm font-medium">
                                <UserPlus className="w-4 h-4" />
                                Add people
                            </button>
                        </div>

                        {/* Search */}
                        <div className="px-4 py-2">
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-full border border-gray-200">
                                <Search className="w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search for people"
                                    className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* In Meeting Section */}
                        <div className="flex-1 overflow-y-auto px-4 py-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                In the meeting
                            </p>

                            {/* Contributors */}
                            <div className="border border-gray-200 rounded-lg">
                                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                                    <span className="font-medium text-gray-900">Contributors</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">{allParticipants.length}</span>
                                        <ChevronUp className="w-4 h-4 text-gray-500" />
                                    </div>
                                </button>

                                {/* Participant List */}
                                <div className="border-t border-gray-100">
                                    {allParticipants.map((participant, index) => (
                                        <div
                                            key={participant.id}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                        >
                                            {/* Avatar */}
                                            <div
                                                className={`w-9 h-9 rounded-full ${avatarColors[index % avatarColors.length]
                                                    } flex items-center justify-center text-white font-medium text-sm flex-shrink-0`}
                                            >
                                                {participant.name.charAt(0).toUpperCase()}
                                            </div>

                                            {/* Name */}
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm text-gray-900 truncate block">
                                                    {participant.fullName}
                                                    {participant.isLocal && " (You)"}
                                                </span>
                                            </div>

                                            {/* Mute Status */}
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {(participant.isLocal ? isMuted : false) && (
                                                    <MicOff className="w-4 h-4 text-gray-400" />
                                                )}
                                                <button className="p-1 hover:bg-gray-100 rounded-full">
                                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chat Panel (Google Meet style) */}
                {showChat && (
                    <div className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg flex flex-col">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">In-call messages</h3>
                            <button
                                onClick={handleToggleChat}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Chat Info */}
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MessageSquare className="w-4 h-4" />
                                <span>Continuous chat is OFF</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Messages won&apos;t be saved when the call ends.
                            </p>
                        </div>

                        {/* Messages */}
                        <div
                            className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
                            ref={chatScrollRef}
                        >
                            {chatMessages.length === 0 && (
                                <div className="text-center text-gray-400 text-sm mt-8">
                                    No messages yet
                                </div>
                            )}
                            {chatMessages.map((msg, index) => (
                                <div key={msg.id} className="flex gap-3">
                                    <div
                                        className={`w-8 h-8 rounded-full ${avatarColors[
                                            allParticipants.findIndex((p) => p.id === msg.senderId) %
                                            avatarColors.length || 0
                                        ]
                                            } flex items-center justify-center text-xs font-medium text-white flex-shrink-0`}
                                    >
                                        {msg.senderId === peerId
                                            ? "Y"
                                            : msg.senderId.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-sm font-medium text-gray-900">
                                                {msg.senderId === peerId ? "You" : msg.senderId.substring(0, 8)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 break-words">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input */}
                        <div className="p-3 border-t border-gray-200">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                                    placeholder="Send a message"
                                    className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
                                />
                                <button
                                    onClick={handleSendChat}
                                    disabled={!chatInput.trim()}
                                    className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Control Bar (Google Meet style) */}
            <div className="h-16 flex-shrink-0 bg-white border-t border-gray-200 flex items-center justify-between px-4">
                {/* Left - Time and Meeting ID */}
                <div className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="font-medium">{formatTime(currentTime)}</span>
                    <span className="text-gray-400">|</span>
                    <span>{meetingCode}</span>
                </div>

                {/* Center - Main Controls */}
                <div className="flex items-center gap-2">
                    {/* Mic Toggle */}
                    <div className="flex items-center">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                            onClick={onToggleMute}
                            className={`p-3 rounded-full transition-all ${isMuted
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                }`}
                        >
                            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Video Toggle */}
                    <div className="flex items-center">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                            onClick={onToggleVideo}
                            className={`p-3 rounded-full transition-all ${isVideoOff
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                }`}
                        >
                            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Screen Share */}
                    <button
                        onClick={onToggleScreenShare}
                        className={`p-3 rounded-full transition-all ${isScreenSharing
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                    >
                        <MonitorUp className="w-5 h-5" />
                    </button>

                    {/* Emoji */}
                    <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
                        <Smile className="w-5 h-5" />
                    </button>

                    {/* Layout */}
                    <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
                        <LayoutGrid className="w-5 h-5" />
                    </button>

                    {/* Hand */}
                    <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
                        <Hand className="w-5 h-5" />
                    </button>

                    {/* More */}
                    <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
                        <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Leave Call */}
                    <button
                        onClick={onLeave}
                        className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors ml-2"
                    >
                        <Phone className="w-5 h-5 rotate-[135deg]" />
                    </button>
                </div>

                {/* Right - Additional Controls with Participant Avatars */}
                <div className="flex items-center gap-1">
                    <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <Info className="w-5 h-5" />
                    </button>

                    {/* Participants Button with Avatars */}
                    <button
                        onClick={togglePeople}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${showPeople ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"
                            }`}
                    >
                        {/* Stacked Avatars */}
                        <div className="flex -space-x-2">
                            {allParticipants.slice(0, 3).map((p, i) => (
                                <div
                                    key={p.id}
                                    className={`w-6 h-6 rounded-full ${avatarColors[i % avatarColors.length]
                                        } border-2 border-white flex items-center justify-center text-[10px] font-medium text-white`}
                                >
                                    {p.name.charAt(0).toUpperCase()}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm font-medium">{allParticipants.length}</span>
                    </button>

                    <button
                        onClick={handleToggleChat}
                        className={`p-2.5 rounded-full transition-colors relative ${showChat ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"
                            }`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        {hasUnreadMsg && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                    </button>

                    <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <Grid3X3 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Video Frame Component
const MainVideoFrame: React.FC<{
    stream: MediaStream | null;
    name: string;
    isLocal: boolean;
    isVideoOff: boolean;
    isMuted: boolean;
    isScreenSharing: boolean;
}> = ({ stream, name, isLocal, isVideoOff, isMuted, isScreenSharing }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <>
            <video
                ref={videoRef}
                autoPlay
                muted={isLocal}
                playsInline
                className={`absolute inset-0 w-full h-full object-cover ${isLocal && !isScreenSharing ? "scale-x-[-1]" : ""
                    } ${isVideoOff ? "opacity-0" : "opacity-100"}`}
            />

            {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#3c4043]">
                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center ring-4 ring-blue-400/30">
                        <span className="text-4xl text-white font-medium">
                            {name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div>
            )}

            {/* Name Label */}
            <div className="absolute bottom-3 left-3">
                <span className="text-sm font-medium text-white drop-shadow-lg">{name}</span>
            </div>
        </>
    );
};

export default MeetingRoom;
