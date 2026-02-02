"use client";
import React, { useState, useEffect } from "react";
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

interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: string;
    isRead: boolean;
    type: "text" | "image";
}

interface Chat {
    id: string;
    user: Partial<IUser>;
    lastMessage: string;
    time: string;
    unreadCount: number;
    isOnline: boolean;
    isTyping?: boolean;
}

const TeamChatScreen = () => {
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const { users } = useGetUsers();
    const [activeTab, setActiveTab] = useState<"chats" | "calls">("chats");
    const [activeChatId, setActiveChatId] = useState<string | null>(userId);
    const [messageText, setMessageText] = useState("");
    const [chatUser, setChatUser] = useState<IUser | null>(null);

    useEffect(() => {
        if (activeChatId && users) {
            const user = users.find((u: IUser) => u.id === activeChatId);
            if (user) setChatUser(user);
        }
    }, [activeChatId, users]);

    // Mock data for demo
    const mockChats: Chat[] = [
        {
            id: "1",
            user: { full_name: "Leader-nim", profile_picture: "" },
            lastMessage: "Time is running!",
            time: "1m",
            unreadCount: 4,
            isOnline: true
        },
        {
            id: "2",
            user: { full_name: "Se Hun Oh", profile_picture: "" },
            lastMessage: "Just stop, I'm already late!!",
            time: "3m",
            unreadCount: 0,
            isOnline: false
        },
        {
            id: "3",
            user: { full_name: "Jong Dae Hyung", profile_picture: "" },
            lastMessage: "Typing...",
            time: "12m",
            unreadCount: 0,
            isOnline: true,
            isTyping: true
        }
    ];

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "m1",
            text: "which one you need? I kinda busy rn",
            senderId: "other",
            timestamp: "09:52",
            isRead: true,
            type: "text"
        },
        {
            id: "m2",
            text: "just explain it, I'll send some of it later",
            senderId: "other",
            timestamp: "09:52",
            isRead: true,
            type: "text"
        },
        {
            id: "m3",
            text: "I can't send all of them, it's quite a lot. Let's meet up, and I'll transfer them using airdrops.",
            senderId: "me",
            timestamp: "10:05",
            isRead: true,
            type: "text"
        }
    ]);

    const handleSendMessage = () => {
        if (!messageText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            senderId: "me",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            isRead: false,
            type: "text"
        };

        setMessages([...messages, newMessage]);
        setMessageText("");
    };

    return (
        <div className="h-[calc(100vh-100px)] w-full bg-white flex overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
            {/* Left Side: Chat List */}
            <div className={cn(
                "w-full lg:w-[380px] border-r border-gray-100 flex flex-col bg-white",
                activeChatId && "hidden lg:flex"
            )}>
                {/* Tabs */}
                <div className="flex px-6 pt-6 gap-8 border-b border-gray-50">
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
                            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-gray-100 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Chat Items */}
                <div className="flex-1 overflow-y-auto px-2 space-y-1">
                    {mockChats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setActiveChatId(chat.id)}
                            className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-3xl transition-all",
                                activeChatId === chat.id ? "bg-gray-50" : "hover:bg-gray-50/50"
                            )}
                        >
                            <div className="relative">
                                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                                    {chat.user.profile_picture ? (
                                        <Image src={chat.user.profile_picture} alt="" width={48} height={48} />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500 font-bold">
                                            {chat.user.full_name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                {chat.isOnline && (
                                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                                )}
                            </div>

                            <div className="flex-1 text-left">
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="font-bold text-gray-900">{chat.user.full_name}</span>
                                    <span className="text-xs text-gray-400 font-medium">{chat.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={cn(
                                        "text-sm truncate max-w-[180px]",
                                        chat.unreadCount > 0 ? "text-gray-900 font-bold" : "text-gray-500"
                                    )}>
                                        {chat.isTyping ? <span className="text-blue-500 italic">Typing...</span> : chat.lastMessage}
                                    </span>
                                    {chat.unreadCount > 0 && (
                                        <div className="h-5 min-w-[20px] px-1 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                            {chat.unreadCount}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Side: Chat Window */}
            <div className={cn(
                "flex-1 flex flex-col bg-gray-50/30",
                !activeChatId && "hidden lg:flex items-center justify-center bg-white"
            )}>
                {activeChatId ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-20 px-6 flex items-center justify-between border-b border-gray-100 bg-white">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setActiveChatId(null)}
                                    className="lg:hidden p-2 -ml-2 hover:bg-gray-50 rounded-full"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                                    {chatUser?.profile_picture ? (
                                        <Image src={chatUser.profile_picture} alt="" width={40} height={40} />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500 font-bold">
                                            {chatUser?.full_name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{chatUser?.full_name || "Baek Hyunnie"}</h4>
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
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="flex justify-center">
                                <span className="px-4 py-1.5 bg-white shadow-sm rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">Today</span>
                            </div>

                            {messages.map((msg) => (
                                <div key={msg.id} className={cn(
                                    "flex flex-col max-w-[80%]",
                                    msg.senderId === "me" ? "ml-auto items-end" : "items-start"
                                )}>
                                    <div className={cn(
                                        "px-5 py-3.5 rounded-2xl text-sm font-medium shadow-sm",
                                        msg.senderId === "me"
                                            ? "bg-gray-900 text-white rounded-tr-none"
                                            : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                                    )}>
                                        {msg.text}
                                    </div>
                                    <div className="mt-1 flex items-center gap-1.5 px-1">
                                        <span className="text-[10px] text-gray-400 font-bold">{msg.timestamp}</span>
                                        {msg.senderId === "me" && (
                                            msg.isRead ? <CheckCheck className="h-3 w-3 text-blue-500" /> : <Check className="h-3 w-3 text-gray-300" />
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Mock Image Message */}
                            <div className="flex flex-col items-start max-w-[80%]">
                                <div className="p-2 bg-white rounded-2xl border border-gray-100 shadow-sm rounded-tl-none">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="h-32 w-32 bg-gray-200 rounded-xl overflow-hidden relative" />
                                        <div className="h-32 w-32 bg-gray-200 rounded-xl overflow-hidden relative" />
                                    </div>
                                </div>
                                <div className="mt-1 px-1">
                                    <span className="text-[10px] text-gray-400 font-bold">10:15</span>
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-gray-100">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-2 pl-4">
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
