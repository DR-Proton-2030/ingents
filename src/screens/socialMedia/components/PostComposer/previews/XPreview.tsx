"use client";
import React from "react";
import {
    FiMessageCircle,
    FiHeart,
    FiShare2,
    FiRepeat,
} from "react-icons/fi";
import { UploadedImage } from "../types";

interface XPreviewProps {
    content: string;
    images: UploadedImage[];
}

export default function XPreview({ content, images }: XPreviewProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-w-[400px] mx-auto shadow-lg">
            <div className="p-4">
                {/* Header */}
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold flex-shrink-0">
                        Y
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-slate-900 truncate">Your Brand</span>
                            <span className="text-sm text-slate-500">@yourbrand</span>
                            <span className="text-sm text-slate-400">· now</span>
                        </div>

                        {/* Content */}
                        <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap">
                            {content || "Your post content will appear here..."}
                        </p>

                        {/* Image */}
                        {images.length > 0 && (
                            <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200">
                                <img src={images[0].preview} alt="Preview" className="w-full aspect-video object-cover" />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-3 max-w-[300px]">
                            <button className="flex items-center gap-1 text-slate-500 hover:text-blue-500 transition-colors text-sm">
                                <FiMessageCircle size={16} />
                                <span>24</span>
                            </button>
                            <button className="flex items-center gap-1 text-slate-500 hover:text-green-500 transition-colors text-sm">
                                <FiRepeat size={16} />
                                <span>12</span>
                            </button>
                            <button className="flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors text-sm">
                                <FiHeart size={16} />
                                <span>156</span>
                            </button>
                            <button className="flex items-center gap-1 text-slate-500 hover:text-blue-500 transition-colors text-sm">
                                <FiShare2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
