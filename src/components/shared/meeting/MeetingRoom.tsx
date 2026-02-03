"use client";
import React, { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { MeetingDetails, Participant as MeetingParticipant } from "@/utils/api/meeting/meeting.api";

// Sub-components
import VideoTile from "./room/VideoTile";
import MeetingChat from "./room/MeetingChat";
import MeetingPeople from "./room/MeetingPeople";
import MeetingSummary from "./room/MeetingSummary";
import MeetingVisualEffects from "./room/MeetingVisualEffects";
import MeetingControls from "./room/MeetingControls";
import MeetingVideoGrid from "./room/MeetingVideoGrid";
import MeetingLayoutModal from "./room/MeetingLayoutModal";
import MeetingSettingsModal from "./room/MeetingSettingsModal";
import { RoomSettings, handleAdmission } from "@/lib/meeting.firebase";
import { toast } from "react-toastify";
import { Check, X as XIcon, Users } from "lucide-react";

// Types
import { PeerStream, ChatMessage, LayoutType, ParticipantState, TranscriptEntry } from "./room/types";

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
    isTranscriptionActive: boolean;
    onToggleTranscription: () => void;
    transcripts: TranscriptEntry[];
    videoFilter: string;
    videoBackground: string;
    onApplyVisualEffect: (type: "filter" | "background", effectId: string) => void;
    // Host Controls
    isHost: boolean;
    roomSettings: RoomSettings;
    onUpdateRoomSettings: (settings: Partial<RoomSettings>) => void;
    onMuteAll: () => void;
    waitingQueue: any[];
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
    isTranscriptionActive,
    onToggleTranscription,
    transcripts,
    videoFilter,
    videoBackground,
    onApplyVisualEffect,
    isHost,
    roomSettings,
    onUpdateRoomSettings,
    onMuteAll,
    waitingQueue
}) => {
    // State
    const [layout, setLayout] = useState<LayoutType>("sidebar");
    const [showPeople, setShowPeople] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [showVisualEffects, setShowVisualEffects] = useState(false);
    const [pinnedPeerId, setPinnedPeerId] = useState<string | null>(null);
    const [showLayoutModal, setShowLayoutModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    // Refs
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Close all panels
    const closeAllPanels = () => {
        if (showChat) onToggleChat();
        setShowPeople(false);
        setShowSummary(false);
        setShowVisualEffects(false);
        setShowSettingsModal(false);
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

    const toggleVisualEffects = () => {
        if (!showVisualEffects) {
            closeAllPanels();
        }
        setShowVisualEffects(!showVisualEffects);
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
            isHandRaised: isHandRaised,
            isScreenSharing: isScreenSharing,
            videoFilter: videoFilter,
            videoBackground: videoBackground
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
                isScreenSharing: !!p.isScreenSharing,
                videoFilter: p.videoFilter || "none",
                videoBackground: p.videoBackground || "none"
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

    // --- Admission Popups ---
    useEffect(() => {
        if (!isHost || waitingQueue.length === 0) return;

        console.log("MeetingRoom: Host detected waiting participants:", waitingQueue.length);

        // Show toast for the latest waiting participant
        const latest = waitingQueue[waitingQueue.length - 1];
        const toastId = `admit-${latest.peerId}`;

        toast.info(
            <div className="flex flex-col gap-3 p-4 bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">Entry Request</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                            <span className="font-bold text-orange-600">{latest.userName}</span> wants to join.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 pt-1">
                    <button
                        onClick={() => {
                            handleAdmission(meetingCode, latest.peerId, "active");
                            toast.dismiss(toastId);
                        }}
                        className="flex-1 py-2 bg-gray-900 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-gray-800 transition-all shadow-sm"
                    >
                        <Check className="w-3.5 h-3.5" /> Admit
                    </button>
                    <button
                        onClick={() => {
                            handleAdmission(meetingCode, latest.peerId, "denied");
                            toast.dismiss(toastId);
                        }}
                        className="flex-1 py-2 bg-gray-100 text-gray-700 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-gray-200 transition-all"
                    >
                        <XIcon className="w-3.5 h-3.5" /> Deny
                    </button>
                </div>
            </div>,
            {
                toastId: toastId,
                autoClose: false,
                closeButton: false,
                position: "bottom-left",
                className: "p-0 overflow-hidden rounded-2xl border-none shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-transparent",
                icon: false
            }
        );
    }, [waitingQueue, isHost, meetingCode]);

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

            {/* Settings Modal */}
            {showSettingsModal && isHost && (
                <MeetingSettingsModal
                    settings={roomSettings}
                    onUpdateSettings={onUpdateRoomSettings}
                    onMuteAll={onMuteAll}
                    onClose={() => setShowSettingsModal(false)}
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
                    />
                </div>

                {/* Right Panels */}
                {(showPeople || showChat || showSummary || showVisualEffects) && (
                    <div className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg flex flex-col animate-in slide-in-from-right-4 duration-300 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 leading-none">
                                {showPeople ? "People" : showChat ? "In-call messages" : showSummary ? "AI Summary" : "Visual effects"}
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
                                    <MeetingSummary transcripts={transcripts} />
                                </div>
                            )}
                            {showVisualEffects && (
                                <div className="h-full overflow-hidden">
                                    <MeetingVisualEffects
                                        onClose={() => setShowVisualEffects(false)}
                                        onApplyFilter={(id) => onApplyVisualEffect("filter", id)}
                                        onApplyBackground={(id) => onApplyVisualEffect("background", id)}
                                        currentFilter={videoFilter}
                                        currentBackground={videoBackground}
                                    />
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
                meetingTitle={meetingInfo?.title}
                isTranscriptionActive={isTranscriptionActive}
                onToggleTranscription={onToggleTranscription}
                onToggleVisualEffects={toggleVisualEffects}
                showVisualEffects={showVisualEffects}
                toggleSettings={() => setShowSettingsModal(true)}
            />
        </div>
    );
};

export default MeetingRoom;
