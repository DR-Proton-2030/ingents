"use client";
import React, { useState, useEffect, useRef, useCallback, useContext, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import MeetingLobby from "@/components/shared/meeting/MeetingLobby";
import { getMeetingByCode, MeetingDetails, Participant } from "@/utils/api/meeting/meeting.api";
import { MeetingRoom } from "@/components/shared/meeting";
import AuthContext from "@/contexts/authContext/authContext";
import { db, storage } from "@/lib/firebase";
import {
    joinMeetingRoom,
    leaveMeetingRoom,
    listenToParticipants,
    updateParticipantPresence,
    updateParticipantMedia,
    FirebaseParticipant
} from "@/lib/meeting.firebase";
import { toast } from "react-toastify";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Phone,
    MessageSquare,
    Users,
    Copy,
    Check,
    Share2,
    Monitor,
    HandIcon,
    Smile,
    LayoutGrid,
    MoreVertical,
    Sparkles,
    Settings
} from "lucide-react";

declare global {
    interface Window {
        Peer: any;
    }
}

import { PeerStream, ChatMessage, TranscriptEntry } from "@/components/shared/meeting/room/types";

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
    const [stableGuestId, setStableGuestId] = useState<string>("");

    // Initialize stable guest ID once
    useEffect(() => {
        setStableGuestId(`guest-${Math.random().toString(36).substr(2, 5)}`);
    }, []);

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

        // Default to stable Guest ID if not logged in
        return {
            id: userId || stableGuestId || "guest-init",
            name: "Guest",
            email: userEmail || ""
        };
    }, [user, meetingInfo, participants, isInCall, peerId, meetingCode, stableGuestId]);

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
    const [videoFilter, setVideoFilter] = useState("none");
    const [videoBackground, setVideoBackground] = useState("none");

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
    const isHostRef = useRef(false);
    const blockedPeersRef = useRef<Map<string, number>>(new Map());
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

        // Check if PeerJS is already loaded (e.g. from a previous navigation)
        if (typeof window !== "undefined" && (window as any).Peer) {
            setIsPeerJsLoaded(true);
        }
    }, []);

    // Fetch meeting details
    useEffect(() => {
        const fetchMeetingData = async () => {
            if (!meetingCode) {
                setIsFetchingInfo(false);
                return;
            }
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
        const uniquePeers = new Set<string>();
        dataConnsRef.current.forEach((conn) => {
            if (conn.open && !uniquePeers.has(conn.peer)) {
                conn.send(data);
                uniquePeers.add(conn.peer);
            }
        });
    }

    // --- Firebase Sync Effect ---
    useEffect(() => {
        if (!isInCall || !meetingCode) return;

        const unsubscribe = listenToParticipants(meetingCode, (fbParticipants) => {
            console.log("Firebase Participants Update:", fbParticipants);

            // 1. Filter out self
            const others = fbParticipants.filter(p => p.peerId !== peerIdRef.current);

            // 2. Remove peers that are no longer in Firebase
            setRemoteStreams(prev => {
                const currentPeerIds = others.map(p => p.peerId);
                const removedPeers = prev.filter(p => !currentPeerIds.includes(p.peerId) && p.peerId !== meetingCode);

                removedPeers.forEach(p => {
                    console.log("Peer removed from Firebase, cleaning up:", p.peerId);
                    removePeer(p.peerId);
                });

                return prev.filter(p => currentPeerIds.includes(p.peerId) || p.peerId === meetingCode);
            });

            // 3. Update existing peers or connect to new ones
            others.forEach(participant => {
                // If we don't have a connection to this participant yet, and they joined BEFORE us
                // we should initiate a connection.
                const shouldInitiate = participant.peerId < peerIdRef.current;

                if (shouldInitiate && !connectedPeersRef.current.has(participant.peerId)) {
                    console.log("New participant found in Firebase, initiating connection:", participant.peerId);
                    connectToPeer(participant.peerId);
                }
            });
        });

        return () => unsubscribe();
    }, [isInCall, meetingCode]);


    // --- Firebase Presence Heartbeat ---
    useEffect(() => {
        if (!isInCall || !meetingCode) return;

        const interval = setInterval(() => {
            updateParticipantPresence(meetingCode, peerIdRef.current);
        }, 10000); // Heartbeat every 10s

        return () => clearInterval(interval);
    }, [isInCall, meetingCode]);

    function removePeer(id: string) {
        if (!id) return;
        console.log("Removing peer from UI:", id);

        // 1. Update UI state
        setRemoteStreams((prev) => prev.filter((p) => p.peerId !== id));

        // 2. Cleanup connection refs
        callsRef.current = callsRef.current.filter((c) => c.peer !== id);
        dataConnsRef.current = dataConnsRef.current.filter((c) => c.peer !== id);
        connectedPeersRef.current.delete(id);

        // 3. Block this ID from re-joining for a short window to prevent signal echoing
        blockedPeersRef.current.set(id, Date.now());
    }

    function connectToPeer(targetPeerId: string) {
        if (!peerRef.current || !localStreamRef.current || targetPeerId === peerIdRef.current) return;
        if (connectedPeersRef.current.has(targetPeerId)) {
            console.log("Already connected to peer or connecting:", targetPeerId);
            return;
        }

        console.log("🚀 Initiating connection to peer:", targetPeerId);
        connectedPeersRef.current.add(targetPeerId);

        // 1. Data Connection
        const conn = peerRef.current.connect(targetPeerId);
        setupDataConnection(conn);

        // 2. Video Call
        const call = peerRef.current.call(targetPeerId, localStreamRef.current, {
            metadata: {
                userName: currentUserRef.current.name,
                peerId: peerIdRef.current
            }
        });

        if (call) {
            callsRef.current.push(call);
            subscribeToCallEvents(call);
        }
    }

    function handleRemoteStream(peerId: string, stream: MediaStream, userName?: string) {
        // Guard 1: Ignore blocked peers (recently removed)
        const blockedAt = blockedPeersRef.current.get(peerId);
        if (blockedAt && (Date.now() - blockedAt < 30000)) {
            console.log("Blocking ghost stream from peer:", peerId);
            return;
        }

        // Guard 2: Don't add a stream for a peer that isn't connected
        if (!connectedPeersRef.current.has(peerId) && peerId !== meetingCode) {
            // If we are host, we track everyone. If we are participant, we only track those we connected to.
            // But we should at least check if we have a connection
            const hasDataConn = dataConnsRef.current.some(c => c.peer === peerId);
            if (!hasDataConn && peerId !== meetingCode) return;
        }

        setRemoteStreams((prev) => {
            // Strict check for existing peer entry to prevent duplicates
            const existingIndex = prev.findIndex((p) => p.peerId === peerId);

            if (existingIndex !== -1) {
                // Return same state if nothing meaningful changed to prevent re-renders
                const existing = prev[existingIndex];
                if (existing.stream === stream && existing.userName === (userName || existing.userName)) {
                    return prev;
                }

                // Update specific entry
                const newState = [...prev];
                newState[existingIndex] = {
                    ...existing,
                    stream,
                    userName: userName || existing.userName,
                    lastSeen: Date.now()
                };
                return newState;
            }

            // Only add if not strictly blocked
            return [...prev, {
                peerId,
                stream,
                userName,
                isVideoOff: false,
                isMuted: false,
                isHandRaised: false,
                reaction: null,
                lastSeen: Date.now()
            }];
        });
    }

    const startTranscription = (shouldBroadcast = true) => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            if (shouldBroadcast) toast.error("Speech Recognition is not supported in this browser.");
            return;
        }

        // Clean up previous instance if any
        if (recognitionRef.current) {
            try {
                recognitionRef.current.onend = null;
                recognitionRef.current.stop();
            } catch (e) { }
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
            // Check mute state from the ref
            if (isMutedRef.current) return;

            const result = event.results[event.results.length - 1];
            if (result.isFinal) {
                const text = result[0].transcript.trim();
                if (!text) return;

                const transcriptEntry: TranscriptEntry = {
                    id: `${peerIdRef.current}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    senderId: peerIdRef.current,
                    senderName: currentUserRef.current.name,
                    text: text,
                    timestamp: Date.now()
                };

                setTranscripts(prev => {
                    if (prev.find(t => t.id === transcriptEntry.id)) return prev;
                    return [...prev, transcriptEntry];
                });
                broadcastData({ type: "transcription", payload: transcriptEntry });
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech Recognition Error:", event.error);
            if (event.error === "no-speech" || event.error === "aborted") return;
            setIsTranscriptionActive(false);
            isTranscriptionActiveRef.current = false;
        };

        recognition.onend = () => {
            if (isTranscriptionActiveRef.current && !isMutedRef.current) {
                try {
                    recognition.start();
                } catch (e) {
                    console.error("Failed to restart recognition", e);
                }
            }
        };

        recognitionRef.current = recognition;
        try {
            recognition.start();
            setIsTranscriptionActive(true);
            isTranscriptionActiveRef.current = true;
            if (shouldBroadcast) {
                broadcastData({ type: "transcription-status", payload: { active: true } });
                toast.info("Meeting Transcription started for everyone.");
            }
        } catch (e) {
            console.error("Failed to start recognition", e);
        }
    };

    const stopTranscription = (shouldBroadcast = true) => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsTranscriptionActive(false);
        isTranscriptionActiveRef.current = false;
        if (shouldBroadcast) {
            broadcastData({ type: "transcription-status", payload: { active: false } });
        }
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
        if (dataConnsRef.current.find(c => c.peer === conn.peer)) return;
        dataConnsRef.current.push(conn);
        connectedPeersRef.current.add(conn.peer); // Ensure consistency
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
                    isHandRaised: isHandRaisedRef.current,
                    videoFilter: videoFilter,
                    videoBackground: videoBackground
                }
            });

            // If transcription is active, notify the new peer
            if (isTranscriptionActiveRef.current) {
                conn.send({ type: "transcription-status", payload: { active: true } });
            }
        });

        conn.on("data", (data: any) => {
            const senderId = data.payload?.senderId || data.payload?.peerId || conn.peer;

            // Guard 1: Ignore messages from self
            if (senderId === peerIdRef.current) return;

            // Guard 2: Ignore messages from blocked peers
            const blockedAt = blockedPeersRef.current.get(senderId);
            if (blockedAt && (Date.now() - blockedAt < 30000)) {
                return;
            }

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

                    // Guard: Only create placeholder if NOT blocked and NOT already in list
                    const blockedAt = blockedPeersRef.current.get(data.payload.peerId);
                    if (blockedAt && (Date.now() - blockedAt < 30000)) return prev;

                    // If stream not yet added, create placeholder
                    return [...prev, {
                        peerId: data.payload.peerId,
                        stream: new MediaStream(),
                        userName: data.payload.userName,
                        isVideoOff: false,
                        isMuted: false,
                        isHandRaised: false,
                        reaction: null,
                        lastSeen: Date.now()
                    }];
                });
            }
            if (data.type === "chat") {
                setChatMessages((prev) => {
                    if (prev.find(m => m.id === data.payload.id)) return prev;
                    return [...prev, data.payload];
                });
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
                            isHandRaised: data.payload.isHandRaised,
                            videoFilter: data.payload.videoFilter || "none",
                            videoBackground: data.payload.videoBackground || "none"
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
                setTranscripts(prev => {
                    if (prev.find(t => t.id === data.payload.id)) return prev;
                    return [...prev, data.payload];
                });
            }
            if (data.type === "transcription-status") {
                if (data.payload.active) {
                    startTranscription(false);
                } else {
                    stopTranscription(false);
                }
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
            if (data.type === "visual-effect") {
                setRemoteStreams(prev => prev.map(p =>
                    p.peerId === data.payload.peerId
                        ? {
                            ...p,
                            videoFilter: data.payload.videoFilter,
                            videoBackground: data.payload.videoBackground
                        }
                        : p
                ));
            }
            if (data.type === "heartbeat") {
                setRemoteStreams(prev => prev.map(p =>
                    p.peerId === data.payload.peerId
                        ? { ...p, lastSeen: Date.now() }
                        : p
                ));
            }
            if (data.type === "leave") {
                removePeer(data.payload.peerId);
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
            const blockedAt = blockedPeersRef.current.get(call.peer);
            if (blockedAt && (Date.now() - blockedAt < 30000)) {
                console.warn("Ignoring call from blocked peer:", call.peer);
                call.close();
                return;
            }
            call.answer(localStreamRef.current);
            callsRef.current.push(call);
            subscribeToCallEvents(call);
        });

        peer.on("connection", (conn: any) => {
            const blockedAt = blockedPeersRef.current.get(conn.peer);
            if (blockedAt && (Date.now() - blockedAt < 30000)) {
                console.warn("Ignoring connection from blocked peer:", conn.peer);
                conn.close();
                return;
            }
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
    const toggleMute = useCallback(async () => {
        if (localStreamRef.current) {
            const newState = !isMuted;
            localStreamRef.current.getAudioTracks().forEach((track) => {
                track.enabled = !newState;
            });
            setIsMuted(newState);
            isMutedRef.current = newState;

            // If transcription is active, stop it if we mute, start if we unmute
            if (isTranscriptionActiveRef.current) {
                if (newState) {
                    if (recognitionRef.current) {
                        recognitionRef.current.stop();
                        recognitionRef.current = null;
                    }
                } else {
                    startTranscription(false);
                }
            }

            broadcastData({
                type: "media-state",
                payload: {
                    peerId: peerIdRef.current,
                    isMuted: newState,
                    isVideoOff: isVideoOffRef.current,
                    isHandRaised: isHandRaisedRef.current
                }
            });

            if (isInCall && meetingCode) {
                await updateParticipantMedia(meetingCode, peerIdRef.current, { isMuted: newState });
            }
        }
    }, [isMuted, startTranscription, isInCall, meetingCode]);

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
    }, [broadcastData]);

    const applyVisualEffect = useCallback((type: "filter" | "background", effectId: string) => {
        if (type === "filter") {
            setVideoFilter(effectId);
        } else {
            setVideoBackground(effectId);
        }
        broadcastData({
            type: "visual-effect",
            payload: {
                peerId: peerIdRef.current,
                videoFilter: type === "filter" ? effectId : videoFilter,
                videoBackground: type === "background" ? effectId : videoBackground
            }
        });
    }, [videoFilter, videoBackground]);

    // Heartbeat Effect: Broadcast presence and prune stale peers
    useEffect(() => {
        if (!isInCall) return;

        const interval = setInterval(() => {
            // 1. Broadcast our heartbeat
            broadcastData({
                type: "heartbeat",
                payload: { peerId: peerIdRef.current }
            });

            // 2. Prune peers not seen for > 15 seconds
            const now = Date.now();
            setRemoteStreams(prev => {
                const stalePeers = prev.filter(p => p.lastSeen && (now - p.lastSeen > 15000));
                if (stalePeers.length > 0) {
                    stalePeers.forEach(p => {
                        console.log("Pruning stale peer:", p.peerId);
                        callsRef.current = callsRef.current.filter(c => c.peer !== p.peerId);
                        dataConnsRef.current = dataConnsRef.current.filter(c => c.peer !== p.peerId);
                        connectedPeersRef.current.delete(p.peerId);
                    });
                    return prev.filter(p => !p.lastSeen || (now - p.lastSeen <= 15000));
                }
                return prev;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [isInCall]);

    // Unified Join Function: Handles both Host and Participant entry via Firebase
    const joinRoom = useCallback(async () => {
        if (!window.Peer || !meetingCode || !currentUser.id) {
            console.warn("PeerJS or Meeting Info missing. Cannot join.");
            return;
        }

        setIsLoading(true);
        setStatusMsg("Joining room...");

        // 1. Determine local Peer ID (Host gets the meeting code, others get a participant ID)
        const myPeerId = currentUser.id === (meetingInfo?.host_user_object_id || meetingInfo?.host_details?._id)
            ? meetingCode
            : `${meetingCode}-p-${currentUser.id}`;

        setPeerId(myPeerId);
        peerIdRef.current = myPeerId;
        isHostRef.current = myPeerId === meetingCode;

        // 2. Register Presence in Firestore (The Source of Truth)
        try {
            await joinMeetingRoom(meetingCode, {
                peerId: myPeerId,
                userId: currentUser.id,
                userName: currentUser.name,
                isVideoOff: isVideoOffRef.current,
                isMuted: isMutedRef.current,
                isHandRaised: false,
                lastSeen: null,
                joinedAt: null
            });
        } catch (err) {
            console.error("Firebase join failed:", err);
            toast.error("Failed to connect to signal server.");
            setIsLoading(false);
            return;
        }

        // 3. Initialize WebRTC Peer
        const peer = new window.Peer(myPeerId, {
            host: "0.peerjs.com",
            port: 443,
            secure: true,
            config: {
                iceServers: [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:stun1.l.google.com:19302" }
                ],
            },
        });

        peer.on("open", (id: string) => {
            console.log("P2P Signaling Active:", id);
            peerRef.current = peer;
            setIsInCall(true);
            setIsLoading(false);
            setStatusMsg("");
        });

        peer.on("error", (err: any) => {
            console.error("P2P Error:", err);
            setIsLoading(false);
            if (err.type === "unavailable-id") {
                toast.error("Meeting ID taken. Please try again in 30 seconds.");
            } else {
                toast.error(`Connection Error: ${err.type}`);
            }
        });

        setupCommonPeerEvents(peer);
    }, [meetingCode, currentUser, meetingInfo]);

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

    const leaveMeeting = useCallback(async () => {
        if (meetingCode) {
            await leaveMeetingRoom(meetingCode, peerIdRef.current);
        }
        broadcastData({ type: "leave", payload: { peerId: peerIdRef.current } });
        if (peerRef.current) peerRef.current.destroy();
        if (localStreamRef.current) localStreamRef.current.getTracks().forEach((track) => track.stop());
        router.push("/");
    }, [router, meetingCode]);

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
            <Script
                src="https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"
                onLoad={() => setIsPeerJsLoaded(true)}
                onReady={() => setIsPeerJsLoaded(true)}
            />
            <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js" strategy="afterInteractive" />
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
                        videoFilter={videoFilter}
                        videoBackground={videoBackground}
                        onApplyVisualEffect={applyVisualEffect}
                    />
                )}
            </div>
        </>
    );
}
