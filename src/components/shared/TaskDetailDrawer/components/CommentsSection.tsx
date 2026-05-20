"use client";
import React from "react";
import { Paperclip, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Comment {
    id: string;
    author: string;
    avatar?: string;
    time: string;
    text: string;
}

interface CommentsSectionProps {
    activeTab: "comments" | "updates";
    setActiveTab: (tab: "comments" | "updates") => void;
    commentText: string;
    setCommentText: (text: string) => void;
    comments: Comment[];
    onSendComment: () => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
    activeTab,
    setActiveTab,
    commentText,
    setCommentText,
    comments,
    onSendComment,
}) => {
    return (
        <div className="space-y-6">
            {/* Tabs Headers (Comments & Updates) */}
            <div className="pt-6 border-t border-gray-100">
                <div className="flex gap-6 border-b border-gray-100 pb-3">
                    <button
                        type="button"
                        onClick={() => setActiveTab("comments")}
                        className={cn(
                            "relative text-sm font-bold transition-all duration-200 pb-1",
                            activeTab === "comments"
                                ? "text-black after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[2px] after:bg-black"
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        Comments
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("updates")}
                        className={cn(
                            "relative text-sm font-bold transition-all duration-200 pb-1",
                            activeTab === "updates"
                                ? "text-black after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[2px] after:bg-black"
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        Updates
                    </button>
                </div>
            </div>

            {/* Tab Contents */}
            {activeTab === "comments" ? (
                <div className="space-y-6 pt-4 pb-8 max-w-xl">
                    {/* Comments Feed List */}
                    <div className="space-y-4">
                        {comments.map((comm) => (
                            <div key={comm.id} className="flex items-start gap-3 group">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 uppercase text-xs shrink-0 overflow-hidden border">
                                    <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-indigo-400 text-white flex items-center justify-center">
                                        {comm.author.charAt(0)}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-800">{comm.author}</span>
                                        <span className="text-[10px] text-gray-400">{comm.time}</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 leading-relaxed bg-gray-50/50 rounded-2xl px-4 py-2 border border-gray-100/50 w-fit">
                                        {comm.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Comment Input Bar */}
                    <div className="flex gap-3 pt-4 items-center">
                        <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-full focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-500/60 transition-all">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") onSendComment();
                                }}
                                className="flex-1 text-sm font-medium text-gray-700 bg-transparent border-none outline-none focus:ring-0 p-0 focus-visible:outline-none placeholder:text-gray-400"
                            />
                            <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
                                <Paperclip className="w-4.5 h-4.5" />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={onSendComment}
                            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/20"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="pt-4 pb-8 text-xs text-gray-400 italic text-center">
                    No system updates for this task yet.
                </div>
            )}
        </div>
    );
};
