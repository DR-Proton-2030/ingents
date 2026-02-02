"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, getDoc, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AuthContext from "@/contexts/authContext/authContext";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";
import CallOverlay from "@/components/screens/chat/teamChat/components/CallOverlay";
import Script from "next/script";

interface CallContextType {
    callInfo: { isOpen: boolean; type: "audio" | "video"; user: IUser | null };
    callStatus: "calling" | "incoming" | "connected" | "ended";
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isMuted: boolean;
    setIsMuted: (muted: boolean) => void;
    isVideoOff: boolean;
    setIsVideoOff: (off: boolean) => void;
    handleStartCall: (type: "audio" | "video", targetUser: IUser) => Promise<void>;
    handleAcceptCall: () => Promise<void>;
    handleDeclineCall: () => Promise<void>;
    handleEndCall: () => Promise<void>;
    callHistory: any[];
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
    const { user: currentUser } = useContext(AuthContext);
    const { users } = useGetUsers();

    const [callInfo, setCallInfo] = useState<{ isOpen: boolean; type: "audio" | "video"; user: IUser | null }>({
        isOpen: false,
        type: "audio",
        user: null
    });
    const [callStatus, setCallStatus] = useState<"calling" | "incoming" | "connected" | "ended">("calling");
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callHistory, setCallHistory] = useState<any[]>([]);

    const peerRef = useRef<any>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const currentCallRef = useRef<any>(null);
    const currentCallDocId = useRef<string | null>(null);
    const incomingSoundRef = useRef<HTMLAudioElement | null>(null);
    const endSoundRef = useRef<HTMLAudioElement | null>(null);

    // Audio Setup
    useEffect(() => {
        if (typeof window === "undefined") return;
        incomingSoundRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/1359/1359-preview.mp3");
        endSoundRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
        incomingSoundRef.current.loop = true;

        return () => {
            incomingSoundRef.current?.pause();
            endSoundRef.current?.pause();
        };
    }, []);

    // Handle Call Sounds & Cleanup
    useEffect(() => {
        const stopAllSounds = () => {
            incomingSoundRef.current?.pause();
            if (incomingSoundRef.current) incomingSoundRef.current.currentTime = 0;
        };

        if (callStatus === "calling" && callInfo.isOpen) {
            stopAllSounds();
        } else if (callStatus === "incoming" && callInfo.isOpen) {
            stopAllSounds();
            incomingSoundRef.current?.play().catch(e => console.log("Audio play failed:", e));
        } else if (callStatus === "connected") {
            stopAllSounds();
        } else if (callStatus === "ended") {
            stopAllSounds();
            endSoundRef.current?.play().catch(e => console.log("Audio play failed:", e));
            const timer = setTimeout(() => {
                setCallInfo(prev => ({ ...prev, isOpen: false }));
            }, 1000);
            return () => clearTimeout(timer);
        } else if (!callInfo.isOpen) {
            stopAllSounds();
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
                setLocalStream(null);
            }
        }
    }, [callStatus, callInfo.isOpen]);

    // Fetch Call History
    useEffect(() => {
        if (!currentUser?.id) return;
        const q = query(
            collection(db, "calls"),
            where("participants", "array-contains", currentUser.id),
            orderBy("timestamp", "desc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const calls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCallHistory(calls);
        });
        return () => unsubscribe();
    }, [currentUser?.id]);

    // Initialize PeerJS
    useEffect(() => {
        if (!currentUser?.id || typeof window === "undefined") return;

        const initPeer = () => {
            if (!(window as any).Peer) return;

            const peer = new (window as any).Peer(currentUser.id, {
                debug: 1,
                config: {
                    iceServers: [
                        { urls: "stun:stun.l.google.com:19302" },
                        { urls: "stun:global.stun.twilio.com:3478" },
                    ],
                },
            });

            peer.on("open", (id: string) => {
                console.log("PeerJS: Global connection opened with ID:", id);
            });

            peer.on("call", (call: any) => {
                const caller = users.find(u => u.id === call.peer);
                const metadata = call.metadata || call.options?.metadata;

                setCallStatus("incoming");
                setCallInfo({
                    isOpen: true,
                    type: metadata?.type || "audio",
                    user: caller || { id: call.peer, full_name: "Unknown Caller" } as IUser
                });
                currentCallRef.current = call;
            });

            peer.on("error", (err: any) => {
                console.error("PeerJS Error:", err);
                if (err.type === "peer-unavailable") {
                    handleEndCall();
                }
            });

            peerRef.current = peer;
        };

        const checkPeer = setInterval(() => {
            if ((window as any).Peer) {
                initPeer();
                clearInterval(checkPeer);
            }
        }, 500);

        return () => {
            clearInterval(checkPeer);
            if (peerRef.current) {
                peerRef.current.destroy();
            }
        };
    }, [currentUser?.id, users]);

    const handleStartCall = async (type: "audio" | "video", targetUser: IUser) => {
        if (!peerRef.current || !currentUser?.id) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: type === "video",
                audio: true
            });

            const callDoc = await addDoc(collection(db, "calls"), {
                callerId: currentUser.id,
                receiverId: targetUser.id,
                participants: [currentUser.id, targetUser.id],
                type,
                status: "ringing",
                timestamp: serverTimestamp(),
                duration: 0
            });
            currentCallDocId.current = callDoc.id;

            const convoId = [currentUser.id, targetUser.id].sort().join('_');
            await addDoc(collection(db, "conversations", convoId, "messages"), {
                senderId: currentUser.id,
                text: `${type === "video" ? "Video" : "Audio"} call`,
                type: "call",
                callId: callDoc.id,
                timestamp: serverTimestamp(),
                isRead: false
            });

            setLocalStream(stream);
            localStreamRef.current = stream;
            setCallStatus("calling");
            setCallInfo({ isOpen: true, type, user: targetUser });

            const call = peerRef.current.call(targetUser.id, stream, {
                metadata: { type, callId: callDoc.id }
            });

            call.on("stream", async (remoteMediaStream: MediaStream) => {
                setRemoteStream(remoteMediaStream);
                setCallStatus("connected");
                if (currentCallDocId.current) {
                    await updateDoc(doc(db, "calls", currentCallDocId.current), { status: "connected" });
                }
            });

            call.on("close", () => handleEndCall());
            currentCallRef.current = call;

        } catch (error) {
            console.error("Error starting call:", error);
            alert("Could not access camera or microphone");
        }
    };

    const handleAcceptCall = async () => {
        if (!currentCallRef.current) return;
        const metadata = currentCallRef.current.metadata || currentCallRef.current.options?.metadata;
        const callId = metadata?.callId;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: callInfo.type === "video",
                audio: true
            });

            if (callId) {
                currentCallDocId.current = callId;
                await updateDoc(doc(db, "calls", callId), { status: "connected" });
            }

            setLocalStream(stream);
            localStreamRef.current = stream;
            currentCallRef.current.answer(stream);

            currentCallRef.current.on("stream", (remoteMediaStream: MediaStream) => {
                setRemoteStream(remoteMediaStream);
                setCallStatus("connected");
            });

            currentCallRef.current.on("close", () => handleEndCall());
        } catch (error) {
            console.error("Error accepting call:", error);
            handleEndCall();
        }
    };

    const handleDeclineCall = async () => {
        const metadata = currentCallRef.current?.metadata || currentCallRef.current?.options?.metadata;
        const callId = metadata?.callId;

        if (callId) {
            await updateDoc(doc(db, "calls", callId), { status: "declined" });
        }

        if (currentCallRef.current) {
            currentCallRef.current.close();
        }
        handleEndCall();
    };

    const handleEndCall = async () => {
        if (currentCallDocId.current) {
            const callRef = doc(db, "calls", currentCallDocId.current);
            const callSnap = await getDoc(callRef);
            if (callSnap.exists() && callSnap.data().status === "ringing") {
                await updateDoc(callRef, { status: "missed" });
            } else {
                await updateDoc(callRef, { status: "completed" });
            }
            currentCallDocId.current = null;
        }

        if (currentCallRef.current) {
            currentCallRef.current.close();
            currentCallRef.current = null;
        }

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
            setLocalStream(null);
        }

        setRemoteStream(null);
        setCallStatus("ended");
        setIsMuted(false);
        setIsVideoOff(false);
    };

    return (
        <CallContext.Provider value={{
            callInfo,
            callStatus,
            localStream,
            remoteStream,
            isMuted,
            setIsMuted,
            isVideoOff,
            setIsVideoOff,
            handleStartCall,
            handleAcceptCall,
            handleDeclineCall,
            handleEndCall,
            callHistory
        }}>
            <Script
                src="https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"
                strategy="lazyOnload"
            />
            {children}
            <CallOverlay
                isOpen={callInfo.isOpen}
                type={callInfo.type}
                status={callStatus}
                user={callInfo.user}
                localStream={localStream}
                remoteStream={remoteStream}
                onAccept={handleAcceptCall}
                onDecline={handleDeclineCall}
                onEnd={handleEndCall}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                isVideoOff={isVideoOff}
                setIsVideoOff={setIsVideoOff}
            />
        </CallContext.Provider>
    );
};

export const useCall = () => {
    const context = useContext(CallContext);
    if (context === undefined) {
        throw new Error("useCall must be used within a CallProvider");
    }
    return context;
};
