"use client";
import React from "react";
import {
    FiImage,
    FiMoreHorizontal,
    FiHeart,
    FiMessageCircle,
    FiSend,
    FiBookmark,
    FiPlay,
    FiVideo,
} from "react-icons/fi";
import { UploadedImage, UploadedVideo } from "../types";

interface InstagramPreviewProps {
    content: string;
    images: UploadedImage[];
    video?: UploadedVideo | null;
}

export default function InstagramPreview({ content, images, video }: InstagramPreviewProps) {
    const hasVideo = Boolean(video?.preview || video?.url);
    const videoSrc = video?.preview || video?.url;

    return (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden max-w-[380px] mx-auto shadow-2xl transition-all hover:shadow-indigo-500/10 active:scale-[0.99] cursor-default">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-100/50">
                <div className="relative group/avatar">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px]">
                        <div className="w-full h-full rounded-full bg-white p-[2px]">
                            <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                <span className="text-sm font-black text-indigo-600">Y</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    </div>
                </div>
                <div className="flex-grow min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate tracking-tight">your_brand</p>
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-500 font-medium">Original Audio</span>
                        <span className="text-[10px] text-slate-400">· 2h</span>
                    </div>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                    <FiMoreHorizontal size={20} />
                </button>
            </div>

            {/* Media Content */}
            <div className="relative aspect-square bg-[#0a0a0a] flex items-center justify-center overflow-hidden group/media">
                {hasVideo ? (
                    <div className="w-full h-full relative">
                        {videoSrc && !videoSrc.includes('youtube.com') ? (
                            <video src={videoSrc} className="w-full h-full object-cover" controls={false} muted loop autoPlay />
                        ) : (
                            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center">
                                <FiVideo size={48} className="text-white/20 mb-2" />
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Video Post</p>
                            </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover/media:bg-black/20 transition-colors pointer-events-none">
                            <div className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20">
                                <FiPlay size={32} className="text-white fill-white ml-1 shadow-2xl" />
                            </div>
                        </div>
                    </div>
                ) : images.length > 0 ? (
                    <div className="w-full h-full relative">
                        <img src={images[0].preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-105" />
                        {images.length > 1 && (
                            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-[10px] text-white font-bold tracking-tighter">
                                1/{images.length}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 animate-pulse">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center backdrop-blur-sm border border-white/10 ring-8 ring-white/5">
                            <FiImage size={40} className="text-white/20" />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 text-center">Instagram Feed</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 pt-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-5">
                        <button className="transform active:scale-90 transition-transform">
                            <FiHeart size={26} className="text-slate-800 hover:text-red-500 transition-colors" />
                        </button>
                        <button className="transform active:scale-90 transition-transform">
                            <FiMessageCircle size={26} className="text-slate-800 hover:text-indigo-500 transition-colors" />
                        </button>
                        <button className="transform active:scale-90 transition-transform">
                            <FiSend size={24} className="text-slate-800 hover:text-indigo-500 transition-colors -rotate-12" />
                        </button>
                    </div>
                    <button className="transform active:scale-90 transition-transform">
                        <FiBookmark size={26} className="text-slate-800 hover:text-indigo-500 transition-colors" />
                    </button>
                </div>

                <div className="space-y-1.5">
                    <p className="text-sm font-bold text-slate-900 tracking-tight">1,234 likes</p>
                    <div className="text-sm text-slate-800 leading-relaxed">
                        <span className="font-bold mr-2">your_brand</span>
                        <span className="whitespace-pre-wrap font-medium text-slate-700">
                            {content || "Craft your perfect Instagram moment here with high-impact visuals and engaging captions..."}
                        </span>
                    </div>
                    <button className="text-sm text-slate-400 font-medium hover:text-slate-600 block pt-1">View all 32 comments</button>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2">Just now</p>
                </div>
            </div>
        </div>
    );
}
