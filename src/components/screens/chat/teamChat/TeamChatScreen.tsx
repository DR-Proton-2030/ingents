"use client";
import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, getDoc, writeBatch, where, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AuthContext from "@/contexts/authContext/authContext";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";
import { Message, Group } from "./types";
import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";
import { useCall } from "@/contexts/CallContext";

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

    const {
        handleStartCall,
        callHistory
    } = useCall();

    // Derived user list with statuses
    const combinedUsers = React.useMemo(() => {
        return users.map(u => ({
            ...u,
            status: userStatuses[u.id]?.status || "offline",
            lastSeen: userStatuses[u.id]?.lastSeen
        }));
    }, [users, userStatuses]);

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

        setStatus("online");

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setStatus("online");
            }
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

    return (
        <div className="h-[80vh] w-full flex overflow-hidden">
            <ChatSidebar
                users={combinedUsers}
                currentUserId={currentUser?.id}
                activeChatId={activeChatId}
                setActiveChatId={setActiveChatId}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                callHistory={callHistory}
                onStartCall={handleStartCall}
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
        </div>
    );
};

export default TeamChatScreen;
