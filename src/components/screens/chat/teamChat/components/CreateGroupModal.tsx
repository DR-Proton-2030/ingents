"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CloseCircle, CheckCircle, } from "@solar-icons/react";
import { IUser } from "@/types/interface/user.interface";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Check, SearchIcon } from "lucide-react";
import { Search } from "@solar-icons/react/ssr/category";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: IUser[];
    currentUserId: string;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, users, currentUserId }) => {
    const [groupName, setGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([currentUserId]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (typeof document === "undefined") return null;

    const filteredUsers = users.filter(user =>
        user.id !== currentUserId &&
        (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const toggleMember = (userId: string) => {
        setSelectedMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleCreate = async () => {
        if (!groupName.trim() || selectedMembers.length < 2) return;
        setIsSubmitting(true);

        try {
            await addDoc(collection(db, "groups"), {
                name: groupName,
                members: selectedMembers,
                createdBy: currentUserId,
                createdAt: serverTimestamp(),
                lastMessage: "Group created",
                lastMessageTime: serverTimestamp()
            });
            onClose();
            setGroupName("");
            setSelectedMembers([currentUserId]);
        } catch (error) {
            console.error("Error creating group:", error);
            alert("Failed to create group");
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-[9999] transition-opacity duration-300",
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div
                className={cn(
                    "absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="m-3 bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 text-white shrink-0 rounded-xl relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 h-24 w-24 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold leading-none mb-1">New Group</h2>
                            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Create a team workspace</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <CloseCircle className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 scrollbar-hide pb-24">
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Group Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter group name..."
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    {/* Member Selection */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Add Members</label>
                            <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">{selectedMembers.length - 1} Selected</span>
                        </div>

                        <div className="relative group">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search friends..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                            />
                        </div>

                        <div className="space-y-1.5">
                            {filteredUsers.map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => toggleMember(user.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group/item",
                                        selectedMembers.includes(user.id)
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                            : "hover:bg-gray-50 border border-transparent hover:border-gray-100"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-10 w-10 rounded-full overflow-hidden flex items-center justify-center font-bold relative ring-2 ring-white",
                                            selectedMembers.includes(user.id) ? "bg-white/20" : "bg-gray-100 text-gray-400"
                                        )}>
                                            {user.profile_picture ? (
                                                <Image src={user.profile_picture} alt="" width={40} height={40} />
                                            ) : user.full_name?.charAt(0)}
                                        </div>
                                        <div className="text-left">
                                            <p className={cn("text-sm font-bold", selectedMembers.includes(user.id) ? "text-white" : "text-gray-900")}>
                                                {user.full_name}
                                            </p>
                                            <p className={cn("text-[10px] font-medium opacity-60", selectedMembers.includes(user.id) ? "text-white" : "text-gray-400")}>
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedMembers.includes(user.id) && (
                                        <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center">
                                            <Check className="h-3.5 w-3.5 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                            {filteredUsers.length === 0 && searchTerm && (
                                <div className="text-center py-10">
                                    <p className="text-gray-400 text-xs font-medium">No users found matching "{searchTerm}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 shrink-0 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.05)]">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl border border-gray-100 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={isSubmitting || !groupName.trim() || selectedMembers.length < 2}
                            className={cn(
                                "flex-[2] h-12 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                groupName.trim() && selectedMembers.length >= 2
                                    ? "bg-black text-white shadow-xl shadow-gray-200 hover:scale-[1.02] active:scale-[0.98]"
                                    : "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none"
                            )}
                        >
                            {isSubmitting ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <CheckCircle className="h-5 w-5" />
                                    <span>Create Group</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CreateGroupModal;
