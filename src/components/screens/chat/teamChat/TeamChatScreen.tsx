"use client";
import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AuthContext from "@/contexts/authContext/authContext";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";
import { Message } from "./types";
import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";

const TeamChatScreen = () => {
    const { user: currentUser } = useContext(AuthContext);
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const { users } = useGetUsers();

    const [activeTab, setActiveTab] = useState<"chats" | "calls">("chats");
    const [activeChatId, setActiveChatId] = useState<string | null>(userId);
    const [messageText, setMessageText] = useState("");
    const [chatUser, setChatUser] = useState<IUser | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (activeChatId && users) {
            const user = users.find((u: IUser) => u.id === activeChatId);
            if (user) setChatUser(user);
        }
    }, [activeChatId, users]);

    const getConversationId = (uid1: string, uid2: string) => {
        return [uid1, uid2].sort().join('_');
    };

    // Real-time message listener
    useEffect(() => {
        if (!activeChatId || !currentUser?.id) {
            setMessages([]);
            return;
        }

        const convoId = getConversationId(currentUser.id, activeChatId);
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
                        : "Sending..."
                } as Message;
            });
            setMessages(msgs);
        }, (error) => {
            console.error("Firestore Listener Error:", error);
        });

        return () => unsubscribe();
    }, [activeChatId, currentUser]);

    const handleSendMessage = async () => {
        if (!messageText.trim() || !activeChatId || !currentUser?.id) return;

        const text = messageText;
        setMessageText("");
        const convoId = getConversationId(currentUser.id, activeChatId);

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
                users={users}
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
                messages={messages}
                currentUserId={currentUser?.id}
                messageText={messageText}
                setMessageText={setMessageText}
                handleSendMessage={handleSendMessage}
            />
        </div>
    );
};

export default TeamChatScreen;
