"use client";
import React, { useRef, useEffect } from "react";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Wand2,
    ShieldCheck,
} from "lucide-react";

interface MeetingLobbyProps {
    meetingCode: string;
    localStream: MediaStream | null;
    isMuted: boolean;
    isVideoOff: boolean;
    isLoading: boolean;
    statusMsg: string;
    isPeerJsLoaded: boolean;
    onToggleMute: () => void;
    onToggleVideo: () => void;
    onJoin: () => void;
}

export const MeetingLobby: React.FC<MeetingLobbyProps> = ({
    meetingCode,
    localStream,
    isMuted,
    isVideoOff,
    isLoading,
    statusMsg,
    isPeerJsLoaded,
    onToggleMute,
    onToggleVideo,
    onJoin,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && localStream) {
            videoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-amber-50">
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white/70 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl shadow-lg">
                        <Video className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg text-gray-800">Ingents Meet</span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    Ready to connect
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl items-center justify-center">
                    {/* Video Preview Card */}
                    <div className="w-full max-w-2xl">
                        <div className="rounded-[18px] bg-white/30 backdrop-blur-[10px] shadow-[1px_1px_10px_4px_rgba(0,0,0,0.04)] p-4 overflow-hidden">
                            {/* Video Container */}
                            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
                                {/* Live Badge */}
                                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-xs font-medium text-gray-700">
                                        Preview
                                    </span>
                                </div>

                                {localStream ? (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${isVideoOff ? "opacity-0" : "opacity-100"
                                            }`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}

                                {isVideoOff && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 flex items-center justify-center shadow-xl">
                                            <span className="text-3xl text-white font-semibold">
                                                {meetingCode.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Control Buttons */}
                            <div className="flex items-center justify-center gap-4 mt-4">
                                <button
                                    onClick={onToggleMute}
                                    className={`p-4 rounded-full transition-all duration-200 ${isMuted
                                            ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {isMuted ? (
                                        <MicOff className="w-5 h-5" />
                                    ) : (
                                        <Mic className="w-5 h-5" />
                                    )}
                                </button>

                                <button
                                    onClick={onToggleVideo}
                                    className={`p-4 rounded-full transition-all duration-200 ${isVideoOff
                                            ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {isVideoOff ? (
                                        <VideoOff className="w-5 h-5" />
                                    ) : (
                                        <Video className="w-5 h-5" />
                                    )}
                                </button>

                                <button className="p-4 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200">
                                    <Wand2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Join Form Card */}
                    <div className="w-full max-w-sm">
                        <div className="rounded-[18px] bg-white/30 backdrop-blur-[10px] shadow-[1px_1px_10px_4px_rgba(0,0,0,0.04)] p-6">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <ShieldCheck className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Ready to Join
                                    </h2>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    You&apos;re about to join a secure video meeting.
                                </p>
                            </div>

                            {isLoading ? (
                                <div className="py-8 flex flex-col items-center justify-center text-center">
                                    <div className="relative w-12 h-12 mb-4">
                                        <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
                                        <div className="absolute inset-0 border-t-4 border-orange-500 rounded-full animate-spin" />
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-800 mb-1">
                                        Connecting...
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {statusMsg || "Please wait"}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Meeting Code */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Meeting Code
                                        </label>
                                        <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl px-4 py-3">
                                            <span className="text-gray-400 mr-2">#</span>
                                            <input
                                                type="text"
                                                value={meetingCode}
                                                disabled
                                                className="w-full bg-transparent text-gray-700 font-mono text-sm cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    {/* Join Button */}
                                    <button
                                        onClick={onJoin}
                                        disabled={!isPeerJsLoaded || !localStream}
                                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                    >
                                        <Video className="w-5 h-5" />
                                        Join Meeting
                                    </button>

                                    {statusMsg && !isLoading && (
                                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs">
                                            {statusMsg}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-400">
                                <span>End-to-end encrypted</span>
                                <span className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Ready
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingLobby;
