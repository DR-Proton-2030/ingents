"use client";
import React, { useState, useEffect, useRef, useCallback, useContext, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import MeetingLobby from "@/components/shared/meeting/MeetingLobby";
import { getMeetingByCode, MeetingDetails, Participant } from "@/utils/api/meeting/meeting.api";
import { MeetingRoom } from "@/components/shared/meeting";
import AuthContext from "@/contexts/authContext/authContext";

declare global {
    interface Window {
        Peer: any;
    }
}

import { PeerStream, ChatMessage, TranscriptEntry } from "@/components/shared/meeting/room/types";
import { toast } from "react-toastify";

export default function MeetingPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const meetingCode = params.meetingCode as string;

    // Connection State
    const [peerId, setPeerId] = useState<string>("");
    const [isInCall, setIsInCall] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");
    const [isPeerJsLoaded, setIsPeerJsLoaded] = useState(false);

    // Meeting Info State (declare early for use in currentUser)
    const [meetingInfo, setMeetingInfo] = useState<MeetingDetails | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isFetchingInfo, setIsFetchingInfo] = useState(true);

    // Current user info - use AuthContext user, or fallback to meeting host if user is the host
    const currentUser = useMemo(() => {
        const userId = user?.id || (user as any)?._id || "";
        const userName = user?.full_name || "";
        const userEmail = user?.email || "";

        // If we have user data from AuthContext, use it
        if (userName) {
            return { id: userId, name: userName, email: userEmail };
        }

        // Special case: If this is the person who joined as fixed peer ID (host), 
        // they are likely the host even if AuthContext isn't loaded yet
        if (isInCall && peerId === meetingCode && meetingInfo?.host_details) {
            return {
                id: meetingInfo.host_details._id,
                name: meetingInfo.host_details.full_name,
                email: meetingInfo.host_details.email
            };
        }

        // Check if current user matches a participant
        if (meetingInfo && participants.length > 0 && userId) {
            const matchedParticipant = participants.find(p =>
                p.user_details?._id === userId || p.user_object_id === userId
            );
            if (matchedParticipant) {
                return {
                    id: userId,
                    name: matchedParticipant.user_details?.full_name || matchedParticipant.external_name || "Guest",
                    email: matchedParticipant.user_details?.email || matchedParticipant.external_email || ""
                };
            }
        }

        // Check if current user is the host (by ID)
        if (meetingInfo?.host_details && userId && (meetingInfo.host_user_object_id === userId || meetingInfo.host_details._id === userId)) {
            return {
                id: userId,
                name: meetingInfo.host_details.full_name || "Host",
                email: meetingInfo.host_details.email || ""
            };
        }

        return { id: userId, name: userName || "Guest", email: userEmail };
    }, [user, meetingInfo, participants, isInCall, peerId, meetingCode]);

    // Media State
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<PeerStream[]>([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // Feature State
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [localReaction, setLocalReaction] = useState<string | null>(null);

    // Chat State
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [hasUnreadMsg, setHasUnreadMsg] = useState(false);

    // Transcription & AI State
    const [isTranscriptionActive, setIsTranscriptionActive] = useState(false);
    const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
    const [isTranscriptionReady, setIsTranscriptionReady] = useState(false);

    // Refs
    const peerRef = useRef<any>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const callsRef = useRef<any[]>([]);
    const dataConnsRef = useRef<any[]>([]);
    const connectedPeersRef = useRef<Set<string>>(new Set());
    const isMutedRef = useRef(false);
    const isVideoOffRef = useRef(false);
    const isHandRaisedRef = useRef(false);
    const peerIdRef = useRef("");
    const currentUserRef = useRef(currentUser);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const recognitionRef = useRef<any>(null);
    const isTranscriptionActiveRef = useRef(false);

    // Keep currentUserRef in sync
    useEffect(() => {
        currentUserRef.current = currentUser;
    }, [currentUser]);

    // Initialize audio for notifications
    useEffect(() => {
        audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3");
    }, []);

    // Fetch meeting details
    useEffect(() => {
        const fetchMeetingData = async () => {
            if (!meetingCode) return;
            try {
                setIsFetchingInfo(true);
                const response = await getMeetingByCode(meetingCode);
                setMeetingInfo(response.data.meeting);
                setParticipants(response.data.participants);
            } catch (err) {
                console.error("Failed to fetch meeting info:", err);
            } finally {
                setIsFetchingInfo(false);
            }
        };

        fetchMeetingData();
    }, [meetingCode]);

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

    function handleRemoteStream(peerId: string, stream: MediaStream, userName?: string) {
        setRemoteStreams((prev) => {
            const existing = prev.find((p) => p.peerId === peerId);
            if (existing) {
                // Update existing with stream and optionally userName
                return prev.map(p => p.peerId === peerId
                    ? { ...p, stream, userName: userName || p.userName }
                    : p
                );
            }
            return [...prev, { peerId, stream, userName, isVideoOff: false, isMuted: false, isHandRaised: false, reaction: null }];
        });
    }

    const startTranscription = () => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            toast.error("Speech Recognition is not supported in this browser.");
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
            const result = event.results[event.results.length - 1];
            if (result.isFinal) {
                const text = result[0].transcript;
                const transcriptEntry: TranscriptEntry = {
                    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    senderId: peerIdRef.current,
                    senderName: currentUserRef.current.name,
                    text: text,
                    timestamp: Date.now()
                };

                setTranscripts(prev => [...prev, transcriptEntry]);
                broadcastData({ type: "transcription", payload: transcriptEntry });
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech Recognition Error:", event.error);
            if (event.error === "no-speech") return;
            setIsTranscriptionActive(false);
            isTranscriptionActiveRef.current = false;
        };

        recognition.onend = () => {
            if (isTranscriptionActiveRef.current) {
                recognition.start();
            }
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsTranscriptionActive(true);
        isTranscriptionActiveRef.current = true;
        broadcastData({ type: "transcription-status", payload: { active: true } });
        toast.info("Transcription activated for everyone.");
    };

    const stopTranscription = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsTranscriptionActive(false);
        isTranscriptionActiveRef.current = false;
        broadcastData({ type: "transcription-status", payload: { active: false } });
    };

    const toggleTranscription = () => {
        if (isTranscriptionActive) {
            stopTranscription();
        } else {
            startTranscription();
        }
    };

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
            // Send user info immediately
            conn.send({
                type: "user-info",
                payload: {
                    peerId: peerIdRef.current,
                    userName: currentUserRef.current.name,
                    email: currentUserRef.current.email
                }
            });
            // Also send media state
            conn.send({
                type: "media-state",
                payload: {
                    peerId: peerIdRef.current,
                    userName: currentUserRef.current.name,
                    isMuted: isMutedRef.current,
                    isVideoOff: isVideoOffRef.current,
                    isHandRaised: isHandRaisedRef.current
                }
            });

            // If transcription is active, notify the new peer
            if (isTranscriptionActiveRef.current) {
                conn.send({ type: "transcription-status", payload: { active: true } });
            }
        });

        conn.on("data", (data: any) => {
            if (data.type === "user-info") {
                // Update remote stream with user name
                setRemoteStreams(prev => {
                    const existing = prev.find(p => p.peerId === data.payload.peerId);
                    if (existing) {
                        return prev.map(p => p.peerId === data.payload.peerId
                            ? { ...p, userName: data.payload.userName }
                            : p
                        );
                    }
                    // If stream not yet added, create placeholder
                    return [...prev, {
                        peerId: data.payload.peerId,
                        stream: new MediaStream(),
                        userName: data.payload.userName,
                        isVideoOff: false,
                        isMuted: false,
                        isHandRaised: false,
                        reaction: null
                    }];
                });
            }
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
                        ? {
                            ...p,
                            userName: data.payload.userName || p.userName,
                            isMuted: data.payload.isMuted,
                            isVideoOff: data.payload.isVideoOff,
                            isHandRaised: data.payload.isHandRaised
                        }
                        : p
                ));
            }
            if (data.type === "hand-raise") {
                if (data.payload.isHandRaised && audioRef.current) {
                    audioRef.current.play().catch(e => console.log("Audio play failed", e));
                }
                setRemoteStreams(prev => prev.map(p =>
                    p.peerId === data.payload.peerId
                        ? { ...p, isHandRaised: data.payload.isHandRaised }
                        : p
                ));
            }
            if (data.type === "transcription") {
                setTranscripts(prev => [...prev, data.payload]);
            }
            if (data.type === "transcription-status") {
                setIsTranscriptionActive(data.payload.active);
                isTranscriptionActiveRef.current = data.payload.active;
                toast.info(data.payload.active ? "Meeting Transcription started" : "Meeting Transcription stopped");
            }
            if (data.type === "reaction") {
                setRemoteStreams(prev => prev.map(p =>
                    p.peerId === data.payload.peerId
                        ? { ...p, reaction: data.payload.reaction }
                        : p
                ));
                // Remove reaction after 2s
                setTimeout(() => {
                    setRemoteStreams(prev => prev.map(p =>
                        p.peerId === data.payload.peerId
                            ? { ...p, reaction: null }
                            : p
                    ));
                }, 2000);
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
                payload: {
                    peerId: peerIdRef.current,
                    isMuted: newState,
                    isVideoOff: isVideoOffRef.current,
                    isHandRaised: isHandRaisedRef.current
                }
            });
        }
    }, [isMuted]);

    const toggleVideo = useCallback(async () => {
        if (localStreamRef.current) {
            const newState = !isVideoOff;

            if (newState) {
                // Turning OFF: Stop all video tracks to kill the hardware light
                localStreamRef.current.getVideoTracks().forEach((track) => {
                    track.stop();
                    localStreamRef.current?.removeTrack(track);
                });
            } else {
                // Turning ON: Re-acquire the video track
                try {
                    const newStream = await navigator.mediaDevices.getUserMedia({
                        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
                    });
                    const newTrack = newStream.getVideoTracks()[0];
                    localStreamRef.current.addTrack(newTrack);

                    // Update all active PeerJS calls with the new track
                    callsRef.current.forEach(call => {
                        const peerConnection = call.peerConnection;
                        if (peerConnection) {
                            const senders = peerConnection.getSenders();
                            const videoSender = senders.find((s: any) => s.track && s.track.kind === "video");
                            if (videoSender) {
                                videoSender.replaceTrack(newTrack);
                            }
                        }
                    });
                } catch (err) {
                    console.error("❌ Error re-acquiring video track:", err);
                    return;
                }
            }

            setIsVideoOff(newState);
            isVideoOffRef.current = newState;
            broadcastData({
                type: "media-state",
                payload: {
                    peerId: peerIdRef.current,
                    isMuted: isMutedRef.current,
                    isVideoOff: newState,
                    isHandRaised: isHandRaisedRef.current
                }
            });
        }
    }, [isVideoOff, broadcastData]);

    const toggleHandRaise = useCallback(() => {
        const newState = !isHandRaised;
        setIsHandRaised(newState);
        isHandRaisedRef.current = newState;
        broadcastData({
            type: "hand-raise",
            payload: { peerId: peerIdRef.current, isHandRaised: newState }
        });
    }, [isHandRaised]);

    const sendReaction = useCallback((emoji: string) => {
        setLocalReaction(emoji);
        broadcastData({
            type: "reaction",
            payload: { peerId: peerIdRef.current, reaction: emoji }
        });
        setTimeout(() => setLocalReaction(null), 2000);
    }, []);

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
            senderName: currentUserRef.current.name,
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
                        meetingInfo={meetingInfo}
                        participants={participants}
                        currentUser={currentUser}
                        isFetchingInfo={isFetchingInfo}
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
                        meetingInfo={meetingInfo}
                        participants={participants}
                        currentUser={currentUser}
                        remoteStreams={remoteStreams}
                        isMuted={isMuted}
                        isVideoOff={isVideoOff}
                        isScreenSharing={isScreenSharing}
                        isHandRaised={isHandRaised}
                        localReaction={localReaction}
                        showChat={showChat}
                        chatMessages={chatMessages}
                        hasUnreadMsg={hasUnreadMsg}
                        onToggleMute={toggleMute}
                        onToggleVideo={toggleVideo}
                        onToggleScreenShare={toggleScreenShare}
                        onToggleHandRaise={toggleHandRaise}
                        onSendReaction={sendReaction}
                        onToggleChat={() => {
                            setShowChat(!showChat);
                            if (!showChat) setHasUnreadMsg(false);
                        }}
                        onSendMessage={sendChatMessage}
                        onLeave={leaveMeeting}
                        isTranscriptionActive={isTranscriptionActive}
                        onToggleTranscription={toggleTranscription}
                        transcripts={transcripts}
                    />
                )}
            </div>
        </>
    );
}
