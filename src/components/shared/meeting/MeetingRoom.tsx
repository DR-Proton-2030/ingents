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
    Sparkles,
    Pin,
    PinOff,
    HandFist,
    BrainCircuit,
    ScrollText,
    Bot,
    UserPlus,
    Search,
} from "lucide-react";
import { UserHandUp } from "@solar-icons/react/ssr";

import { MeetingDetails, Participant as MeetingParticipant } from "@/utils/api/meeting/meeting.api";

interface PeerStream {
    peerId: string;
    stream: MediaStream;
    userName?: string;
    isVideoOff?: boolean;
    isMuted?: boolean;
    reaction?: string | null;
    isHandRaised?: boolean;
}

interface ChatMessage {
    id: string;
    senderId: string;
    senderName?: string;
    text: string;
    timestamp: number;
}

type LayoutType = "auto" | "tiled" | "spotlight" | "sidebar";

interface MeetingRoomProps {
    meetingCode: string;
    peerId: string;
    localStream: MediaStream | null;
    meetingInfo: MeetingDetails | null;
    participants: MeetingParticipant[];
    currentUser: { id: string; name: string; email: string };
    remoteStreams: PeerStream[];
    isMuted: boolean;
    isVideoOff: boolean;
    isScreenSharing: boolean;
    isHandRaised: boolean;
    localReaction: string | null;
    showChat: boolean;
    chatMessages: ChatMessage[];
    hasUnreadMsg: boolean;
    onToggleMute: () => void;
    onToggleVideo: () => void;
    onToggleScreenShare: () => void;
    onToggleChat: () => void;
    onSendMessage: (text: string) => void;
    onSendReaction: (emoji: string) => void;
    onToggleHandRaise: () => void;
    onLeave: () => void;
}

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
    meetingCode,
    peerId,
    localStream,
    meetingInfo,
    participants,
    currentUser,
    remoteStreams,
    isMuted,
    isVideoOff,
    isScreenSharing,
    isHandRaised,
    localReaction,
    showChat,
    chatMessages,
    hasUnreadMsg,
    onToggleMute,
    onToggleVideo,
    onToggleScreenShare,
    onToggleChat,
    onSendMessage,
    onSendReaction,
    onToggleHandRaise,
    onLeave,
}) => {
    const [chatInput, setChatInput] = useState("");
    const [showPeople, setShowPeople] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [showLayoutModal, setShowLayoutModal] = useState(false);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [layout, setLayout] = useState<LayoutType>("sidebar");
    const [pinnedPeerId, setPinnedPeerId] = useState<string | null>(null);
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

    // Close all panels
    const closeAllPanels = () => {
        setShowPeople(false);
        setShowSummary(false);
        if (showChat) onToggleChat();
    };

    // Toggle people panel
    const togglePeople = () => {
        if (!showPeople) {
            closeAllPanels();
        }
        setShowPeople(!showPeople);
    };

    // Toggle summary panel
    const toggleSummary = () => {
        if (!showSummary) {
            closeAllPanels();
        }
        setShowSummary(!showSummary);
    };

    // Toggle chat
    const handleToggleChat = () => {
        if (!showChat) {
            closeAllPanels();
        }
        onToggleChat();
    };

    const allParticipants = [
        {
            id: "local",
            stream: localStream,
            isLocal: true,
            name: currentUser.name.split(" ")[0] || "You",
            fullName: currentUser.name || "You",
            isVideoOff: isVideoOff,
            isMuted: isMuted,
            reaction: localReaction,
            isHandRaised: isHandRaised
        },
        ...remoteStreams.map((p) => {
            // First check for userName sent via data connection, then fall back to participant lookup
            let name = p.userName;
            if (!name) {
                const invitee = participants?.find((m: MeetingParticipant) => m.user_details?._id === p.peerId || m._id === p.peerId);
                name = invitee?.user_details?.full_name || invitee?.external_name || p.peerId.substring(0, 8);
            }
            return {
                id: p.peerId,
                stream: p.stream,
                isLocal: false,
                name: name.split(" ")[0],
                fullName: name,
                isVideoOff: p.isVideoOff || false,
                isMuted: p.isMuted || false,
                reaction: p.reaction || null,
                isHandRaised: p.isHandRaised || false,
            };
        }),
    ];

    // Rearrange participants based on pinning
    const getLayoutParticipants = () => {
        if (!pinnedPeerId) return allParticipants;

        const pinned = allParticipants.find(p => p.id === pinnedPeerId);
        const others = allParticipants.filter(p => p.id !== pinnedPeerId);

        if (!pinned) return allParticipants;
        return [pinned, ...others];
    };

    const layoutParticipants = getLayoutParticipants();
    const mainSpeaker = layoutParticipants[0];

    // Avatar colors for participants
    const avatarColors = [
        "bg-blue-600",
        "bg-green-600",
        "bg-purple-600",
        "bg-orange-600",
        "bg-pink-600",
        "bg-teal-600",
    ];

    const togglePin = (id: string) => {
        setPinnedPeerId(prev => (prev === id ? null : id));
    };

    // Render video grid based on layout
    const renderVideoGrid = () => {
        if (allParticipants.length === 1) {
            return (
                <div className="w-full h-full relative rounded-lg overflow-hidden bg-[#3c4043]">
                    <VideoTile
                        id={allParticipants[0].id}
                        stream={allParticipants[0].stream}
                        name={allParticipants[0].name}
                        isLocal={allParticipants[0].isLocal}
                        isVideoOff={allParticipants[0].isVideoOff}
                        isMuted={allParticipants[0].isMuted}
                        isScreenSharing={isScreenSharing}
                        avatarColor={avatarColors[0]}
                        isPinned={pinnedPeerId === allParticipants[0].id}
                        onTogglePin={() => togglePin(allParticipants[0].id)}
                        reaction={allParticipants[0].reaction}
                        isHandRaised={allParticipants[0].isHandRaised}
                    />
                </div>
            );
        }

        switch (layout) {
            case "tiled":
                return (
                    <div
                        className={`w-full h-full grid gap-2 p-2 ${allParticipants.length <= 2
                            ? "grid-cols-2"
                            : allParticipants.length <= 4
                                ? "grid-cols-2 grid-rows-2"
                                : allParticipants.length <= 6
                                    ? "grid-cols-3 grid-rows-2"
                                    : "grid-cols-4 grid-rows-2"
                            }`}
                    >
                        {allParticipants.map((p, i) => (
                            <div key={p.id} className="relative rounded-lg overflow-hidden bg-[#3c4043]">
                                <VideoTile
                                    id={p.id}
                                    stream={p.stream}
                                    name={p.name}
                                    isLocal={p.isLocal}
                                    isVideoOff={p.isVideoOff}
                                    isMuted={p.isMuted}
                                    isScreenSharing={p.isLocal && isScreenSharing}
                                    avatarColor={avatarColors[i % avatarColors.length]}
                                    isPinned={pinnedPeerId === p.id}
                                    onTogglePin={() => togglePin(p.id)}
                                    reaction={p.reaction}
                                    isHandRaised={p.isHandRaised}
                                />
                            </div>
                        ))}
                    </div>
                );

            case "spotlight":
                return (
                    <div className="w-full h-full relative rounded-lg overflow-hidden bg-[#3c4043]">
                        <VideoTile
                            id={mainSpeaker.id}
                            stream={mainSpeaker.stream}
                            name={mainSpeaker.name}
                            isLocal={mainSpeaker.isLocal}
                            isVideoOff={mainSpeaker.isVideoOff}
                            isMuted={mainSpeaker.isMuted}
                            isScreenSharing={mainSpeaker.isLocal && isScreenSharing}
                            avatarColor={avatarColors[0]}
                            isPinned={pinnedPeerId === mainSpeaker.id}
                            onTogglePin={() => togglePin(mainSpeaker.id)}
                            reaction={mainSpeaker.reaction}
                            isHandRaised={mainSpeaker.isHandRaised}
                        />
                    </div>
                );

            case "sidebar":
            case "auto":
            default:
                return (
                    <div className="w-full h-full flex gap-2">
                        <div className="flex-1 relative rounded-lg overflow-hidden bg-[#3c4043]">
                            <VideoTile
                                id={mainSpeaker.id}
                                stream={mainSpeaker.stream}
                                name={mainSpeaker.name}
                                isLocal={mainSpeaker.isLocal}
                                isVideoOff={mainSpeaker.isVideoOff}
                                isMuted={mainSpeaker.isMuted}
                                isScreenSharing={mainSpeaker.isLocal && isScreenSharing}
                                avatarColor={avatarColors[0]}
                                isPinned={pinnedPeerId === mainSpeaker.id}
                                onTogglePin={() => togglePin(mainSpeaker.id)}
                                reaction={mainSpeaker.reaction}
                                isHandRaised={mainSpeaker.isHandRaised}
                            />
                        </div>
                        {layoutParticipants.length > 1 && (
                            <div className="w-44 flex-shrink-0 flex flex-col gap-2">
                                {layoutParticipants.slice(1, 5).map((p, i) => (
                                    <div key={p.id} className="relative aspect-video rounded-lg overflow-hidden bg-[#3c4043]">
                                        <VideoTile
                                            id={p.id}
                                            stream={p.stream}
                                            name={p.name}
                                            isLocal={p.isLocal}
                                            isVideoOff={p.isVideoOff}
                                            isMuted={p.isMuted}
                                            avatarColor={avatarColors[(i + 1) % avatarColors.length]}
                                            isPinned={pinnedPeerId === p.id}
                                            onTogglePin={() => togglePin(p.id)}
                                            reaction={p.reaction}
                                            isHandRaised={p.isHandRaised}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-200 overflow-hidden">
            {/* Layout Modal (Floating centered modal) */}
            {showLayoutModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    onClick={() => setShowLayoutModal(false)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50" />

                    {/* Modal */}
                    <div
                        className="relative bg-white rounded-2xl shadow-2xl w-[420px] max-w-[90vw]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 pb-2">
                            <h2 className="text-xl font-normal text-gray-900">Adjust view</h2>
                            <button
                                onClick={() => setShowLayoutModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="px-5 pb-5">
                            <p className="text-sm text-gray-500 mb-5">
                                Selection is saved for future meetings
                            </p>

                            {/* Layout Options */}
                            <div className="space-y-4">
                                {/* Auto */}
                                <label className="flex items-center gap-4 cursor-pointer py-1">
                                    <input
                                        type="radio"
                                        name="layout"
                                        checked={layout === "auto"}
                                        onChange={() => setLayout("auto")}
                                        className="w-5 h-5 text-blue-600 accent-blue-600"
                                    />
                                    <div className="flex items-center gap-2 flex-1">
                                        <span className="text-base text-gray-900">Auto (dynamic)</span>
                                        <Sparkles className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-6 h-9 bg-gray-200 rounded" />
                                        ))}
                                    </div>
                                </label>

                                {/* Tiled */}
                                <label className="flex items-center gap-4 cursor-pointer py-1">
                                    <input
                                        type="radio"
                                        name="layout"
                                        checked={layout === "tiled"}
                                        onChange={() => setLayout("tiled")}
                                        className="w-5 h-5 text-blue-600 accent-blue-600"
                                    />
                                    <span className="text-base text-gray-900 flex-1">Tiled (legacy)</span>
                                    <div className="grid grid-cols-4 gap-0.5">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                            <div key={i} className="w-4 h-3 bg-gray-200 rounded-sm" />
                                        ))}
                                    </div>
                                </label>

                                {/* Spotlight */}
                                <label className="flex items-center gap-4 cursor-pointer py-1">
                                    <input
                                        type="radio"
                                        name="layout"
                                        checked={layout === "spotlight"}
                                        onChange={() => setLayout("spotlight")}
                                        className="w-5 h-5 text-blue-600 accent-blue-600"
                                    />
                                    <span className="text-base text-gray-900 flex-1">Spotlight</span>
                                    <div className="w-20 h-12 bg-gray-200 rounded" />
                                </label>

                                {/* Sidebar */}
                                <label className="flex items-center gap-4 cursor-pointer py-1">
                                    <input
                                        type="radio"
                                        name="layout"
                                        checked={layout === "sidebar"}
                                        onChange={() => setLayout("sidebar")}
                                        className="w-5 h-5 text-blue-600 accent-blue-600"
                                    />
                                    <span className="text-base text-gray-900 flex-1">Sidebar</span>
                                    <div className="flex gap-1">
                                        <div className="w-14 h-12 bg-gray-200 rounded" />
                                        <div className="flex flex-col gap-0.5">
                                            <div className="w-5 h-3.5 bg-gray-200 rounded-sm" />
                                            <div className="w-5 h-3.5 bg-gray-200 rounded-sm" />
                                            <div className="w-5 h-3.5 bg-gray-200 rounded-sm" />
                                        </div>
                                    </div>
                                </label>
                            </div>



                            {/* Hide tiles toggle */}
                            <div className="mt-5 flex items-center justify-between">
                                <span className="text-base text-gray-900">Hide tiles without video</span>
                                <button className="w-12 h-7 bg-gray-300 rounded-full relative transition-colors">
                                    <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow flex items-center justify-center">
                                        <X className="w-3 h-3 text-gray-500" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex min-h-0 p-2 gap-2">
                {/* Video Grid Area */}
                <div className="flex-1 min-h-0">{renderVideoGrid()}</div>

                {/* People Panel */}
                {showPeople && (
                    <div className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg flex flex-col">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">People</h3>
                            <button onClick={togglePeople} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="px-4 pt-4 pb-2">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors text-sm font-medium">
                                <UserPlus className="w-4 h-4" />
                                Add people
                            </button>
                        </div>

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

                        <div className="flex-1 overflow-y-auto px-4 py-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">In the meeting</p>
                            <div className="border border-gray-200 rounded-lg">
                                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                                    <span className="font-medium text-gray-900">Contributors</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">{allParticipants.length}</span>
                                        <ChevronUp className="w-4 h-4 text-gray-500" />
                                    </div>
                                </button>
                                <div className="border-t border-gray-100">
                                    {allParticipants.map((participant, index) => {
                                        const isHost = meetingInfo?.host_user_object_id === participant.id || (participant.isLocal && meetingInfo?.host_details?._id === "local");
                                        return (
                                            <div key={participant.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                                                <div className={`w-9 h-9 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-medium text-sm flex-shrink-0`}>
                                                    {participant.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-900 truncate font-medium">
                                                            {participant.fullName}{participant.isLocal && " (You)"}
                                                        </span>
                                                        {isHost && (
                                                            <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Host</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {(participant.isLocal ? isMuted : participant.isMuted) && <MicOff className="w-4 h-4 text-gray-400" />}
                                                    <button className="p-1 hover:bg-gray-100 rounded-full">
                                                        <MoreVertical className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chat Panel */}
                {showChat && (
                    <div className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg flex flex-col">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">In-call messages</h3>
                            <button onClick={handleToggleChat} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MessageSquare className="w-4 h-4" />
                                <span>Continuous chat is OFF</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Messages won&apos;t be saved when the call ends.</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" ref={chatScrollRef}>
                            {chatMessages.length === 0 && <div className="text-center text-gray-400 text-sm mt-8">No messages yet</div>}
                            {chatMessages.map((msg) => (
                                <div key={msg.id} className="flex gap-3">
                                    <div className={`w-8 h-8 rounded-full ${avatarColors[allParticipants.findIndex((p) => p.id === msg.senderId) % avatarColors.length || 0]} flex items-center justify-center text-xs font-medium text-white flex-shrink-0`}>
                                        {msg.senderId === peerId ? currentUser.name.charAt(0).toUpperCase() : (msg.senderName?.charAt(0).toUpperCase() || msg.senderId.charAt(0).toUpperCase())}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-sm font-medium text-gray-900">{msg.senderId === peerId ? "You" : (msg.senderName || msg.senderId.substring(0, 8))}</span>
                                            <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 break-words">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

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
                                <button onClick={handleSendChat} disabled={!chatInput.trim()} className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary Panel */}
                {showSummary && (
                    <div className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                    <Sparkles className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900">AI Summary</h3>
                            </div>
                            <button onClick={toggleSummary} className="p-1.5 hover:bg-white/50 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
                            <AIContent chatMessages={chatMessages} />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Control Bar */}
            <div className="h-16 flex-shrink-0 bg-white border-t border-gray-200 flex items-center justify-between px-4">
                {/* Left - Time and Meeting Info */}
                <div className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="font-bold text-gray-900">{formatTime(currentTime)}</span>
                    <span className="text-gray-300">|</span>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 leading-tight">
                            {meetingInfo?.title || "Meeting"}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono tracking-wider">
                            {meetingCode}
                        </span>
                    </div>
                </div>

                {/* Center - Main Controls */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                            onClick={onToggleMute}
                            className={`p-3 rounded-full transition-all ${isMuted ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                        >
                            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="flex items-center">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                            onClick={onToggleVideo}
                            className={`p-3 rounded-full transition-all ${isVideoOff ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                        >
                            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                        </button>
                    </div>

                    <button
                        onClick={onToggleScreenShare}
                        className={`p-3 rounded-full transition-all ${isScreenSharing ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                    >
                        <MonitorUp className="w-5 h-5" />
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
                            className={`p-3 rounded-full transition-all ${showReactionPicker ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                        >
                            <Smile className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowLayoutModal(true)}
                        className={`p-3 rounded-full transition-all ${showLayoutModal ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </button>

                    <button
                        onClick={onToggleHandRaise}
                        className={`p-3 rounded-full transition-all ${isHandRaised ? "bg-yellow-400 text-white shadow-lg" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                    >
                        <Hand className="w-5 h-5" />
                    </button>

                    <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
                        <MoreVertical className="w-5 h-5" />
                    </button>

                    <button onClick={onLeave} className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors ml-2">
                        <Phone className="w-5 h-5 rotate-[135deg]" />
                    </button>
                </div>

                {/* Right - Additional Controls */}
                <div className="flex items-center gap-1">
                    <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <Info className="w-5 h-5" />
                    </button>

                    <button
                        onClick={togglePeople}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${showPeople ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"}`}
                    >
                        <div className="flex -space-x-2">
                            {allParticipants.slice(0, 3).map((p, i) => (
                                <div key={p.id} className={`w-6 h-6 rounded-full ${avatarColors[i % avatarColors.length]} border-2 border-white flex items-center justify-center text-[10px] font-medium text-white`}>
                                    {p.name.charAt(0).toUpperCase()}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm font-medium">{allParticipants.length}</span>
                    </button>

                    <button
                        onClick={handleToggleChat}
                        className={`p-2.5 rounded-full transition-colors relative ${showChat ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"}`}
                        title="Chat"
                    >
                        <MessageSquare className="w-5 h-5" />
                        {hasUnreadMsg && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
                    </button>

                    <button
                        onClick={toggleSummary}
                        className={`p-2.5 rounded-full transition-colors ${showSummary ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"}`}
                        title="AI Summary"
                    >
                        <Sparkles className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Video Tile Component
const VideoTile: React.FC<{
    id: string;
    stream: MediaStream | null;
    name: string;
    isLocal: boolean;
    isVideoOff: boolean;
    isMuted: boolean;
    isScreenSharing?: boolean;
    avatarColor: string;
    isPinned: boolean;
    onTogglePin: () => void;
    reaction?: string | null;
    isHandRaised?: boolean;
}> = ({ id, stream, name, isLocal, isVideoOff, isMuted, isScreenSharing, avatarColor, isPinned, onTogglePin, reaction, isHandRaised }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, isVideoOff]);

    return (
        <div
            className="w-full h-full relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <video
                ref={videoRef}
                autoPlay
                muted={isLocal}
                playsInline
                className={`absolute inset-0 w-full h-full object-cover ${isLocal && !isScreenSharing ? "scale-x-[-1]" : ""} ${isVideoOff ? "opacity-0" : "opacity-100"}`}
            />

            {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#3c4043]">
                    {reaction ? (
                        <div className="text-6xl animate-bounce">
                            {reaction}
                        </div>
                    ) : (
                        <div className={`w-20 h-20 rounded-full ${avatarColor} flex items-center justify-center ring-4 ring-white/20`}>
                            <span className="text-3xl text-white font-medium">{name.charAt(0).toUpperCase()}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Reaction Overlay when Video is ON */}
            {!isVideoOff && reaction && (
                <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                    <div className="text-7xl animate-bounce drop-shadow-2xl">
                        {reaction}
                    </div>
                </div>
            )}

            {isMuted && (
                <div className="absolute top-2 right-2 p-1 bg-red-500 rounded-full z-10">
                    <MicOff className="w-3 h-3 text-white" />
                </div>
            )}

            {isHandRaised && (
                <div className="absolute top-2 right-2 p-1.5 bg-yellow-400 rounded-full z-10 shadow-lg border-2 border-white animate-pulse">
                    <UserHandUp className="w-4 h-4 text-white" fill="white" />
                </div>
            )}

            {/* Hover Controls */}
            <div className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200 z-20 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTogglePin();
                        }}
                        className={`p-3 rounded-full transition-all ${isPinned ? "bg-blue-600 text-white shadow-lg" : "bg-white/90 text-gray-700 hover:bg-white shadow-md"}`}
                        title={isPinned ? "Unpin" : "Pin"}
                    >
                        {isPinned ? <PinOff className="w-5 h-5" /> : <Pin className="w-5 h-5" />}
                    </button>
                    <button className="p-3 bg-white/90 text-gray-700 hover:bg-white rounded-full shadow-md">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Pin status indicator (persistent) */}
            {isPinned && !isHovered && (
                <div className="absolute top-2 left-2 p-1 bg-blue-600 rounded-full z-10 shadow-lg">
                    <Pin className="w-3 h-3 text-white" />
                </div>
            )}

            <div className="absolute bottom-2 left-2 z-10">
                <span className="text-sm font-medium text-white drop-shadow-md bg-black/20 px-2 py-0.5 rounded-md backdrop-blur-[2px]">{name}</span>
            </div>
        </div>
    );
};

// AI Content Component (Simulated)
const AIContent: React.FC<{ chatMessages: ChatMessage[] }> = ({ chatMessages }) => {
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

export default MeetingRoom;
