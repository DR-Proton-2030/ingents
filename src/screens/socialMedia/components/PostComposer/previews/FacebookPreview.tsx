"use client";
import React from "react";
import {
    FiImage,
    FiMoreHorizontal,
    FiThumbsUp,
    FiMessageCircle,
    FiShare2,
} from "react-icons/fi";
import { UploadedImage } from "../types";

interface FacebookPreviewProps {
    content: string;
    images: UploadedImage[];
}

export default function FacebookPreview({ content, images }: FacebookPreviewProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-w-[400px] mx-auto shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-bold">
                    Y
                </div>
                <div className="flex-grow">
                    <p className="text-sm font-semibold text-slate-900">Your Brand</p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <span>Just now</span>
                        <span>·</span>
                        <span>🌐</span>
                    </div>
                </div>
                <FiMoreHorizontal className="text-slate-600" />
            </div>

            {/* Content */}
            <div className="px-3 pb-2">
                <p className="text-sm text-slate-800 whitespace-pre-wrap">
                    {content || "Your post content will appear here..."}
                </p>
            </div>

            {/* Image */}
            {images.length > 0 ? (
                <div className="w-full aspect-video bg-slate-100">
                    <img src={images[0].preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <FiImage size={48} className="text-slate-300" />
                </div>
            )}

            {/* Reactions */}
            <div className="px-3 py-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                    <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px]">👍</div>
                            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-[8px]">❤️</div>
                        </div>
                        <span>245</span>
                    </div>
                    <span>32 comments · 12 shares</span>
                </div>
                <div className="flex items-center justify-around border-t border-slate-100 pt-2">
                    <button className="flex items-center gap-2 text-slate-600 hover:bg-slate-100 px-4 py-1.5 rounded-lg transition-colors text-sm">
                        <FiThumbsUp size={16} />
                        <span>Like</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-600 hover:bg-slate-100 px-4 py-1.5 rounded-lg transition-colors text-sm">
                        <FiMessageCircle size={16} />
                        <span>Comment</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-600 hover:bg-slate-100 px-4 py-1.5 rounded-lg transition-colors text-sm">
                        <FiShare2 size={16} />
                        <span>Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
