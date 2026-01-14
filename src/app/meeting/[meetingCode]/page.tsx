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

    // Refs
    const peerRef = useRef<any>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const callsRef = useRef<any[]>([]);
    const dataConnsRef = useRef<any[]>([]);
    const connectedPeersRef = useRef<Set<string>>(new Set());

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

    // Toggle mute
    const toggleMute = useCallback(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsMuted((prev) => !prev);
        }
    }, []);

    // Toggle video
    const toggleVideo = useCallback(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff((prev) => !prev);
        }
    }, []);

    // Join room
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
            console.log("Opened as Host:", id);
            setPeerId(id);
            setIsInCall(true);
            setIsLoading(false);
            setStatusMsg("");
            setupHostLogic(peer);
        });

        peer.on("error", (err: any) => {
            if (err.type === "unavailable-id") {
                console.log("Room ID taken, joining as Guest...");
                peer.destroy();
                initGuestMode();
            } else {
                console.error("Peer Error:", err);
                setStatusMsg(`Connection Error: ${err.type}`);
                setIsLoading(false);
            }
        });

        peerRef.current = peer;
    }, [meetingCode]);

    // Guest mode
    const initGuestMode = useCallback(() => {
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
            console.log("Opened as Guest:", id);
            setPeerId(id);
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

    // Setup host logic
    const setupHostLogic = useCallback((peer: any) => {
        setupCommonPeerEvents(peer);
        peer.on("connection", (conn: any) => {
            conn.on("open", () => {
                const peersList = Array.from(connectedPeersRef.current);
                conn.send({ type: "room-info", peers: peersList });
                connectedPeersRef.current.add(conn.peer);
                setupDataConnection(conn);
            });
        });
    }, []);

    // Common peer events
    const setupCommonPeerEvents = useCallback((peer: any) => {
        peer.on("call", (call: any) => {
            call.answer(localStreamRef.current);
            callsRef.current.push(call);
            subscribeToCallEvents(call);
        });

        peer.on("connection", (conn: any) => {
            setupDataConnection(conn);
        });
    }, []);

    // Subscribe to call events
    const subscribeToCallEvents = useCallback((call: any) => {
        call.on("stream", (remoteStream: MediaStream) => {
            handleRemoteStream(call.peer, remoteStream);
        });
        call.on("close", () => removePeer(call.peer));
        call.on("error", () => removePeer(call.peer));
    }, []);

    // Setup data connection
    const setupDataConnection = useCallback((conn: any) => {
        dataConnsRef.current.push(conn);
        conn.on("data", (data: any) => {
            if (data.type === "chat") {
                setChatMessages((prev) => [...prev, data.payload]);
                if (!showChat) setHasUnreadMsg(true);
            }
            if (data.type === "room-info" && data.peers) {
                connectToPeers(data.peers);
                initiateMediaCall(conn.peer);
            }
        });
        conn.on("close", () => removePeer(conn.peer));
    }, [showChat]);

    // Broadcast data
    const broadcastData = useCallback((data: any) => {
        dataConnsRef.current.forEach((conn) => {
            if (conn.open) conn.send(data);
        });
    }, []);

    // Connect to peers
    const connectToPeers = useCallback((peers: string[]) => {
        peers.forEach((targetId) => {
            if (targetId === peerId) return;
            if (callsRef.current.find((c) => c.peer === targetId)) return;
            const conn = peerRef.current.connect(targetId);
            setupDataConnection(conn);
            initiateMediaCall(targetId);
        });
    }, [peerId, setupDataConnection]);

    // Initiate media call
    const initiateMediaCall = useCallback((targetId: string) => {
        if (!localStreamRef.current) return;
        if (callsRef.current.find((c) => c.peer === targetId)) return;
        const call = peerRef.current.call(targetId, localStreamRef.current);
        callsRef.current.push(call);
        subscribeToCallEvents(call);
    }, [subscribeToCallEvents]);

    // Handle remote stream
    const handleRemoteStream = useCallback((peerId: string, stream: MediaStream) => {
        setRemoteStreams((prev) => {
            if (prev.find((p) => p.peerId === peerId)) return prev;
            return [...prev, { peerId, stream }];
        });
    }, []);

    // Remove peer
    const removePeer = useCallback((id: string) => {
        setRemoteStreams((prev) => prev.filter((p) => p.peerId !== id));
        callsRef.current = callsRef.current.filter((c) => c.peer !== id);
        dataConnsRef.current = dataConnsRef.current.filter((c) => c.peer !== id);
        connectedPeersRef.current.delete(id);
    }, []);

    // Send chat message
    const sendChatMessage = useCallback((text: string) => {
        if (!text.trim()) return;
        const msg: ChatMessage = {
            id: Date.now().toString(),
            senderId: peerId,
            text,
            timestamp: Date.now(),
        };
        setChatMessages((prev) => [...prev, msg]);
        broadcastData({ type: "chat", payload: msg });
    }, [peerId, broadcastData]);

    // Leave meeting
    const leaveMeeting = useCallback(() => {
        if (peerRef.current) {
            peerRef.current.destroy();
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        router.push("/");
    }, [router]);

    // Toggle screen share
    const toggleScreenShare = useCallback(async () => {
        if (!localStreamRef.current) return;

        if (isScreenSharing) {
            // Stop screen sharing, revert to camera
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                const videoTrack = newStream.getVideoTracks()[0];

                callsRef.current.forEach((call) => {
                    const sender = call.peerConnection
                        ?.getSenders()
                        .find((s: any) => s.track?.kind === "video");
                    if (sender) sender.replaceTrack(videoTrack);
                });

                // Update local stream
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
                const displayStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                });
                const screenTrack = displayStream.getVideoTracks()[0];

                screenTrack.onended = () => {
                    toggleScreenShare();
                };

                callsRef.current.forEach((call) => {
                    const sender = call.peerConnection
                        ?.getSenders()
                        .find((s: any) => s.track?.kind === "video");
                    if (sender) sender.replaceTrack(screenTrack);
                });

                // Update local stream
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
            <Script
                src="https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"
                onLoad={() => setIsPeerJsLoaded(true)}
            />

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
