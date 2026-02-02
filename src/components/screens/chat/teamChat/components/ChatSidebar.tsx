import React, { useEffect, useState } from "react";
import { Search, Pin, Users, Phone, MessageSquare, Plus, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IUser } from "@/types/interface/user.interface";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import { Group } from "../types";

import CreateGroupModal from "./CreateGroupModal";
import { CallChatRounded, ChatRoundLine, UsersGroupRounded, UsersGroupTwoRounded } from "@solar-icons/react";

interface ChatSidebarProps {
    users: IUser[];
    currentUserId?: string;
    activeChatId: string | null;
    setActiveChatId: (id: string | null) => void;
    activeTab: "chats" | "calls" | "groups";
    setActiveTab: (tab: "chats" | "calls" | "groups") => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    callHistory: any[];
    onStartCall: (type: "audio" | "video", user: IUser) => void;
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
    callHistory,
    onStartCall,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("pinned_chats");
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        localStorage.setItem("pinned_chats", JSON.stringify(pinnedIds));
    }, [pinnedIds]);

    // Fetch groups where current user is a member
    useEffect(() => {
        if (!currentUserId) return;
        const q = query(
            collection(db, "groups"),
            where("members", "array-contains", currentUserId)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const grps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group));
            setGroups(grps);
        });
        return () => unsubscribe();
    }, [currentUserId]);

    const togglePin = (userId: string) => {
        setPinnedIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [userId, ...prev]
        );
    };

    const filteredUsers = users?.filter(user =>
        user.id !== currentUserId &&
        (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const aPinned = pinnedIds.includes(a.id);
        const bPinned = pinnedIds.includes(b.id);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return 0;
    });

    const tabs: { id: "chats" | "calls" | "groups"; label: string; icon: any; color: string }[] = [
        { id: "chats", label: "Chats", icon: ChatRoundLine, color: "text-blue-600" },
        { id: "groups", label: "Spaces", icon: UsersGroupRounded, color: "text-purple-600" },
        { id: "calls", label: "Calls", icon: CallChatRounded, color: "text-green-600" },
    ];

    const getUnderlineColor = () => {
        if (activeTab === "chats") return "bg-blue-600";
        if (activeTab === "groups") return "bg-purple-600";
        if (activeTab === "calls") return "bg-green-600";
        return "bg-gray-900";
    };

    return (
        <div className={cn(
            "w-full lg:w-[380px] border-r border-white/20 rounded-2xl flex flex-col bg-white/90 backdrop-blur-md mr-4 shadow-xl overflow-hidden shadow-gray-200/50",
            activeChatId && "hidden lg:flex"
        )}>
            {/* Tabs Header */}
            <div className="flex px-8 pt-8 gap-10 border-b border-gray-100 italic-none">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "pb-4 text-lg font-bold transition-all relative flex items-center gap-2",
                            activeTab === tab.id ? tab.color : "text-gray-400 hover:text-gray-500"
                        )}
                    >
                        <tab.icon className={cn(
                            "h-5 w-5 transition-all",
                            activeTab === tab.id ? "fill-current stroke-[2px]" : "stroke-2"
                        )} />
                        <span className="text-sm">{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="tab-underline"
                                className={cn("absolute bottom-0 left-[-2px] right-[-2px] h-[3px] rounded-t-full", getUnderlineColor())}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Search and Action */}
            <div className="px-2 py-2 space-y-4 my-3">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            placeholder={activeTab === 'groups' ? "Search groups..." : "Search messages or contact..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-100/70 border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:bg-white outline-none transition-all font-medium placeholder:text-gray-400"
                        />
                    </div>
                    {activeTab === 'groups' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="h-10 w-10 flex items-center justify-center bg-gray-900/80 text-white rounded-xl hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gray-200"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
                <AnimatePresence mode="wait">
                    {activeTab === "chats" && (
                        <motion.div
                            key="chats"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-1"
                        >
                            {sortedUsers.map((user) => (
                                <UserChatItem
                                    key={user.id}
                                    user={user}
                                    currentUserId={currentUserId}
                                    activeChatId={activeChatId}
                                    setActiveChatId={setActiveChatId}
                                    isPinned={pinnedIds.includes(user.id)}
                                    onTogglePin={() => togglePin(user.id)}
                                />
                            ))}
                            {sortedUsers.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare className="h-8 w-8 text-gray-200" />
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium">No conversations found</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "groups" && (
                        <motion.div
                            key="groups"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-1"
                        >
                            {groups.map(group => (
                                <GroupChatItem
                                    key={group.id}
                                    group={group}
                                    activeChatId={activeChatId}
                                    setActiveChatId={setActiveChatId}
                                    currentUserId={currentUserId}
                                />
                            ))}
                            {groups.length === 0 && (
                                <div className="text-center py-20 px-10">
                                    <div className="h-20 w-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Users className="h-10 w-10 text-orange-200" />
                                    </div>
                                    <h3 className="text-gray-900 font-bold mb-2">No Groups Yet</h3>
                                    <p className="text-gray-400 text-sm">Create a group to start collaborating with your team.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                    {activeTab === "calls" && (
                        <motion.div
                            key="calls"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-1"
                        >
                            {callHistory.map(call => {
                                const otherParticipantId = call.callerId === currentUserId ? call.receiverId : call.callerId;
                                const otherUser = users.find(u => u.id === otherParticipantId);
                                return (
                                    <CallHistoryItem
                                        key={call.id}
                                        call={call}
                                        user={otherUser}
                                        isOutgoing={call.callerId === currentUserId}
                                        onRedial={onStartCall}
                                    />
                                );
                            })}
                            {callHistory.length === 0 && (
                                <div className="text-center py-20 px-10">
                                    <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Phone className="h-10 w-10 text-green-200" />
                                    </div>
                                    <h3 className="text-gray-900 font-bold mb-2">No Calls Yet</h3>
                                    <p className="text-gray-400 text-sm">Your recent voice and video calls will appear here.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <CreateGroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                users={users}
                currentUserId={currentUserId || ""}
            />
        </div>
    );
};

// ... keep UserChatItem as is but maybe add some group hover effects ...
// Add GroupChatItem component
const GroupChatItem = ({ group, activeChatId, setActiveChatId, currentUserId }: {
    group: Group;
    activeChatId: string | null;
    setActiveChatId: (id: string | null) => void;
    currentUserId?: string;
}) => {
    const [lastMessage, setLastMessage] = useState<{ text: string; time: string } | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!group.id) return;

        const q = query(
            collection(db, "conversations", group.id, "messages"),
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
    }, [group.id]);

    useEffect(() => {
        if (!group.id || !currentUserId) return;

        const q = query(
            collection(db, "conversations", group.id, "messages"),
            where("isRead", "==", false)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const count = snapshot.docs.filter(doc => doc.data().senderId !== currentUserId).length;
            setUnreadCount(count);
        });

        return () => unsubscribe();
    }, [group.id, currentUserId]);

    return (
        <button
            onClick={() => setActiveChatId(group.id)}
            className={cn(
                "w-full flex items-center gap-4 p-4 rounded-3xl transition-all group relative",
                activeChatId === group.id ? "bg-gray-100" : "hover:bg-gray-50/50"
            )}
        >
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-100 transition-transform group-hover:scale-105">
                {group.name.charAt(0)}
            </div>
            <div className="flex-1 text-left">
                <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors uppercase tracking-tight text-sm">{group.name}</span>
                    <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        unreadCount > 0 ? "text-purple-600" : "text-gray-400"
                    )}>
                        {lastMessage?.time || (group.lastMessageTime ? "Today" : "New")}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <p className={cn(
                        "text-sm truncate max-w-[200px] font-medium italic-none",
                        unreadCount > 0 ? "text-gray-900 font-bold" : "text-gray-500"
                    )}>
                        {lastMessage?.text || group.lastMessage || `${group.members.length} members`}
                    </p>
                    {unreadCount > 0 && (
                        <span className="bg-purple-600 text-white text-[10px] font-black h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                            {unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

const UserChatItem = ({ user, currentUserId, activeChatId, setActiveChatId, isPinned, onTogglePin }: {
    user: IUser;
    currentUserId?: string;
    activeChatId: string | null;
    setActiveChatId: (id: string | null) => void;
    isPinned: boolean;
    onTogglePin: () => void;
}) => {
    const [lastMessage, setLastMessage] = useState<{ text: string; time: string } | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

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

    useEffect(() => {
        if (!currentUserId || !user.id) return;

        const convoId = [currentUserId, user.id].sort().join('_');
        const q = query(
            collection(db, "conversations", convoId, "messages"),
            where("isRead", "==", false)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const count = snapshot.docs.filter(doc => doc.data().senderId === user.id).length;
            setUnreadCount(count);
        });

        return () => unsubscribe();
    }, [currentUserId, user.id]);

    return (
        <button
            onClick={() => setActiveChatId(user.id)}
            className={cn(
                "w-full flex items-center gap-4 p-2.5 rounded-2xl transition-all group relative",
                activeChatId === user.id ? "bg-gray-100" : "hover:bg-gray-50/50"
            )}
        >
            <div className="relative">
                <div className="h-11 w-11 rounded-full bg-gray-200 overflow-hidden shadow-sm ring-2 ring-white group-hover:scale-105 transition-transform">
                    {user.profile_picture ? (
                        <Image src={user.profile_picture} alt="" width={48} height={48} />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold">
                            {user.full_name?.charAt(0)}
                        </div>
                    )}
                </div>
                <div className={cn(
                    "absolute bottom-0.5 right-0.5 h-3 w-3 border-2 border-white rounded-full ring-1 ring-black/5 transition-all duration-300",
                    user.status === "online" ? "bg-green-500 scale-100" : "bg-gray-300 scale-90"
                )} />
            </div>

            <div className="flex-1 text-left pr-3">
                <div className="flex justify-between items-center mb-0.5">
                    <span className={cn(
                        "font-bold text-sm transition-colors",
                        activeChatId === user.id ? "text-blue-600" : "text-gray-900 group-hover:text-blue-600"
                    )}>{user.full_name}</span>
                    <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        unreadCount > 0 ? "text-blue-600" : "text-gray-400"
                    )}>{lastMessage?.time || "New"}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className={cn(
                        "text-sm truncate max-w-[170px] font-medium italic-none transition-all",
                        unreadCount > 0 ? "text-gray-900 font-bold" : "text-gray-500"
                    )}>
                        {lastMessage?.text || "Click to start chatting"}
                    </span>
                    {unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] font-black h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                            {unreadCount}
                        </span>
                    )}
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin();
                }}
                className={cn(
                    "absolute right-4 p-1.5 top-2/3 -translate-y-1/2 rounded-full transition-all duration-200",
                    isPinned
                        ? "text-blue-500 bg-blue-50 scale-100 opacity-100"
                        : "text-gray-300 opacity-0 group-hover:opacity-100 hover:text-gray-600 hover:bg-gray-100"
                )}
            >
                <Pin className={cn("h-3.5 w-3.5", isPinned && "fill-current")} />
            </button>
        </button>
    );
};

const CallHistoryItem = ({
    call,
    user,
    isOutgoing,
    onRedial
}: {
    call: any;
    user?: IUser;
    isOutgoing: boolean;
    onRedial: (type: "audio" | "video", user: IUser) => void;
}) => {
    const isMissed = call.status === "missed";
    const StatusIcon = call.type === "video" ? Video : Phone;

    return (
        <div className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50/50 transition-all group">
            <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white transition-transform group-hover:scale-105">
                    {user?.profile_picture ? (
                        <Image src={user.profile_picture} alt="" width={44} height={44} />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-400 text-white font-bold">
                            {user?.full_name?.charAt(0) || "?"}
                        </div>
                    )}
                </div>
                <div className="flex-1 text-left">
                    <div className="flex flex-col">
                        <span className={cn("font-bold text-[13px]", isMissed ? "text-red-500" : "text-gray-900")}>
                            {user?.full_name || "Unknown"}
                        </span>
                        <div className={cn(
                            "flex items-center gap-1 text-[11px] font-bold uppercase tracking-tight mt-0.5",
                            isMissed ? "text-red-400" : "text-gray-400"
                        )}>
                            <StatusIcon className="h-3 w-3" />
                            <span>{isMissed ? "Missed" : isOutgoing ? "Outgoing" : "Incoming"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">
                    {call.timestamp?.toDate() ? call.timestamp.toDate().toLocaleDateString() : "Recent"}
                </span>

                {user && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRedial(call.type, user);
                        }}
                        className={cn(
                            "h-9 w-9 rounded-xl flex items-center justify-center transition-all",
                            call.type === "video"
                                ? "bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white"
                                : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                        )}
                    >
                        {call.type === "video" ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
