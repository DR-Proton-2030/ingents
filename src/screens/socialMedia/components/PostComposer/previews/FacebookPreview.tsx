"use client";
import React from "react";
import {
    FiImage,
    FiMoreHorizontal,
    FiThumbsUp,
    FiMessageCircle,
    FiShare2,
    FiPlay,
    FiVideo,
} from "react-icons/fi";
import { UploadedImage, UploadedVideo } from "../types";

interface FacebookPreviewProps {
    content: string;
    images: UploadedImage[];
    video?: UploadedVideo | null;
}

export default function FacebookPreview({ content, images, video }: FacebookPreviewProps) {
    const hasVideo = Boolean(video?.preview || video?.url);
    const videoSrc = video?.preview || video?.url;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden max-w-[420px] mx-auto shadow-xl group transition-all hover:border-blue-100">
            {/* Header */}
            <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-bold shadow-sm">
                    Y
                </div>
                <div className="flex-grow">
                    <p className="text-sm font-bold text-slate-900 leading-tight">Your Brand</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
                        <span>Just now</span>
                        <span>·</span>
                        <span className="text-xs">🌐</span>
                    </div>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <FiMoreHorizontal className="text-slate-400" />
                </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {content || "Your post content will appear here and look amazing across the Facebook feed..."}
                </p>
            </div>

            {/* Media */}
            <div className="relative border-y border-slate-100 bg-slate-50 min-h-[220px] flex items-center justify-center">
                {hasVideo ? (
                    <div className="relative w-full aspect-video bg-black">
                        {videoSrc && !videoSrc.includes('youtube.com') ? (
                            <video src={videoSrc} className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                                <FiVideo className="w-12 h-12 text-slate-700 mb-2" />
                                <p className="text-[10px] text-white/50 text-center px-8 uppercase tracking-widest font-bold">Video Preview</p>
                            </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-black/20 transition-colors">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl">
                                <FiPlay className="w-6 h-6 text-white translate-x-0.5" />
                            </div>
                        </div>
                    </div>
                ) : images.length > 0 ? (
                    <div className="w-full aspect-video">
                        <img src={images[0].preview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 opacity-30 select-none">
                        <FiImage size={64} className="text-slate-300" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Media Preview</p>
                    </div>
                )}
            </div>

            {/* Interactions */}
            <div className="px-4">
                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-[8px] font-bold shadow-sm">👍</div>
                            <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-[8px] font-bold shadow-sm">❤️</div>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">1.2K</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <span>24 Comments</span>
                        <span>·</span>
                        <span>12 Shares</span>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 py-1">
                    <button className="flex-1 flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl transition-all font-bold text-xs tracking-tight">
                        <FiThumbsUp size={16} />
                        <span>Like</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl transition-all font-bold text-xs tracking-tight">
                        <FiMessageCircle size={16} />
                        <span>Comment</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl transition-all font-bold text-xs tracking-tight">
                        <FiShare2 size={16} />
                        <span>Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
