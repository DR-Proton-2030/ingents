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
    Link as LinkIcon
} from "lucide-react";
import { MeetingDetails, Participant } from "@/utils/api/meeting/meeting.api";

interface MeetingLobbyProps {
    meetingCode: string;
    localStream: MediaStream | null;
    meetingInfo: MeetingDetails | null;
    participants: Participant[];
    isFetchingInfo: boolean;
    isMuted: boolean;
    isVideoOff: boolean;
    isLoading: boolean;
    statusMsg: string;
    isPeerJsLoaded: boolean;
    onToggleMute: () => void;
    onToggleVideo: () => void;
    onJoin: () => void;
}

// Avatar colors for participants
const avatarColors = [
    "bg-gradient-to-br from-indigo-500 to-purple-600",
    "bg-gradient-to-br from-emerald-500 to-teal-600",
    "bg-gradient-to-br from-orange-500 to-red-600",
    "bg-gradient-to-br from-cyan-500 to-blue-600",
    "bg-gradient-to-br from-pink-500 to-rose-600",
    "bg-gradient-to-br from-amber-500 to-yellow-600",
];

export const MeetingLobby: React.FC<MeetingLobbyProps> = ({
    meetingCode,
    localStream,
    meetingInfo,
    participants,
    isFetchingInfo,
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

    const formatMeetingDate = (dateString: string) => {
        if (!dateString) return "Today";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
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
        <div className="min-h-screen flex flex-col bg-[#F8F9FB]">
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl shadow-md">
                        <Video className="text-white w-5 h-5 shadow-sm" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-gray-900">
                        Ingents <span className="text-orange-500">Meet</span>
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                        System Ready
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-100 shadow-inner" />
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-[120px] -mr-64 -mt-64 z-0" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[120px] -ml-64 -mb-64 z-0" />

                <div className="flex flex-col lg:flex-row gap-12 w-full max-w-7xl items-stretch justify-center z-10">
                    {/* Left: Video Preview */}
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="relative group">
                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-orange-400/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative rounded-[32px] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
                                {/* Video Container */}
                                <div className="relative aspect-video bg-[#1A1C1E] rounded-[24px] overflow-hidden shadow-2xl">
                                    {/* Preview Label */}
                                    <div className="absolute top-5 left-5 z-20 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[11px] font-bold text-white uppercase tracking-widest">
                                            Live Preview
                                        </span>
                                    </div>

                                    {localStream ? (
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            muted
                                            playsInline
                                            className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-700 ${isVideoOff ? "opacity-0" : "opacity-100"}`}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                                        </div>
                                    )}

                                    {isVideoOff && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#2D3135] to-[#1A1C1E]">
                                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center shadow-2xl ring-8 ring-white/5 animate-in fade-in zoom-in duration-500">
                                                <span className="text-5xl text-white font-black drop-shadow-lg">
                                                    {(meetingInfo?.title || "M").charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="mt-6 text-gray-400 text-sm font-medium tracking-wide">Camera is off</p>
                                        </div>
                                    )}
                                </div>

                                {/* Controls */}
                                <div className="flex items-center justify-center gap-5 mt-8">
                                    <button
                                        onClick={onToggleMute}
                                        className={`group p-5 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 border ${isMuted
                                            ? "bg-red-50 to-red-100 text-red-600 border-red-200 shadow-lg shadow-red-200/50"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-100 shadow-sm"
                                            }`}
                                    >
                                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6 group-hover:text-orange-500 transition-colors" />}
                                    </button>

                                    <button
                                        onClick={onToggleVideo}
                                        className={`group p-5 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 border ${isVideoOff
                                            ? "bg-red-50 to-red-100 text-red-600 border-red-200 shadow-lg shadow-red-200/50"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-100 shadow-sm"
                                            }`}
                                    >
                                        {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6 group-hover:text-orange-500 transition-colors" />}
                                    </button>

                                    <button className="group p-5 rounded-2xl bg-white text-gray-400 hover:text-orange-500 hover:bg-gray-50 border border-gray-100 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95">
                                        <Wand2 className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Meeting Details Card */}
                    <div className="w-full lg:w-[480px] flex flex-col justify-center">
                        <div className="rounded-[40px] bg-white shadow-[0_30px_60px_rgba(0,0,0,0.06)] border border-white p-10 flex flex-col">
                            {isFetchingInfo ? (
                                <div className="py-20 flex flex-col items-center justify-center space-y-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest animate-pulse font-mono">Loading Meeting Details</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-10 text-center flex flex-col items-center">
                                        {/* Status Badge */}
                                        <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-100">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                                {meetingInfo?.status === "scheduled" ? "Scheduled" : "Live Now"}
                                            </span>
                                        </div>

                                        <h2 className="text-3xl font-extrabold text-gray-900 leading-[1.2] mb-4 tracking-tight">
                                            {meetingInfo?.title || "Ready to Join"}
                                        </h2>

                                        {meetingInfo?.description && (
                                            <p className="text-gray-500 text-base leading-relaxed max-w-[320px]">
                                                {meetingInfo.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Detailed Stats */}
                                    <div className="grid grid-cols-3 gap-3 mb-8">
                                        <div className="p-4 bg-[#F8F9FB] rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center group hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300">
                                            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center mb-2 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                                <Calendar className="w-4 h-4 text-orange-500" />
                                            </div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Date</p>
                                            <p className="text-[11px] font-bold text-gray-800">
                                                {formatMeetingDate(meetingInfo?.scheduled_start_time || "")}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-[#F8F9FB] rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center group hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300">
                                            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center mb-2 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                                <Clock className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Time</p>
                                            <p className="text-[11px] font-bold text-gray-800">
                                                {formatMeetingTime(meetingInfo?.scheduled_start_time || "")}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-[#F8F9FB] rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center group hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300">
                                            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center mb-2 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                            </div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Duration</p>
                                            <p className="text-[11px] font-bold text-gray-800">
                                                {meetingInfo?.duration_minutes || "30"} Mins
                                            </p>
                                        </div>
                                    </div>

                                    {/* Host & Info */}
                                    <div className="space-y-4 mb-10">
                                        {meetingInfo?.host_details && (
                                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-[24px] border border-gray-100 group hover:border-orange-200 hover:bg-orange-50/30 transition-all">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white text-lg font-black shadow-lg shadow-gray-200">
                                                    {meetingInfo.host_details.full_name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-0.5">Meeting Host</p>
                                                    <p className="text-base font-extrabold text-gray-900 truncate">{meetingInfo.host_details.full_name}</p>
                                                </div>
                                                <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[24px] border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                                                    <Users className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Participants</p>
                                                    <p className="text-sm font-bold text-gray-800">{participants.length > 0 ? `${participants.length} Invited` : "No participants yet"}</p>
                                                </div>
                                            </div>
                                            <div className="flex -space-x-2.5">
                                                {participants.slice(0, 3).map((p, i) => (
                                                    <div
                                                        key={p._id}
                                                        className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-black shadow-sm ring-1 ring-gray-100 ${avatarColors[i % avatarColors.length]}`}
                                                    >
                                                        {(p.user_details?.full_name || p.external_name || "?").charAt(0)}
                                                    </div>
                                                ))}
                                                {participants.length > 3 && (
                                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-gray-500 text-[10px] font-black shadow-sm ring-1 ring-gray-100">
                                                        +{participants.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Section */}
                                    <div className="space-y-4">
                                        <button
                                            onClick={onJoin}
                                            disabled={!isPeerJsLoaded || !localStream || isLoading}
                                            className="group relative w-full py-5 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black rounded-[24px] shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-4 overflow-hidden"
                                        >
                                            <div className="p-1.5 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform duration-500">
                                                {isLoading ? (
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Video className="w-5 h-5 shadow-sm" />
                                                )}
                                            </div>
                                            <span className="text-lg tracking-wide drop-shadow-sm">
                                                {isLoading ? "Joining Meeting..." : "Join Meeting Now"}
                                            </span>
                                        </button>

                                        <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest font-mono">
                                            Secure Meeting Code: {meetingCode}
                                        </p>

                                        {statusMsg && !isLoading && (
                                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold text-center">
                                                {statusMsg}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Trust Footer */}
                            <div className="mt-auto pt-8 flex justify-center gap-8 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                <span className="flex items-center gap-2 group cursor-help">
                                    <ShieldCheck className="w-4 h-4 text-green-500/50 group-hover:text-green-500 transition-colors" />
                                    Encrypted
                                </span>
                                <span className="flex items-center gap-2 group cursor-help">
                                    <LinkIcon className="w-4 h-4 text-blue-500/50 group-hover:text-blue-500 transition-colors" />
                                    Private
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
