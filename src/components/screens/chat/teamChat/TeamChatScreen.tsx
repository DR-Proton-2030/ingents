"use client";
import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Search,
    MoreHorizontal,
    Send,
    Image as ImageIcon,
    Paperclip,
    Phone,
    Video,
    ChevronLeft,
    Check,
    CheckCheck,
    MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { IUser } from "@/types/interface/user.interface";
import { useSearchParams } from "next/navigation";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    where,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";
import AuthContext from "@/contexts/authContext/authContext";

interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: any;
    isRead: boolean;
    type: "text" | "image";
}

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
        console.log("Chat Debug - Current User:", currentUser);
        console.log("Chat Debug - Active Chat ID:", activeChatId);
    }, [currentUser, activeChatId]);

    useEffect(() => {
        if (activeChatId && users) {
            const user = users.find((u: IUser) => u.id === activeChatId);
            if (user) setChatUser(user);
        }
    }, [activeChatId, users]);

    // Get conversation ID (sorted user IDs to always hit the same document path)
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
            console.log(`Chat Debug - Received ${snapshot.docs.length} messages for convo ${convoId}`);
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
            console.log("Chat Debug - Parsed Messages:", msgs);
            setMessages(msgs);
        }, (error) => {
            console.error("Chat Debug - Firestore Listener Error:", error);
            alert("Firestore Error: " + error.message);
        });

        return () => unsubscribe();
    }, [activeChatId, currentUser]);

    const handleSendMessage = async () => {
        console.log("Attempting to send message...");
        if (!messageText.trim()) {
            console.log("Send failed: Message text is empty");
            return;
        }
        if (!activeChatId) {
            console.log("Send failed: No active chat ID");
            return;
        }
        if (!currentUser?.id) {
            console.log("Send failed: No current user logged in", currentUser);
            alert("You must be logged in to send messages.");
            return;
        }

        const text = messageText;
        setMessageText(""); // Clear input immediately for better UX

        const convoId = getConversationId(currentUser.id, activeChatId);

        try {
            await addDoc(collection(db, "conversations", convoId, "messages"), {
                text: text,
                senderId: currentUser.id,
                timestamp: serverTimestamp(),
                isRead: false,
                type: "text"
            });
            console.log("Message sent successfully!");
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message: " + (error instanceof Error ? error.message : String(error)));
        }
    };

    const filteredUsers = users?.filter(user =>
        user.id !== currentUser?.id &&
        (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

    return (
        <div className="h-[80vh] w-full flex overflow-hidden  ">
            {/* Left Side: Chat List */}
            <div className={cn(
                "w-full lg:w-[385px] border-r border-white/20 rounded-2xl flex flex-col bg-white/80 mr-4",
                activeChatId && "hidden lg:flex"
            )}>
                {/* Tabs */}
                <div className="flex px-6 pt-6 gap-8 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab("chats")}
                        className={cn(
                            "pb-4 text-lg font-bold transition-all relative",
                            activeTab === "chats" ? "text-gray-900" : "text-gray-400"
                        )}
                    >
                        Chats
                        {activeTab === "chats" && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("calls")}
                        className={cn(
                            "pb-4 text-lg font-bold transition-all relative",
                            activeTab === "calls" ? "text-gray-900" : "text-gray-400"
                        )}
                    >
                        Call
                        {activeTab === "calls" && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 rounded-t-full" />
                        )}
                    </button>
                </div>

                {/* Search */}
                <div className="p-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search messages or contact"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/40 border-none rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-white/20 transition-all font-medium placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Chat Items */}
                <div className="flex-1 overflow-y-auto px-2 space-y-1">
                    {filteredUsers.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => setActiveChatId(user.id)}
                            className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-3xl transition-all",
                                activeChatId === user.id ? "bg-gray-50" : "hover:bg-gray-50/50"
                            )}
                        >
                            <div className="relative">
                                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                                    {user.profile_picture ? (
                                        <Image src={user.profile_picture} alt="" width={48} height={48} />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500 font-bold">
                                            {user.full_name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                {/* Online Status (Mock for now, could be implemented with Firebase Realtime DB) */}
                                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                            </div>

                            <div className="flex-1 text-left">
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="font-bold text-gray-900">{user.full_name}</span>
                                    <span className="text-xs text-gray-400 font-medium">Just now</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={cn(
                                        "text-sm truncate max-w-[180px]",
                                        "text-gray-500"
                                    )}>
                                        Click to start chatting
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-400 text-sm">No users found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side: Chat Window */}
            <div className={cn(
                "flex-1 flex flex-col bg-white/10",
                !activeChatId && "hidden lg:flex items-center justify-center bg-white/20"
            )}>
                {activeChatId ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-20 px-6 flex items-center justify-between border-b border-white/20 bg-white/40">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setActiveChatId(null)}
                                    className="lg:hidden p-2 -ml-2 hover:bg-gray-50 rounded-full"
                                >
                                    <ChevronLeft className="h-6 w-6 text-gray-600" />
                                </button>
                                <div className="h-10 w-10 rounded-full bg-white/20 overflow-hidden ring-2 ring-white/40">
                                    {chatUser?.profile_picture ? (
                                        <Image src={chatUser.profile_picture} alt="" width={40} height={40} />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500 font-bold">
                                            {chatUser?.full_name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{chatUser?.full_name || "Chat User"}</h4>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                                        <span className="text-[11px] text-green-500 font-bold uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2.5 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
                                    <Phone className="h-5 w-5" />
                                </button>
                                <button className="p-2.5 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
                                    <Video className="h-5 w-5" />
                                </button>
                                <button className="p-2.5 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
                            {/* Visual Debug (Temporary) */}



                            {messages.map((msg) => (
                                <div key={msg.id} className={cn(
                                    "flex flex-col max-w-[80%]",
                                    msg.senderId === currentUser?.id ? "ml-auto items-end" : "items-start"
                                )}>
                                    <div className={cn(
                                        "px-5 py-3.5 rounded-2xl text-sm font-medium shadow-sm backdrop-blur-sm transition-all",
                                        msg.senderId === currentUser?.id
                                            ? "bg-gray-900 text-white rounded-tr-none shadow-gray-200/50"
                                            : "bg-white/70 text-gray-800 rounded-tl-none border border-white/50 shadow-white/20"
                                    )}>
                                        {msg.text}
                                    </div>
                                    <div className="mt-1 flex items-center gap-1.5 px-1">
                                        <span className="text-[10px] text-gray-400 font-bold">{msg.timestamp}</span>
                                        {msg.senderId === currentUser?.id && (
                                            msg.isRead ? <CheckCheck className="h-3 w-3 text-blue-500" /> : <Check className="h-3 w-3 text-gray-300" />
                                        )}
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm">
                                    <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
                                    <p>No messages yet. Say hello!</p>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white/20 backdrop-blur-lg border-t border-white/20 rounded-2xl">
                            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-2xl p-2 pl-4 border border-white/40 shadow-inner">
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <ImageIcon className="h-5 w-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <Paperclip className="h-5 w-5" />
                                </button>
                                <input
                                    type="text"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-900 placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!messageText.trim()}
                                    className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                                        messageText.trim() ? "bg-gray-900 text-white shadow-lg scale-100" : "bg-gray-100 text-gray-400 scale-95"
                                    )}
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                            <MessageSquare className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Select a communication</h3>
                        <p className="text-gray-500 max-w-xs">Choose a contact from the list to start a conversation or view calls.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamChatScreen;
