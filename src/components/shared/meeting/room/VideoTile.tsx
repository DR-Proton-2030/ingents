"use client";
import React, { useRef, useEffect, useState } from "react";
import {
    MicOff,
    MoreVertical,
    Pin,
    PinOff,
} from "lucide-react";
import { UserHandUp } from "@solar-icons/react/ssr";
import { FaRegHandPaper } from "react-icons/fa";

interface VideoTileProps {
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
}

const VideoTile: React.FC<VideoTileProps> = ({
    id,
    stream,
    name,
    isLocal,
    isVideoOff,
    isMuted,
    isScreenSharing,
    avatarColor,
    isPinned,
    onTogglePin,
    reaction,
    isHandRaised
}) => {
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
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
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
                <div className="absolute bottom-2 right-2 p-1.5 bg-yellow-400 rounded-full z-10 shadow-lg border-2 border-white animate-pulse">
                    <FaRegHandPaper className="w-4 h-4 text-white" fill="white" />
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

export default VideoTile;
