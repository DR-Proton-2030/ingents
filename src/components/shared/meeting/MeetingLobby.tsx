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
        <div className="min-h-screen flex flex-col bg-[#0a0f16] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none" />

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
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    Offline
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="flex flex-col lg:flex-row gap-12 w-full max-w-6xl items-center justify-center">
                    {/* Video Preview */}
                    <div className="relative w-full max-w-2xl group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />

                        <div className="relative bg-[#050910] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                            {/* Header Strip */}
                            <div className="absolute top-0 left-0 right-0 h-8 bg-black/60 backdrop-blur-sm border-b border-white/10 z-20 flex items-center justify-between px-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[10px] font-mono text-slate-300 tracking-widest uppercase">
                                        Live Feed // Preview
                                    </span>
                                </div>
                            </div>

                            {/* Video Element */}
                            <div className="relative aspect-video bg-black/80">
                                {/* Scanlines Effect */}
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)] opacity-20 pointer-events-none z-10" />

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
                                        <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}

                                {isVideoOff && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                                        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center">
                                            <span className="text-4xl text-slate-500">👤</span>
                                        </div>
                                    </div>
                                )}

                                {/* Corner Reticles */}
                                <div className="absolute top-10 left-4 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50 z-10" />
                                <div className="absolute top-10 right-4 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50 z-10" />
                                <div className="absolute bottom-20 left-4 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50 z-10" />
                                <div className="absolute bottom-20 right-4 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50 z-10" />
                            </div>

                            {/* Control Buttons */}
                            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/90 to-transparent z-20 flex items-center justify-center gap-6 pb-2">
                                <button
                                    onClick={onToggleMute}
                                    className={`p-4 rounded-xl border backdrop-blur-md transition-all duration-300 ${isMuted
                                        ? "bg-red-500/20 border-red-500 text-red-400"
                                        : "bg-slate-800/60 border-slate-600 text-slate-200 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-300"
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
                                    className={`p-4 rounded-xl border backdrop-blur-md transition-all duration-300 ${isVideoOff
                                        ? "bg-red-500/20 border-red-500 text-red-400"
                                        : "bg-slate-800/60 border-slate-600 text-slate-200 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-300"
                                        }`}
                                >
                                    {isVideoOff ? (
                                        <VideoOff className="w-5 h-5" />
                                    ) : (
                                        <Video className="w-5 h-5" />
                                    )}
                                </button>

                                <button className="p-4 rounded-xl border backdrop-blur-md bg-slate-800/60 border-slate-600 text-slate-200 hover:bg-purple-500/20 hover:border-purple-400 hover:text-purple-300 transition-all duration-300">
                                    <Wand2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Join Form */}
                    <div className="w-full max-w-md">
                        <div className="bg-[#050910]/80 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
                            {/* Top Gradient Line */}
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-cyan-950/50 rounded border border-cyan-800 text-cyan-400">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white tracking-wide">
                                        READY TO JOIN
                                    </h2>
                                </div>
                                <p className="text-slate-400 text-sm">
                                    You&apos;re about to join a secure peer-to-peer video meeting.
                                </p>
                            </div>

                            {isLoading ? (
                                <div className="py-10 flex flex-col items-center justify-center text-center">
                                    <div className="relative w-16 h-16 mb-6">
                                        <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                                        <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        CONNECTING
                                    </h3>
                                    <p className="text-xs font-mono text-cyan-500 animate-pulse">
                                        {statusMsg || "Establishing connection..."}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Meeting Code Input (Disabled) */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            Meeting Code
                                        </label>
                                        <div className="flex items-center bg-[#0a0f16] border border-slate-700 rounded-lg overflow-hidden">
                                            <div className="pl-4 pr-3 text-slate-500">#</div>
                                            <input
                                                type="text"
                                                value={meetingCode}
                                                disabled
                                                className="w-full bg-transparent border-none py-4 text-white/70 font-mono text-lg tracking-widest uppercase cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    {/* Join Button */}
                                    <button
                                        onClick={onJoin}
                                        disabled={!isPeerJsLoaded || !localStream}
                                        className="w-full group relative overflow-hidden rounded-lg bg-cyan-600 p-[1px] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#06B6D4_50%,#E2E8F0_100%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-8 py-4 text-sm font-bold text-white backdrop-blur-3xl transition-all group-hover:bg-cyan-950/80">
                                            <Video className="w-5 h-5 mr-2 text-cyan-400" />
                                            JOIN MEETING
                                        </span>
                                    </button>

                                    {statusMsg && (
                                        <div className="p-3 bg-red-900/20 border border-red-900/50 rounded flex items-center gap-2 text-red-400 text-xs font-mono">
                                            {statusMsg}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase">
                                <span>Encryption: AES-256</span>
                                <span className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    System Ready
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
