"use client";
import React, { useRef, useEffect } from "react";
import {
    Calendar,
    Clock,
    Users,
    ShieldCheck,
    Video,
    Mic,
    MicOff,
    VideoOff,
    Wand2,
    Lock,
    Settings,
    ChevronRight,
    Monitor
} from "lucide-react";
import { MeetingDetails, Participant } from "@/utils/api/meeting/meeting.api";

interface MeetingLobbyProps {
    meetingCode: string;
    localStream: MediaStream | null;
    meetingInfo: MeetingDetails | null;
    participants: Participant[];
    activeParticipants: any[];
    currentUser: { id: string; name: string; email: string };
    isFetchingInfo: boolean;
    isMuted: boolean;
    isVideoOff: boolean;
    isLoading: boolean;
    statusMsg: string;
    isPeerJsLoaded: boolean;
    onToggleMute: () => void;
    onToggleVideo: () => void;
    onJoin: () => void;
    hasJoined?: boolean;
}

const avatarColors = [
    "bg-[#3B82F6]",
    "bg-[#10B981]",
    "bg-[#F59E0B]",
    "bg-[#6366F1]",
    "bg-[#EC4899]",
    "bg-[#8B5CF6]",
];

export const MeetingLobby: React.FC<MeetingLobbyProps> = ({
    meetingCode,
    localStream,
    meetingInfo,
    participants,
    activeParticipants,
    currentUser,
    isFetchingInfo,
    isMuted,
    isVideoOff,
    isLoading,
    statusMsg,
    isPeerJsLoaded,
    onToggleMute,
    onToggleVideo,
    onJoin,
    hasJoined = false,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [copied, setCopied] = React.useState(false);

    useEffect(() => {
        if (videoRef.current && localStream) {
            videoRef.current.srcObject = localStream;
        }
    }, [localStream, isVideoOff]);

    const formatMeetingDate = (dateString: string) => {
        if (!dateString) return "Today";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    const formatMeetingTime = (dateString: string) => {
        if (!dateString) return "Now";
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F9FB] text-[#1E293B] font-sans selection:bg-orange-500/10">
            {/* Minimal Top Bar */}


            {/* Main Area */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left: Video & Controls */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-[#F8F9FB] relative">
                    {/* Decorative blurred background shapes */}
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-100 rounded-full blur-[100px] opacity-20 pointer-events-none" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-20 pointer-events-none" />

                    <div className="w-full max-w-[750px] z-10">
                        {/* Video Wrapper */}
                        <div className="relative group">
                            {/* Subtle Inner Glow */}
                            {/* <div className="absolute -inset-4 bg-orange-500/[0.03] rounded-[40px] blur-3xl pointer-events-none group-hover:bg-orange-500/[0.05] transition-all duration-700" /> */}

                            <div className="relative aspect-video shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)]  rounded-[22px] bg-[#1E2124] overflow-hidden  group flex items-center justify-center">
                                {/* Video Surface */}
                                {localStream ? (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className={`w-full h-full object-cover scale-x-[-1] transition-all duration-1000 ${isVideoOff ? "opacity-0 scale-100" : "opacity-100 scale-100"}`}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-4 animate-pulse">
                                        <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Initializing Stream</span>
                                    </div>
                                )}

                                {/* Cinematic Vignette Overlay */}
                                <div className="absolute inset-0 pointer-events-none z-0">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10" />
                                    {/* <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_40%,_rgba(0,0,0,0.3)_100%)]" /> */}
                                </div>

                                {/* Camera Off State */}
                                {isVideoOff && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 border border-gray-100 flex items-center justify-center shadow-sm transition-transform duration-500 group-hover:scale-105">
                                            <span className="text-5xl text-gray-100 font-bold">
                                                {currentUser.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="mt-8 text-gray-400 text-xs font-semibold ">Camera is Disconnected</p>
                                    </div>
                                )}

                                {/* Floating Labels */}
                                <div className="absolute top-6 left-6 flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 shadow-lg">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Preview Mode</span>
                                    </div>
                                    {isMuted && (
                                        <div className="px-3 py-1.5 bg-red-500/10 backdrop-blur-md rounded-lg border border-red-500/20 text-red-600 text-[10px] font-bold uppercase tracking-wider">
                                            Microphone Muted
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-4">
                                    <button
                                        onClick={onToggleMute}
                                        className={`group w-14 h-14 rounded-full cursor-pointer flex shadow-sm shadow-black/80 items-center justify-center transition-all duration-300 border ${isMuted
                                            ? "bg-red-600 text-white hover:bg-red-500 "
                                            : "bg-transparent backdrop-blur-sm border-white text-white hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 "
                                            }`}
                                    >
                                        {isMuted ? <MicOff className="w-6 h-6 stroke-[1.5]" /> : <Mic className="w-6 h-6 stroke-[1.5]" />}
                                    </button>

                                    <button
                                        onClick={onToggleVideo}
                                        className={`group w-14 h-14 rounded-full cursor-pointer flex items-center  shadow-sm shadow-black/80 justify-center transition-all duration-300 border ${isVideoOff
                                            ? "bg-red-600 text-white hover:bg-red-500 "
                                            : "bg-transparent backdrop-blur-sm border-white text-white hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 "
                                            }`}
                                    >
                                        {isVideoOff ? <VideoOff className="w-6 h-6 stroke-[1.5]" /> : <Video className="w-6 h-6 stroke-[1.5]" />}
                                    </button>


                                </div>
                            </div>

                            {/* Control Pill */}

                        </div>
                    </div>
                </div>

                {/* Right: Join Panel */}
                <div className="w-[450px] bg-gray-100 border-l border-gray-100 flex flex-col ">
                    {/* Upper Section */}
                    <div className="p-10 flex-1 overflow-y-auto scrollbar-hide">
                        {isFetchingInfo ? (
                            <div className="h-full flex flex-col items-center justify-center gap-6 animate-in fade-in duration-700">
                                <div className="w-8 h-8 border-[3px] border-orange-500/10 border-t-orange-500 rounded-full animate-spin" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Connecting</span>
                            </div>
                        ) : (
                            <div className="space-y-10 animate-in slide-in-from-right-4 duration-700">
                                {/* Meeting Meta */}
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-orange-50 border border-orange-100 rounded-full">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgb(249,115,22,0.4)]" />
                                        <span className="text-[9px] font-black uppercase text-orange-600 tracking-wider">Scheduled Session</span>
                                    </div>
                                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                        {meetingInfo?.title || "Meeting Lobby"}
                                    </h1>
                                    {meetingInfo?.description && (
                                        <p className="text-gray-500 text-[15px] font-medium leading-relaxed">
                                            {meetingInfo.description}
                                        </p>
                                    )}
                                </div>

                                {/* Logistics Cards */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-gray-50 border border-transparent rounded-2xl flex flex-col gap-1 hover:border-orange-200 hover:bg-orange-50/10 transition-all duration-300">
                                        <Clock className="w-3.5 h-3.5 text-gray-400 mb-1" />
                                        <span className="text-xs font-bold text-gray-900">
                                            {formatMeetingTime(meetingInfo?.scheduled_start_time || "")}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Session Start</span>
                                    </div>
                                    <div className="p-4 bg-gray-50 border border-transparent rounded-2xl flex flex-col gap-1 hover:border-orange-200 hover:bg-orange-50/10 transition-all duration-300">
                                        <Users className="w-3.5 h-3.5 text-gray-400 mb-1" />
                                        <span className="text-xs font-bold text-gray-900">
                                            {activeParticipants.length} Active
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">In Meeting</span>
                                    </div>
                                </div>

                                {/* Participants Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                                            {activeParticipants.length > 0 ? "Already in the meeting" : "Invited Participants"}
                                        </span>
                                        <div className="h-px flex-1 mx-4 bg-gray-100" />
                                    </div>

                                    <div className="space-y-3">
                                        {activeParticipants.length > 0 ? (
                                            activeParticipants.map((p, i) => (
                                                <div key={p.peerId} className="flex items-center gap-3 p-3 bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-2xl group transition-all hover:border-orange-200 hover:bg-orange-50/10">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-lg overflow-hidden relative ${avatarColors[i % avatarColors.length]}`}>
                                                        {p.userName.charAt(0).toUpperCase()}
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[13px] font-bold text-gray-900 truncate">{p.userName}</p>
                                                        <p className="text-[9px] text-green-600 font-black uppercase tracking-widest">Active Now</p>
                                                    </div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                {meetingInfo?.host_details && (
                                                    <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-2xl group transition-all hover:border-orange-200 hover:bg-orange-50/10">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-xs font-bold text-white shadow-lg overflow-hidden relative">
                                                            {meetingInfo.host_details.full_name.charAt(0)}
                                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[13px] font-bold text-gray-900 truncate">{meetingInfo.host_details.full_name}</p>
                                                            <p className="text-[9px] text-orange-600 font-black uppercase tracking-widest">Meeting Host</p>
                                                        </div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2 px-2 pt-1">
                                                    <div className="flex -space-x-3">
                                                        {participants.slice(0, 5).map((p, i) => (
                                                            <div
                                                                key={p._id}
                                                                className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-black shadow-md ${avatarColors[i % avatarColors.length]}`}
                                                            >
                                                                {(p.user_details?.full_name || p.external_name || "?").charAt(0)}
                                                            </div>
                                                        ))}
                                                        {participants.length > 5 && (
                                                            <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-gray-500 text-[9px] font-black shadow-sm">
                                                                +{participants.length - 5}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <ChevronRight className="w-3 h-3 text-gray-300 ml-auto" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Lower Section: Controls */}
                    <div className="p-8 space-y-6 bg-gray-50/50 border-t border-gray-100">
                        <div className="space-y-4">
                            {/* Copy Join Link - Hidden after join */}
                            {!hasJoined && (
                                <button
                                    onClick={() => {
                                        const code = meetingInfo?.meeting_code || meetingCode;
                                        const joinLink = `https://ingents.ai/meeting/${code}`;
                                        navigator.clipboard.writeText(joinLink);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="group relative w-full h-12 bg-gray-100 text-gray-700 font-semibold rounded-xl
                                     flex items-center justify-center gap-2 transition-all duration-300 hover:bg-gray-200 active:scale-[0.98] shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-[13px] font-black">
                                        {copied ? "Link Copied!" : "Copy Join Link"}
                                    </span>
                                </button>
                            )}

                            <button
                                onClick={onJoin}
                                disabled={!isPeerJsLoaded || !localStream || isLoading}
                                className="group relative w-full h-14 bg-black/80 text-white font-bold rounded-xl
                                 flex items-center justify-center gap-3 transition-all duration-300 hover:bg-orange-500 disabled:opacity-30 disabled:hover:bg-gray-900 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] hover:shadow-orange-500/20 active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : !isPeerJsLoaded ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span className="text-[13px] font-black">Initializing PeerJS...</span>
                                    </div>
                                ) : !localStream ? (
                                    <span className="text-[13px] font-black">Waiting for Camera...</span>
                                ) : (
                                    <>
                                        <span className="text-[13px] font-black">Join Meeting</span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </>
                                )}
                            </button>

                            {statusMsg && (
                                <p className="text-center text-xs font-medium text-red-500 animate-pulse">
                                    {statusMsg}
                                </p>
                            )}


                            {/* Security Footer */}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                                    <Lock className="w-3 h-3" />
                                    End-to-End Encryption
                                </div>
                                <ShieldCheck className="w-4 h-4 text-green-500 opacity-60" />
                            </div>
                        </div>


                    </div>
                </div>
            </main>
        </div>
    );
};

export default MeetingLobby;
