"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, getDoc, writeBatch, getDocs, where, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AuthContext from "@/contexts/authContext/authContext";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";
import { Message, Group } from "./types";
import Script from "next/script";
import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";
import CallOverlay from "./components/CallOverlay";

declare global {
    interface Window {
        Peer: any;
    }
}

const TeamChatScreen = () => {
    const { user: currentUser } = useContext(AuthContext);
    const searchParams = useSearchParams();
    const router = useRouter();
    const userId = searchParams.get("userId");
    const { users } = useGetUsers();

    const [activeTab, setActiveTab] = useState<"chats" | "calls" | "groups">("chats");
    const [activeChatId, setActiveChatId] = useState<string | null>(userId);
    const [messageText, setMessageText] = useState("");
    const [chatUser, setChatUser] = useState<IUser | null>(null);
    const [activeGroup, setActiveGroup] = useState<Group | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [userStatuses, setUserStatuses] = useState<Record<string, any>>({});

    // Calling State
    const [callInfo, setCallInfo] = useState<{
        isOpen: boolean;
        type: "audio" | "video";
        user: IUser | null;
    }>({ isOpen: false, type: "audio", user: null });
    const [callStatus, setCallStatus] = useState<"calling" | "incoming" | "connected" | "ended">("calling");
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    // Refs
    const peerRef = useRef<any>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const currentCallRef = useRef<any>(null);

    // Derived user list with statuses
    const combinedUsers = React.useMemo(() => {
        return users.map(u => ({
            ...u,
            status: userStatuses[u.id]?.status || "offline",
            lastSeen: userStatuses[u.id]?.lastSeen
        }));
    }, [users, userStatuses]);

    // Initialize PeerJS
    useEffect(() => {
        if (!currentUser?.id || typeof window === "undefined") return;

        const initPeer = () => {
            if (!window.Peer) return;

            const peer = new window.Peer(currentUser.id, {
                debug: 1,
                config: {
                    iceServers: [
                        { urls: "stun:stun.l.google.com:19302" },
                        { urls: "stun:global.stun.twilio.com:3478" },
                    ],
                },
            });

            peer.on("open", (id: string) => {
                console.log("PeerJS: Connection opened with ID:", id);
            });

            peer.on("call", (call: any) => {
                const caller = combinedUsers.find(u => u.id === call.peer);
                // Robust metadata extraction
                const metadata = call.metadata || call.options?.metadata;

                console.log("PeerJS: Incoming call from:", call.peer, "Metadata captured:", metadata);

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
            });

            peerRef.current = peer;
        };

        if (window.Peer) {
            initPeer();
        }

        return () => {
            if (peerRef.current) peerRef.current.destroy();
        };
    }, [currentUser?.id, combinedUsers]);

    // Handle Media Tracks (Mute/Video Off)
    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => {
                track.enabled = !isVideoOff;
            });
        }
    }, [isVideoOff]);

    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !isMuted;
            });
        }
    }, [isMuted]);

    // Fetch real-time user statuses
    useEffect(() => {
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const statuses: Record<string, any> = {};
            snapshot.docs.forEach(doc => {
                statuses[doc.id] = doc.data();
            });
            setUserStatuses(statuses);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (activeChatId && combinedUsers.length > 0) {
            const user = combinedUsers.find((u: IUser) => u.id === activeChatId);
            if (user) {
                setChatUser(user);
                setActiveGroup(null);
            } else {
                setChatUser(null);
                // Fetch group details
                const fetchGroup = async () => {
                    const groupDoc = await getDoc(doc(db, "groups", activeChatId));
                    if (groupDoc.exists()) {
                        setActiveGroup({ id: groupDoc.id, ...groupDoc.data() } as Group);
                    }
                };
                fetchGroup();
            }
        }
    }, [activeChatId, combinedUsers]);

    const getConversationId = (uid1: string, uid2: string) => {
        if (!uid1 || !uid2) return "";
        const targetUser = combinedUsers?.find(u => u.id === uid2);
        if (!targetUser) return uid2; // It's a groupId
        return [uid1, uid2].sort().join('_');
    };

    // Mark messages as read (Real-time)
    useEffect(() => {
        if (!activeChatId || !currentUser?.id) return;

        const convoId = getConversationId(currentUser.id, activeChatId);
        if (!convoId) return;

        const unreadQuery = query(
            collection(db, "conversations", convoId, "messages"),
            where("isRead", "==", false)
        );

        const unsubscribe = onSnapshot(unreadQuery, async (snapshot) => {
            const unreadDocs = snapshot.docs.filter(doc => doc.data().senderId !== currentUser.id);
            if (unreadDocs.length === 0) return;

            try {
                const batch = writeBatch(db);
                unreadDocs.forEach((msgDoc) => {
                    batch.update(msgDoc.ref, { isRead: true });
                });
                await batch.commit();
            } catch (error) {
                console.error("Error marking messages as read:", error);
            }
        }, (err) => {
            console.error("Unread Messages Listener Error:", err);
        });

        return () => unsubscribe();
    }, [activeChatId, currentUser?.id, users]);

    // Real-time message listener
    useEffect(() => {
        if (!activeChatId || !currentUser?.id) {
            setMessages([]);
            return;
        }

        const convoId = getConversationId(currentUser.id, activeChatId);
        if (!convoId) return;

        const q = query(
            collection(db, "conversations", convoId, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: Message[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate()
                        ? data.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                        : "Just now"
                } as Message;
            });
            setMessages(msgs);
        }, (error) => {
            console.error("Firestore Listener Error:", error);
        });

        return () => unsubscribe();
    }, [activeChatId, currentUser, users]);

    // Manage Online Status
    useEffect(() => {
        if (!currentUser?.id) return;

        const userRef = doc(db, "users", currentUser.id);

        const setStatus = async (status: "online" | "offline") => {
            console.log(`Setting status for ${currentUser.id} to ${status}`);
            try {
                await setDoc(userRef, {
                    status,
                    lastSeen: serverTimestamp(),
                    full_name: currentUser.full_name,
                    email: currentUser.email,
                    id: currentUser.id
                }, { merge: true });
            } catch (error) {
                console.error("Error updating status:", error);
            }
        };

        // Set online initially
        setStatus("online");

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setStatus("online");
            }
            // Removed offline on hidden to allow multi-tab testing
        };

        const handleBeforeUnload = () => {
            setStatus("offline");
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            setStatus("offline");
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [currentUser?.id]);

    const handleSendMessage = async () => {
        if (!messageText.trim() || !activeChatId || !currentUser?.id) return;

        const text = messageText;
        setMessageText("");
        const convoId = getConversationId(currentUser.id, activeChatId);
        if (!convoId) return;

        try {
            await addDoc(collection(db, "conversations", convoId, "messages"), {
                text,
                senderId: currentUser.id,
                timestamp: serverTimestamp(),
                isRead: false,
                type: "text"
            });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleStartCall = async (type: "audio" | "video") => {
        if (!chatUser || !peerRef.current || !currentUser?.id) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: type === "video",
                audio: true
            });

            setLocalStream(stream);
            localStreamRef.current = stream;
            setCallStatus("calling");
            setCallInfo({ isOpen: true, type, user: chatUser });

            const call = peerRef.current.call(chatUser.id, stream, {
                metadata: { type }
            });

            console.log("PeerJS: Call initiated. Type:", type);

            call.on("stream", (remoteMediaStream: MediaStream) => {
                setRemoteStream(remoteMediaStream);
                setCallStatus("connected");
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

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: callInfo.type === "video",
                audio: true
            });

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

    const handleDeclineCall = () => {
        if (currentCallRef.current) {
            currentCallRef.current.close();
        }
        handleEndCall();
    };

    const handleEndCall = () => {
        if (currentCallRef.current) currentCallRef.current.close();
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track: any) => track.stop());
        }
        setLocalStream(null);
        localStreamRef.current = null;
        setRemoteStream(null);
        setCallInfo(prev => ({ ...prev, isOpen: false }));
        setCallStatus("ended");
    };

    return (
        <div className="h-[80vh] w-full flex overflow-hidden">
            <Script
                src="https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"
                strategy="afterInteractive"
            />
            <ChatSidebar
                users={combinedUsers}
                currentUserId={currentUser?.id}
                activeChatId={activeChatId}
                setActiveChatId={setActiveChatId}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            <ChatWindow
                activeChatId={activeChatId}
                setActiveChatId={setActiveChatId}
                chatUser={chatUser}
                activeGroup={activeGroup}
                messages={messages}
                currentUserId={currentUser?.id}
                messageText={messageText}
                setMessageText={setMessageText}
                handleSendMessage={handleSendMessage}
                onStartCall={handleStartCall}
            />

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
        </div>
    );
};

export default TeamChatScreen;
