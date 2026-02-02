import React, { useEffect, useRef } from "react";
import { ChevronLeft, Phone, Video, MoreHorizontal, MessageSquare, Image as ImageIcon, Paperclip, Send, Check, CheckCheck } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IUser } from "@/types/interface/user.interface";
import { Message, Group } from "../types";

interface ChatWindowProps {
    activeChatId: string | null;
    setActiveChatId: (id: string | null) => void;
    chatUser: IUser | null;
    activeGroup: Group | null;
    messages: Message[];
    currentUserId?: string;
    messageText: string;
    setMessageText: (text: string) => void;
    handleSendMessage: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
    activeChatId,
    setActiveChatId,
    chatUser,
    activeGroup,
    messages,
    currentUserId,
    messageText,
    setMessageText,
    handleSendMessage,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!activeChatId) {
        return (
            <div className="flex-1 hidden lg:flex flex-col items-center justify-center bg-white/20">
                <div className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                        <MessageSquare className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Select a communication</h3>
                    <p className="text-gray-500 max-w-xs">Choose a contact from the list to start a conversation or view calls.</p>
                </div>
            </div>
        );
    }

    const title = chatUser?.full_name || activeGroup?.name || "Chat Room";
    const isOnline = chatUser?.status === "online";
    const subtitle = chatUser
        ? (isOnline ? "Online" : "Offline")
        : `${activeGroup?.members.length || 0} members`;

    return (
        <div className="flex-1 flex flex-col bg-white/10 rounded-xl">
            {/* Chat Header */}
            <div className="h-20 px-6 flex items-center justify-between border-b border-white/20 bg-white/40">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setActiveChatId(null)}
                        className="lg:hidden p-2 -ml-2 hover:bg-gray-50 rounded-full"
                    >
                        <ChevronLeft className="h-6 w-6 text-gray-600" />
                    </button>
                    <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/40">
                        {chatUser ? (
                            chatUser.profile_picture ? (
                                <Image src={chatUser.profile_picture} alt="" width={40} height={40} />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold">
                                    {chatUser.full_name?.charAt(0)}
                                </div>
                            )
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold">
                                {activeGroup?.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">{title}</h4>
                        <div className="flex items-center gap-1.5">
                            <div className={cn(
                                "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                                chatUser ? (isOnline ? "bg-green-500" : "bg-gray-400") : "bg-purple-500"
                            )} />
                            <span className={cn(
                                "text-[11px] font-bold transition-colors duration-300",
                                chatUser ? (isOnline ? "text-green-500" : "text-gray-400") : "text-purple-500"
                            )}>
                                {subtitle}
                            </span>
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
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col"
            >
                {messages.map((msg) => (
                    <div key={msg.id} className={cn(
                        "flex flex-col max-w-[80%]",
                        msg.senderId === currentUserId ? "ml-auto items-end" : "items-start"
                    )}>
                        <div className={cn(
                            "px-5 py-3.5 rounded-2xl text-sm font-medium shadow-sm backdrop-blur-sm transition-all",
                            msg.senderId === currentUserId
                                ? "bg-gray-900 text-white rounded-tr-none shadow-gray-200/50"
                                : "bg-white/70 text-gray-800 rounded-tl-none border border-white/50 shadow-white/20"
                        )}>
                            {msg.text}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 px-1">
                            <span className="text-[10px] text-gray-400 font-bold">{msg.timestamp}</span>
                            {msg.senderId === currentUserId && (
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
                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-gray-900 placeholder:text-gray-400"
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
        </div>
    );
};

export default ChatWindow;
