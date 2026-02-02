import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IUser } from "@/types/interface/user.interface";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

interface ChatSidebarProps {
    users: IUser[];
    currentUserId?: string;
    activeChatId: string | null;
    setActiveChatId: (id: string | null) => void;
    activeTab: "chats" | "calls";
    setActiveTab: (tab: "chats" | "calls") => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
    users,
    currentUserId,
    activeChatId,
    setActiveChatId,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
}) => {
    const filteredUsers = users?.filter(user =>
        user.id !== currentUserId &&
        (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

    return (
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
            <div className="p-2 my-3">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search messages or contact"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:outline-none focus:ring-white/20 transition-all font-medium placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Chat Items */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1">
                {filteredUsers.map((user) => (
                    <UserChatItem
                        key={user.id}
                        user={user}
                        currentUserId={currentUserId}
                        activeChatId={activeChatId}
                        setActiveChatId={setActiveChatId}
                    />
                ))}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-400 text-sm">No users found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const UserChatItem = ({ user, currentUserId, activeChatId, setActiveChatId }: {
    user: IUser;
    currentUserId?: string;
    activeChatId: string | null;
    setActiveChatId: (id: string | null) => void;
}) => {
    const [lastMessage, setLastMessage] = useState<{ text: string; time: string } | null>(null);

    useEffect(() => {
        if (!currentUserId || !user.id) return;

        const convoId = [currentUserId, user.id].sort().join('_');
        const q = query(
            collection(db, "conversations", convoId, "messages"),
            orderBy("timestamp", "desc"),
            limit(1)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                setLastMessage({
                    text: data.text,
                    time: data.timestamp?.toDate()
                        ? data.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                        : "Just now"
                });
            } else {
                setLastMessage(null);
            }
        });

        return () => unsubscribe();
    }, [currentUserId, user.id]);

    return (
        <button
            onClick={() => setActiveChatId(user.id)}
            className={cn(
                "w-full flex items-center gap-4 p-4 rounded-3xl transition-all",
                activeChatId === user.id ? "bg-gray-100" : "hover:bg-gray-50/50"
            )}
        >
            <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                    {user.profile_picture ? (
                        <Image src={user.profile_picture} alt="" width={48} height={48} />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-500 text-white font-bold">
                            {user.full_name?.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
            </div>

            <div className="flex-1 text-left">
                <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-gray-900">{user.full_name}</span>
                    <span className="text-xs text-gray-400 font-medium">{lastMessage?.time || "New"}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className={cn(
                        "text-sm truncate max-w-[180px]",
                        "text-gray-500"
                    )}>
                        {lastMessage?.text || "Click to start chatting"}
                    </span>
                </div>
            </div>
        </button>
    );
};

export default ChatSidebar;
