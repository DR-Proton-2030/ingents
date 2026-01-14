"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import MeetingLobby from "@/components/shared/meeting/MeetingLobby";
import MeetingRoom from "@/components/shared/meeting/MeetingRoom";

declare global {
    interface Window {
        Peer: any;
    }
}

export interface PeerStream {
    peerId: string;
    stream: MediaStream;
    isVideoOff?: boolean;
    isMuted?: boolean;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
}

export default function MeetingPage() {
    const params = useParams();
    const router = useRouter();
    const meetingCode = params.meetingCode as string;

    // Connection State
    const [peerId, setPeerId] = useState<string>("");
    const [isInCall, setIsInCall] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");
    const [isPeerJsLoaded, setIsPeerJsLoaded] = useState(false);

    // Media State
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<PeerStream[]>([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // Chat State
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [hasUnreadMsg, setHasUnreadMsg] = useState(false);

    // Refs for stable state access in callbacks
    const peerRef = useRef<any>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const callsRef = useRef<any[]>([]);
    const dataConnsRef = useRef<any[]>([]);
    const connectedPeersRef = useRef<Set<string>>(new Set());
    const isMutedRef = useRef(false);
    const isVideoOffRef = useRef(false);
    const peerIdRef = useRef("");

    // Initialize media on mount
    useEffect(() => {
        const initMedia = async () => {
            try {
                setStatusMsg("Initializing Camera...");
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
                    audio: true,
                });
                setLocalStream(stream);
                localStreamRef.current = stream;
                setStatusMsg("");
            } catch (err: any) {
                console.error("Failed to get local stream", err);
                setStatusMsg(`Error: ${err.name}. Check camera permissions.`);
            }
        };

        initMedia();

        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => track.stop());
            }
            if (peerRef.current) {
                peerRef.current.destroy();
            }
        };
    }, []);

    // --- Peer Management Functions (Hoisted) ---
    function broadcastData(data: any) {
        dataConnsRef.current.forEach((conn) => {
            if (conn.open) conn.send(data);
        });
    }

    function removePeer(id: string) {
        setRemoteStreams((prev) => prev.filter((p) => p.peerId !== id));
        callsRef.current = callsRef.current.filter((c) => c.peer !== id);
        dataConnsRef.current = dataConnsRef.current.filter((c) => c.peer !== id);
        connectedPeersRef.current.delete(id);
    }

    function handleRemoteStream(peerId: string, stream: MediaStream) {
        setRemoteStreams((prev) => {
            if (prev.find((p) => p.peerId === peerId)) return prev;
            return [...prev, { peerId, stream, isVideoOff: false, isMuted: false }];
        });
    }

    function subscribeToCallEvents(call: any) {
        call.on("stream", (remoteStream: MediaStream) => {
            handleRemoteStream(call.peer, remoteStream);
        });
        call.on("close", () => removePeer(call.peer));
        call.on("error", () => removePeer(call.peer));
    }

    function setupDataConnection(conn: any) {
        dataConnsRef.current.push(conn);
        conn.on("open", () => {
            conn.send({
                type: "media-state",
                payload: { peerId: peerIdRef.current, isMuted: isMutedRef.current, isVideoOff: isVideoOffRef.current }
            });
        });

        conn.on("data", (data: any) => {
            if (data.type === "chat") {
                setChatMessages((prev) => [...prev, data.payload]);
                if (!showChat) setHasUnreadMsg(true);
            }
            if (data.type === "room-info" && data.peers) {
                connectToPeers(data.peers);
                initiateMediaCall(conn.peer);
            }
            if (data.type === "media-state") {
                setRemoteStreams(prev => prev.map(p =>
                    p.peerId === data.payload.peerId
                        ? { ...p, isMuted: data.payload.isMuted, isVideoOff: data.payload.isVideoOff }
                        : p
                ));
            }
        });
        conn.on("close", () => removePeer(conn.peer));
    }

    function initiateMediaCall(targetId: string) {
        if (!localStreamRef.current || !peerRef.current) return;
        if (callsRef.current.find((c) => c.peer === targetId)) return;
        const call = peerRef.current.call(targetId, localStreamRef.current);
        callsRef.current.push(call);
        subscribeToCallEvents(call);
    }

    function connectToPeers(peers: string[]) {
        peers.forEach((targetId) => {
            if (targetId === peerIdRef.current) return;
            if (callsRef.current.find((c) => c.peer === targetId)) return;
            if (!peerRef.current) return;
            const conn = peerRef.current.connect(targetId);
            setupDataConnection(conn);
            initiateMediaCall(targetId);
        });
    }

    function setupCommonPeerEvents(peer: any) {
        peer.on("call", (call: any) => {
            call.answer(localStreamRef.current);
            callsRef.current.push(call);
            subscribeToCallEvents(call);
        });

        peer.on("connection", (conn: any) => {
            setupDataConnection(conn);
        });
    }

    function setupHostLogic(peer: any) {
        setupCommonPeerEvents(peer);
        peer.on("connection", (conn: any) => {
            conn.on("open", () => {
                const peersList = Array.from(connectedPeersRef.current);
                conn.send({ type: "room-info", peers: peersList });
                connectedPeersRef.current.add(conn.peer);
                setupDataConnection(conn);
            });
        });
    }

    // --- State-based Action Callbacks ---
    const toggleMute = useCallback(() => {
        if (localStreamRef.current) {
            const newState = !isMuted;
            localStreamRef.current.getAudioTracks().forEach((track) => {
                track.enabled = !newState;
            });
            setIsMuted(newState);
            isMutedRef.current = newState;
            broadcastData({
                type: "media-state",
                payload: { peerId: peerIdRef.current, isMuted: newState, isVideoOff: isVideoOffRef.current }
            });
        }
    }, [isMuted]);

    const toggleVideo = useCallback(() => {
        if (localStreamRef.current) {
            const newState = !isVideoOff;
            localStreamRef.current.getVideoTracks().forEach((track) => {
                track.enabled = !newState;
            });
            setIsVideoOff(newState);
            isVideoOffRef.current = newState;
            broadcastData({
                type: "media-state",
                payload: { peerId: peerIdRef.current, isMuted: isMutedRef.current, isVideoOff: newState }
            });
        }
    }, [isVideoOff]);

    const initGuestMode = useCallback(() => {
        if (!window.Peer) return;
        const peer = new window.Peer(undefined, {
            debug: 1,
            config: {
                iceServers: [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:global.stun.twilio.com:3478" },
                ],
            },
        });

        peer.on("open", (id: string) => {
            setPeerId(id);
            peerIdRef.current = id;
            setIsInCall(true);
            setIsLoading(false);
            setStatusMsg("");
            const conn = peer.connect(meetingCode);
            setupDataConnection(conn);
        });

        peer.on("error", (err: any) => {
            console.error("Guest Peer Error:", err);
            setStatusMsg("Failed to join meeting.");
            setIsLoading(false);
        });

        setupCommonPeerEvents(peer);
        peerRef.current = peer;
    }, [meetingCode]);

    const joinRoom = useCallback(() => {
        if (!meetingCode || !localStreamRef.current || !window.Peer) return;
        setIsLoading(true);
        setStatusMsg("Connecting to meeting...");

        const peer = new window.Peer(meetingCode, {
            debug: 1,
            config: {
                iceServers: [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:global.stun.twilio.com:3478" },
                ],
            },
        });

        peer.on("open", (id: string) => {
            setPeerId(id);
            peerIdRef.current = id;
            setIsInCall(true);
            setIsLoading(false);
            setStatusMsg("");
            setupHostLogic(peer);
        });

        peer.on("error", (err: any) => {
            if (err.type === "unavailable-id") {
                peer.destroy();
                initGuestMode();
            } else {
                console.error("Peer Error:", err);
                setStatusMsg(`Connection Error: ${err.type}`);
                setIsLoading(false);
            }
        });

        peerRef.current = peer;
    }, [meetingCode, initGuestMode]);

    const sendChatMessage = useCallback((text: string) => {
        if (!text.trim()) return;
        const msg: ChatMessage = {
            id: Date.now().toString(),
            senderId: peerIdRef.current,
            text,
            timestamp: Date.now(),
        };
        setChatMessages((prev) => [...prev, msg]);
        broadcastData({ type: "chat", payload: msg });
    }, []);

    const leaveMeeting = useCallback(() => {
        if (peerRef.current) peerRef.current.destroy();
        if (localStreamRef.current) localStreamRef.current.getTracks().forEach((track) => track.stop());
        router.push("/");
    }, [router]);

    const toggleScreenShare = useCallback(async () => {
        if (!localStreamRef.current) return;

        if (isScreenSharing) {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                const videoTrack = newStream.getVideoTracks()[0];

                callsRef.current.forEach((call) => {
                    const sender = call.peerConnection?.getSenders().find((s: any) => s.track?.kind === "video");
                    if (sender) sender.replaceTrack(videoTrack);
                });

                const oldVideoTrack = localStreamRef.current?.getVideoTracks()[0];
                if (oldVideoTrack) oldVideoTrack.stop();
                localStreamRef.current?.removeTrack(oldVideoTrack!);
                localStreamRef.current?.addTrack(videoTrack);
                setLocalStream(localStreamRef.current);
                setIsScreenSharing(false);
            } catch (e) {
                console.error("Error reverting to camera", e);
            }
        } else {
            try {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenTrack = displayStream.getVideoTracks()[0];
                screenTrack.onended = () => toggleScreenShare();

                callsRef.current.forEach((call) => {
                    const sender = call.peerConnection?.getSenders().find((s: any) => s.track?.kind === "video");
                    if (sender) sender.replaceTrack(screenTrack);
                });

                const oldVideoTrack = localStreamRef.current?.getVideoTracks()[0];
                if (oldVideoTrack) oldVideoTrack.stop();
                localStreamRef.current?.removeTrack(oldVideoTrack!);
                localStreamRef.current?.addTrack(screenTrack);
                setLocalStream(localStreamRef.current);
                setIsScreenSharing(true);
                setIsVideoOff(false);
            } catch (e) {
                console.error("Error starting screen share", e);
            }
        }
    }, [isScreenSharing]);

    return (
        <>
            <Script src="https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js" onLoad={() => setIsPeerJsLoaded(true)} />
            <div className="min-h-screen bg-[#0a0f16] text-white">
                {!isInCall ? (
                    <MeetingLobby
                        meetingCode={meetingCode}
                        localStream={localStream}
                        isMuted={isMuted}
                        isVideoOff={isVideoOff}
                        isLoading={isLoading}
                        statusMsg={statusMsg}
                        isPeerJsLoaded={isPeerJsLoaded}
                        onToggleMute={toggleMute}
                        onToggleVideo={toggleVideo}
                        onJoin={joinRoom}
                    />
                ) : (
                    <MeetingRoom
                        meetingCode={meetingCode}
                        peerId={peerId}
                        localStream={localStream}
                        remoteStreams={remoteStreams}
                        isMuted={isMuted}
                        isVideoOff={isVideoOff}
                        isScreenSharing={isScreenSharing}
                        showChat={showChat}
                        chatMessages={chatMessages}
                        hasUnreadMsg={hasUnreadMsg}
                        onToggleMute={toggleMute}
                        onToggleVideo={toggleVideo}
                        onToggleScreenShare={toggleScreenShare}
                        onToggleChat={() => {
                            setShowChat(!showChat);
                            if (!showChat) setHasUnreadMsg(false);
                        }}
                        onSendMessage={sendChatMessage}
                        onLeave={leaveMeeting}
                    />
                )}
            </div>
        </>
    );
}
