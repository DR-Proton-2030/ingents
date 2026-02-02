import React, { useEffect, useRef, useState } from "react";
import { Phone, PhoneOff, Mic, MicOff, Video as VideoIcon, VideoOff, X, Minus, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { IUser } from "@/types/interface/user.interface";

interface CallOverlayProps {
    isOpen: boolean;
    type: "audio" | "video";
    status: "calling" | "incoming" | "connected" | "ended";
    user: IUser | null;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    onAccept: () => void;
    onDecline: () => void;
    onEnd: () => void;
    isMuted: boolean;
    setIsMuted: (val: boolean) => void;
    isVideoOff: boolean;
    setIsVideoOff: (val: boolean) => void;
}

const CallOverlay: React.FC<CallOverlayProps> = ({
    isOpen,
    type,
    status,
    user,
    localStream,
    remoteStream,
    onAccept,
    onDecline,
    onEnd,
    isMuted,
    setIsMuted,
    isVideoOff,
    setIsVideoOff,
}) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [timer, setTimer] = useState(0);
    const [isRemoteVideoActive, setIsRemoteVideoActive] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === "connected") {
            interval = setInterval(() => setTimer(prev => prev + 1), 1000);
        } else {
            setTimer(0);
        }
        return () => clearInterval(interval);
    }, [status]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, isOpen, status, isVideoOff, isMinimized]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
            // Immediate check
            setIsRemoteVideoActive(remoteStream.getVideoTracks().some(t => t.enabled && t.readyState === 'live'));
        }

        const handleTrackChange = () => {
            const hasVideo = remoteStream?.getVideoTracks().some(t => t.enabled && t.readyState === 'live');
            setIsRemoteVideoActive(!!hasVideo);
        };

        if (remoteStream) {
            remoteStream.getTracks().forEach(track => {
                track.addEventListener('mute', handleTrackChange);
                track.addEventListener('unmute', handleTrackChange);
                track.addEventListener('ended', handleTrackChange);
            });
            remoteStream.addEventListener('addtrack', handleTrackChange);
            remoteStream.addEventListener('removetrack', handleTrackChange);
        }

        const interval = setInterval(handleTrackChange, 1000);
        return () => {
            clearInterval(interval);
            if (remoteStream) {
                remoteStream.getTracks().forEach(track => {
                    track.removeEventListener('mute', handleTrackChange);
                    track.removeEventListener('unmute', handleTrackChange);
                    track.removeEventListener('ended', handleTrackChange);
                });
                remoteStream.removeEventListener('addtrack', handleTrackChange);
                remoteStream.removeEventListener('removetrack', handleTrackChange);
            }
        };
    }, [remoteStream, isOpen, status, isMinimized]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            >
                <motion.div
                    layout
                    drag
                    dragMomentum={false}
                    dragElastic={0.1}
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{
                        scale: 1,
                        y: 0,
                        width: isMinimized ? 320 : 420
                    }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-[#111318] rounded-[24px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/5 flex flex-col pointer-events-auto cursor-grab active:cursor-grabbing"
                >
                    {/* Header */}
                    <div className="px-5 h-12 flex items-center justify-between border-b border-white/[0.04]">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🚀</span>
                            <span className="text-[13px] font-semibold text-white/90">
                                {isMinimized ? "Inbound" : "Customer support"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[12px] text-white/50 font-medium">
                                {status === "calling" ? (isMinimized ? "Ringing..." : "Calling...") :
                                    status === "incoming" ? "Incoming" :
                                        status === "connected" ? formatTime(timer) : "Ended"}
                            </span>
                            <div className="flex items-center gap-1 border-l border-white/5 ml-1 pl-2">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-1.5 text-white/30 hover:text-white hover:bg-white/5 rounded-md transition-all"
                                >
                                    {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                                </button>
                                <button onClick={onDecline} className="p-1.5 text-white/30 hover:text-white hover:bg-white/5 rounded-md transition-all">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {!isMinimized ? (
                        <>
                            {/* Full Content */}
                            <div className="pt-10 pb-12 flex flex-col items-center relative">
                                {/* Avatar / Remote Video */}
                                <div className="relative mb-6">
                                    <div className="h-56 w-[400px] rounded-lg overflow-hidden border-2 border-white/10 ring-8 ring-white/5 relative bg-[#1A1D24]">
                                        {user?.profile_picture ? (
                                            <img src={user.profile_picture} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <span className="text-3xl font-bold text-white/50">{user?.full_name?.charAt(0)}</span>
                                            </div>
                                        )}
                                        <div className={cn(
                                            "absolute inset-0 z-10 bg-black transition-opacity duration-500",
                                            isRemoteVideoActive && status === "connected" && type === "video" ? "opacity-100" : "opacity-0 pointer-events-none"
                                        )}>
                                            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>

                                <h2 className="text-[22px] font-bold text-white mb-1.5">{user?.full_name}</h2>
                                <p className="text-[15px] text-white/40 font-medium text-center px-8">
                                    {status === "incoming" ? `is calling Customer support` :
                                        status === "calling" ? "Connecting..." :
                                            status === "connected" ? (type === "video" ? (isRemoteVideoActive ? "Video session active" : "Audio session (Camera off)") : "Audio session active") : "Call ended"}
                                </p>

                                {status === "connected" && type === "video" && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute bottom-4 right-6 w-24 h-32 bg-[#1A1D24] rounded-xl border border-white/10 overflow-hidden shadow-2xl z-20 flex items-center justify-center"
                                    >
                                        {!isVideoOff ? (
                                            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 opacity-40">
                                                <VideoOff className="h-6 w-6 text-white" />
                                                <span className="text-[8px] font-bold text-white uppercase tracking-wider">Off</span>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>

                            {/* Full Controls */}
                            <div className="px-6 pb-8">
                                <AnimatePresence mode="wait">
                                    {status === "incoming" ? (
                                        <motion.div key="in-btns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                                            <button onClick={onDecline} className="flex-1 h-[52px] bg-[#EE4524] rounded-[14px] flex items-center justify-center gap-3 text-white font-bold transition-all active:scale-[0.98]">
                                                <PhoneOff className="h-5 w-5 fill-current" /> Decline
                                            </button>
                                            <button onClick={onAccept} className="flex-1 h-[52px] bg-[#0EBD55] rounded-[14px] flex items-center justify-center gap-3 text-white font-bold transition-all active:scale-[0.98]">
                                                <Phone className="h-5 w-5 fill-current" /> Accept
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="con-btns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                                            <button onClick={() => setIsMuted(!isMuted)} className={cn("h-[52px] w-[52px] rounded-[14px] flex items-center justify-center transition-all", isMuted ? "bg-red-500/20 text-red-500" : "bg-white/5 text-white hover:bg-white/10")}>
                                                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                                            </button>
                                            {type === "video" && (
                                                <button onClick={() => setIsVideoOff(!isVideoOff)} className={cn("h-[52px] w-[52px] rounded-[14px] flex items-center justify-center transition-all", isVideoOff ? "bg-red-500/20 text-red-500" : "bg-white/5 text-white hover:bg-white/10")}>
                                                    {isVideoOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
                                                </button>
                                            )}
                                            <button onClick={onEnd} className="flex-1 h-[52px] bg-red-500 hover:bg-red-600 rounded-[14px] flex items-center justify-center gap-3 text-white font-bold transition-all active:scale-[0.98]">
                                                <PhoneOff className="h-5 w-5 fill-current" /> End Call
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <div className="p-4 flex flex-col gap-4">
                            <div className="flex items-center gap-3 px-1">
                                <div className="h-12 w-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                                    {user?.profile_picture ? (
                                        <img src={user.profile_picture} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-white/5 flex items-center justify-center">
                                            <span className="text-xl font-bold text-white/50">{user?.full_name?.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col truncate">
                                    <span className="text-[15px] font-bold text-white truncate leading-tight">{user?.full_name}</span>
                                    <span className="text-[12px] text-white/40 font-medium">(219) 555-0114</span>
                                </div>
                            </div>
                            <button
                                onClick={onEnd}
                                className="w-full h-[46px] bg-[#EE4524] hover:bg-[#D93D1E] rounded-full flex items-center justify-center text-white font-bold text-[15px] transition-all active:scale-[0.96]"
                            >
                                End
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CallOverlay;
