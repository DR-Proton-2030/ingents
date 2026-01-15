"use client";
import React, { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { MeetingDetails, Participant as MeetingParticipant } from "@/utils/api/meeting/meeting.api";

// Sub-components
import VideoTile from "./room/VideoTile";
import MeetingChat from "./room/MeetingChat";
import MeetingPeople from "./room/MeetingPeople";
import MeetingSummary from "./room/MeetingSummary";
import MeetingControls from "./room/MeetingControls";
import MeetingVideoGrid from "./room/MeetingVideoGrid";
import MeetingLayoutModal from "./room/MeetingLayoutModal";

// Types
import { PeerStream, ChatMessage, LayoutType, ParticipantState } from "./room/types";

export interface MeetingRoomProps {
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
    // State
    const [layout, setLayout] = useState<LayoutType>("auto");
    const [showPeople, setShowPeople] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [pinnedPeerId, setPinnedPeerId] = useState<string | null>(null);
    const [showLayoutModal, setShowLayoutModal] = useState(false);

    // Refs
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Close all panels
    const closeAllPanels = () => {
        if (showChat) onToggleChat();
        setShowPeople(false);
        setShowSummary(false);
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

    // Participants construction
    const allParticipants: ParticipantState[] = [
        {
            id: peerId || "local",
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
            const meetingParticipant = participants.find(
                (mp) => mp.user_details?._id === p.peerId || mp.user_object_id === p.peerId
            );
            const fullName = p.userName || meetingParticipant?.user_details?.full_name || meetingParticipant?.external_name || p.peerId.substring(0, 8);
            return {
                id: p.peerId,
                stream: p.stream,
                isLocal: false,
                name: fullName.split(" ")[0],
                fullName: fullName,
                isVideoOff: !!p.isVideoOff,
                isMuted: !!p.isMuted,
                reaction: p.reaction || null,
                isHandRaised: !!p.isHandRaised,
            };
        }),
    ];

    // Rearrange participants based on pinning
    const getLayoutParticipants = () => {
        if (!pinnedPeerId) return allParticipants;
        const pinned = allParticipants.find((p) => p.id === pinnedPeerId);
        if (!pinned) return allParticipants;
        const others = allParticipants.filter((p) => p.id !== pinnedPeerId);
        return [pinned, ...others];
    };

    const togglePin = (id: string) => {
        setPinnedPeerId(pinnedPeerId === id ? null : id);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-200 overflow-hidden">
            <audio ref={audioRef} src="/sounds/hand-raise.mp3" />

            {/* Layout Modal */}
            {showLayoutModal && (
                <MeetingLayoutModal
                    layout={layout}
                    setLayout={setLayout}
                    onClose={() => setShowLayoutModal(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex min-h-0 p-2 gap-2">
                {/* Video Grid Area */}
                <div className="flex-1 min-h-0">
                    <MeetingVideoGrid
                        layout={layout}
                        allParticipants={getLayoutParticipants()}
                        pinnedPeerId={pinnedPeerId}
                        togglePin={togglePin}
                        isScreenSharing={isScreenSharing}
                    />
                </div>

                {/* Right Panels */}
                {(showPeople || showChat || showSummary) && (
                    <div className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg flex flex-col animate-in slide-in-from-right-4 duration-300 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">
                                {showPeople ? "People" : showChat ? "In-call messages" : "AI Summary"}
                            </h3>
                            <button
                                onClick={closeAllPanels}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex-1 min-h-0 overflow-hidden">
                            {showPeople && (
                                <MeetingPeople
                                    participants={allParticipants}
                                    meetingInfo={meetingInfo}
                                    isMuted={isMuted}
                                />
                            )}
                            {showChat && (
                                <MeetingChat
                                    peerId={peerId}
                                    currentUser={currentUser}
                                    chatMessages={chatMessages}
                                    onSendMessage={onSendMessage}
                                    allParticipants={allParticipants}
                                />
                            )}
                            {showSummary && (
                                <div className="h-full p-4 overflow-y-auto">
                                    <MeetingSummary chatMessages={chatMessages} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <MeetingControls
                isMuted={isMuted}
                isVideoOff={isVideoOff}
                isScreenSharing={isScreenSharing}
                isHandRaised={isHandRaised}
                onToggleMute={onToggleMute}
                onToggleVideo={onToggleVideo}
                onToggleScreenShare={onToggleScreenShare}
                onToggleHandRaise={onToggleHandRaise}
                onSendReaction={onSendReaction}
                onLeave={onLeave}
                toggleChat={handleToggleChat}
                togglePeople={togglePeople}
                toggleSummary={toggleSummary}
                toggleLayout={() => setShowLayoutModal(true)}
                showChat={showChat}
                showPeople={showPeople}
                showSummary={showSummary}
                hasUnreadMsg={hasUnreadMsg}
                allParticipants={allParticipants}
                meetingCode={meetingCode}
            />
        </div>
    );
};

export default MeetingRoom;
