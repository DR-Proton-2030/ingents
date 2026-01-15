"use client";
import React, { useRef, useEffect, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { ChatMessage, ParticipantState } from "./types";

interface MeetingChatProps {
    peerId: string;
    currentUser: { id: string; name: string; email: string };
    chatMessages: ChatMessage[];
    onSendMessage: (text: string) => void;
    allParticipants: ParticipantState[];
}

const avatarColors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-cyan-500",
];

const MeetingChat: React.FC<MeetingChatProps> = ({
    peerId,
    currentUser,
    chatMessages,
    onSendMessage,
    allParticipants,
}) => {
    const [chatInput, setChatInput] = useState("");
    const chatScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSendChat = () => {
        if (!chatInput.trim()) return;
        onSendMessage(chatInput);
        setChatInput("");
    };

    return (
        <div className="flex flex-col h-full">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    <span>Continuous chat is OFF</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Messages won't be saved when the call ends.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" ref={chatScrollRef}>
                {chatMessages.length === 0 && <div className="text-center text-gray-400 text-sm mt-8">No messages yet</div>}
                {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full ${avatarColors[allParticipants.findIndex((p) => p.id === msg.senderId) % avatarColors.length || 0]} flex items-center justify-center text-xs font-medium text-white flex-shrink-0`}>
                            {msg.senderId === peerId ? (currentUser.name?.charAt(0).toUpperCase() || "Y") : (msg.senderName?.charAt(0).toUpperCase() || msg.senderId.charAt(0).toUpperCase())}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-medium text-gray-900">{msg.senderId === peerId ? "You" : (msg.senderName || msg.senderId.substring(0, 8))}</span>
                                <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                            <p className="text-sm text-gray-700 break-words">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-gray-200">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                        placeholder="Send a message"
                        className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
                    />
                    <button
                        onClick={handleSendChat}
                        disabled={!chatInput.trim()}
                        className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MeetingChat;
