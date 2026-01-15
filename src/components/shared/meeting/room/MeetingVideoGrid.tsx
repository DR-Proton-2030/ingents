"use client";
import React from "react";
import VideoTile from "./VideoTile";
import { ParticipantState, LayoutType } from "./types";

interface MeetingVideoGridProps {
    layout: LayoutType;
    allParticipants: ParticipantState[];
    pinnedPeerId: string | null;
    togglePin: (id: string) => void;
    isScreenSharing: boolean;
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

const MeetingVideoGrid: React.FC<MeetingVideoGridProps> = ({
    layout,
    allParticipants,
    pinnedPeerId,
    togglePin,
    isScreenSharing,
}) => {
    if (allParticipants.length === 0) return null;

    if (allParticipants.length === 1) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#202124] rounded-[18px] overflow-hidden shadow-inner">
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
                    videoFilter={allParticipants[0].videoFilter}
                    videoBackground={allParticipants[0].videoBackground}
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
                        <div key={p.id} className="bg-[#202124] rounded-[18px] overflow-hidden shadow-lg aspect-video">
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
                                videoFilter={p.videoFilter}
                                videoBackground={p.videoBackground}
                            />
                        </div>
                    ))}
                </div>
            );

        case "spotlight":
            const mainPeer = pinnedPeerId ? allParticipants.find(p => p.id === pinnedPeerId) || allParticipants[0] : allParticipants[0];
            return (
                <div className="w-full h-full bg-[#202124] rounded-[18px] overflow-hidden relative shadow-2xl">
                    <VideoTile
                        id={mainPeer.id}
                        stream={mainPeer.stream}
                        name={mainPeer.name}
                        isLocal={mainPeer.isLocal}
                        isVideoOff={mainPeer.isVideoOff}
                        isMuted={mainPeer.isMuted}
                        isScreenSharing={mainPeer.isLocal && isScreenSharing}
                        avatarColor={avatarColors[allParticipants.indexOf(mainPeer) % avatarColors.length]}
                        isPinned={pinnedPeerId === mainPeer.id}
                        onTogglePin={() => togglePin(mainPeer.id)}
                        reaction={mainPeer.reaction}
                        isHandRaised={mainPeer.isHandRaised}
                        videoFilter={mainPeer.videoFilter}
                        videoBackground={mainPeer.videoBackground}
                    />
                </div>
            );

        case "sidebar":
            const featuredPeer = pinnedPeerId ? allParticipants.find(p => p.id === pinnedPeerId) || allParticipants[0] : allParticipants[0];
            const others = allParticipants.filter(p => p.id !== featuredPeer.id);
            return (
                <div className="w-full h-full flex gap-2 p-2">
                    <div className="flex-[3] bg-[#202124] rounded-[18px] overflow-hidden shadow-2xl">
                        <VideoTile
                            id={featuredPeer.id}
                            stream={featuredPeer.stream}
                            name={featuredPeer.name}
                            isLocal={featuredPeer.isLocal}
                            isVideoOff={featuredPeer.isVideoOff}
                            isMuted={featuredPeer.isMuted}
                            isScreenSharing={featuredPeer.isLocal && isScreenSharing}
                            avatarColor={avatarColors[allParticipants.indexOf(featuredPeer) % avatarColors.length]}
                            isPinned={pinnedPeerId === featuredPeer.id}
                            onTogglePin={() => togglePin(featuredPeer.id)}
                            reaction={featuredPeer.reaction}
                            isHandRaised={featuredPeer.isHandRaised}
                            videoFilter={featuredPeer.videoFilter}
                            videoBackground={featuredPeer.videoBackground}
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar">
                        {others.map((p, i) => (
                            <div key={p.id} className="aspect-video bg-[#202124] rounded-[18px] overflow-hidden flex-shrink-0 shadow-lg border border-white/5">
                                <VideoTile
                                    id={p.id}
                                    stream={p.stream}
                                    name={p.name}
                                    isLocal={p.isLocal}
                                    isVideoOff={p.isVideoOff}
                                    isMuted={p.isMuted}
                                    isScreenSharing={p.isLocal && isScreenSharing}
                                    avatarColor={avatarColors[allParticipants.indexOf(p) % avatarColors.length]}
                                    isPinned={pinnedPeerId === p.id}
                                    onTogglePin={() => togglePin(p.id)}
                                    reaction={p.reaction}
                                    isHandRaised={p.isHandRaised}
                                    videoFilter={p.videoFilter}
                                    videoBackground={p.videoBackground}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );

        default: // "auto"
            if (allParticipants.length <= 4) {
                return (
                    <div className={`w-full h-full grid gap-4 p-4 ${allParticipants.length <= 2 ? "grid-cols-2" : "grid-cols-2 grid-rows-2"}`}>
                        {allParticipants.map((p, i) => (
                            <div key={p.id} className="bg-[#202124] rounded-[18px] overflow-hidden shadow-xl aspect-video border border-white/5">
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
                                    videoFilter={p.videoFilter}
                                    videoBackground={p.videoBackground}
                                />
                            </div>
                        ))}
                    </div>
                );
            }
            // More than 4: Spotlight the active speaker or pinned person
            const activePeer = pinnedPeerId ? allParticipants.find(p => p.id === pinnedPeerId) || allParticipants[0] : allParticipants[0];
            const sidePeers = allParticipants.filter(p => p.id !== activePeer.id);
            return (
                <div className="w-full h-full flex gap-3 p-3">
                    <div className="flex-[4] bg-[#202124] rounded-[18px] overflow-hidden shadow-2xl border border-white/5">
                        <VideoTile
                            id={activePeer.id}
                            stream={activePeer.stream}
                            name={activePeer.name}
                            isLocal={activePeer.isLocal}
                            isVideoOff={activePeer.isVideoOff}
                            isMuted={activePeer.isMuted}
                            isScreenSharing={activePeer.isLocal && isScreenSharing}
                            avatarColor={avatarColors[allParticipants.indexOf(activePeer) % avatarColors.length]}
                            isPinned={pinnedPeerId === activePeer.id}
                            onTogglePin={() => togglePin(activePeer.id)}
                            reaction={activePeer.reaction}
                            isHandRaised={activePeer.isHandRaised}
                            videoFilter={activePeer.videoFilter}
                            videoBackground={activePeer.videoBackground}
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-3 min-w-[200px] overflow-y-auto pr-1">
                        {sidePeers.map((p, i) => (
                            <div key={p.id} className="aspect-video bg-[#202124] rounded-[18px] overflow-hidden flex-shrink-0 shadow-lg border border-white/5">
                                <VideoTile
                                    id={p.id}
                                    stream={p.stream}
                                    name={p.name}
                                    isLocal={p.isLocal}
                                    isVideoOff={p.isVideoOff}
                                    isMuted={p.isMuted}
                                    isScreenSharing={p.isLocal && isScreenSharing}
                                    avatarColor={avatarColors[allParticipants.indexOf(p) % avatarColors.length]}
                                    isPinned={pinnedPeerId === p.id}
                                    onTogglePin={() => togglePin(p.id)}
                                    reaction={p.reaction}
                                    isHandRaised={p.isHandRaised}
                                    videoFilter={p.videoFilter}
                                    videoBackground={p.videoBackground}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );
    }
};

export default MeetingVideoGrid;
