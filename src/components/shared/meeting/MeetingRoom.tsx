"use client";
import React, { useRef, useEffect, useState } from "react";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    MonitorUp,
    MessageSquare,
    PhoneOff,
    User,
    Send,
    X,
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
    const chatScrollRef = useRef<HTMLDivElement>(null);

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

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0f16] relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-50" />

            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                        <Video className="text-cyan-400 w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-widest text-slate-200">
                        INGENTS MEET
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Room ID */}
                    <div className="px-3 py-1 bg-slate-800 rounded border border-slate-700 flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase">Room:</span>
                        <span className="text-xs font-mono text-white font-bold">
                            {meetingCode}
                        </span>
                    </div>

                    {/* Status */}
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Encrypted Mesh
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Video Grid */}
                <div className="flex-1 flex flex-col relative p-4 gap-4 overflow-hidden">
                    <div className="flex-1 overflow-y-auto min-h-0 p-2">
                        <div
                            className={`grid gap-4 h-full ${remoteStreams.length === 0
                                ? "grid-cols-1"
                                : remoteStreams.length === 1
                                    ? "grid-cols-1 md:grid-cols-2"
                                    : remoteStreams.length <= 3
                                        ? "grid-cols-2"
                                        : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                }`}
                        >
                            {/* Local Video */}
                            <VideoFrame
                                stream={localStream}
                                isVideoOff={isVideoOff}
                                isMuted={isMuted}
                                label="You"
                                isLocal
                                isScreenSharing={isScreenSharing}
                            />

                            {/* Remote Videos */}
                            {remoteStreams.map((peer) => (
                                <VideoFrame
                                    key={peer.peerId}
                                    stream={peer.stream}
                                    label={peer.peerId.substring(0, 8)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Controls Bar */}
                    <div className="h-20 flex items-center justify-center gap-4 shrink-0">
                        <div className="flex items-center gap-2 px-6 py-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full shadow-2xl">
                            {/* Mic */}
                            <button
                                onClick={onToggleMute}
                                className={`p-3 rounded-full transition-all ${isMuted
                                    ? "bg-red-500 text-white"
                                    : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                                    }`}
                                title={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted ? (
                                    <MicOff className="w-5 h-5" />
                                ) : (
                                    <Mic className="w-5 h-5" />
                                )}
                            </button>

                            {/* Video */}
                            <button
                                onClick={onToggleVideo}
                                className={`p-3 rounded-full transition-all ${isVideoOff
                                    ? "bg-red-500 text-white"
                                    : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                                    }`}
                                title={isVideoOff ? "Turn on camera" : "Turn off camera"}
                            >
                                {isVideoOff ? (
                                    <VideoOff className="w-5 h-5" />
                                ) : (
                                    <Video className="w-5 h-5" />
                                )}
                            </button>

                            {/* Screen Share */}
                            <button
                                onClick={onToggleScreenShare}
                                className={`p-3 rounded-full transition-all ${isScreenSharing
                                    ? "bg-green-500 text-white"
                                    : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                                    }`}
                                title={isScreenSharing ? "Stop sharing" : "Share screen"}
                            >
                                <MonitorUp className="w-5 h-5" />
                            </button>

                            {/* Chat */}
                            <button
                                onClick={onToggleChat}
                                className={`p-3 rounded-full transition-all relative ${showChat
                                    ? "bg-cyan-500 text-white"
                                    : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                                    }`}
                                title="Chat"
                            >
                                <MessageSquare className="w-5 h-5" />
                                {hasUnreadMsg && (
                                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900" />
                                )}
                            </button>

                            <div className="w-[1px] h-8 bg-slate-700 mx-2" />

                            {/* Leave */}
                            <button
                                onClick={onLeave}
                                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-sm tracking-wide transition-colors flex items-center gap-2"
                            >
                                <PhoneOff className="w-5 h-5" />
                                Leave
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chat Sidebar */}
                <div
                    className={`transition-all duration-300 ease-in-out border-l border-slate-800 bg-slate-900/95 backdrop-blur-xl flex flex-col ${showChat
                        ? "w-80 translate-x-0"
                        : "w-0 translate-x-full opacity-0 overflow-hidden"
                        }`}
                >
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-black/20">
                        <span className="font-bold text-slate-200 tracking-wider">
                            CHAT
                        </span>
                        <button
                            onClick={onToggleChat}
                            className="text-slate-500 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div
                        className="flex-1 overflow-y-auto p-4 space-y-4"
                        ref={chatScrollRef}
                    >
                        {chatMessages.length === 0 && (
                            <div className="text-center text-slate-600 text-xs font-mono mt-10">
                                No messages yet.
                            </div>
                        )}
                        {chatMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${msg.senderId === peerId ? "items-end" : "items-start"
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        {msg.senderId === peerId
                                            ? "You"
                                            : `${msg.senderId.substring(0, 4)}...`}
                                    </span>
                                    <span className="text-[9px] text-slate-700">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <div
                                    className={`px-3 py-2 rounded-lg text-sm max-w-[90%] break-words ${msg.senderId === peerId
                                        ? "bg-cyan-600/20 border border-cyan-500/30 text-cyan-100"
                                        : "bg-slate-800 border border-slate-700 text-slate-300"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-slate-800 bg-black/20">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                                placeholder="Type message..."
                                className="flex-1 bg-slate-800 border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                            />
                            <button
                                onClick={handleSendChat}
                                disabled={!chatInput.trim()}
                                className="p-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Video Frame Component
const VideoFrame: React.FC<{
    stream: MediaStream | null;
    label: string;
    isVideoOff?: boolean;
    isMuted?: boolean;
    isLocal?: boolean;
    isScreenSharing?: boolean;
}> = ({ stream, label, isVideoOff, isMuted, isLocal, isScreenSharing }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="relative bg-black rounded-2xl overflow-hidden border border-slate-700 shadow-lg group aspect-video">
            <video
                ref={videoRef}
                autoPlay
                muted={isLocal}
                playsInline
                className={`w-full h-full object-cover ${isLocal && !isScreenSharing ? "scale-x-[-1]" : ""
                    } ${isVideoOff ? "opacity-0" : "opacity-100"}`}
            />

            {/* Video Off Placeholder */}
            {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-600" />
                    </div>
                </div>
            )}

            {/* Label */}
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur rounded text-white text-xs font-bold flex items-center gap-2">
                <span>{label}</span>
                {isScreenSharing && (
                    <MonitorUp className="w-3 h-3 text-green-400" />
                )}
                {isMuted && <MicOff className="w-3 h-3 text-red-400" />}
            </div>
        </div>
    );
};

export default MeetingRoom;
