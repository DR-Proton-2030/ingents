"use client";
import React from "react";
import {
    FiMessageCircle,
    FiHeart,
    FiShare2,
    FiRepeat,
    FiMoreHorizontal,
    FiPlay,
    FiVideo,
    FiImage,
} from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import { UploadedImage, UploadedVideo } from "../types";

interface XPreviewProps {
    content: string;
    images: UploadedImage[];
    video?: UploadedVideo | null;
}

export default function XPreview({ content, images, video }: XPreviewProps) {
    const hasVideo = Boolean(video?.preview || video?.url);
    const videoSrc = video?.preview || video?.url;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden max-w-[420px] mx-auto shadow-xl transition-all hover:border-slate-300">
            <div className="p-4 sm:p-5">
                <div className="flex gap-3">
                    <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center text-white font-black flex-shrink-0 shadow-sm">
                        Y
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 min-w-0">
                                <span className="text-sm font-bold text-slate-900 truncate tracking-tight">Your Brand</span>
                                <FaCheckCircle className="text-blue-500 w-3.5 h-3.5 flex-shrink-0" />
                                <span className="text-xs text-slate-500 truncate font-medium">@yourbrand</span>
                                <span className="text-xs text-slate-400 font-medium">· now</span>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600">
                                <FiMoreHorizontal size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <p className="text-[14px] text-slate-800 mt-1.5 whitespace-pre-wrap leading-relaxed font-medium">
                            {content || "Draft your message for the X community. Keep it sharp and engaging! #Twitter #Marketing"}
                        </p>

                        {/* Media */}
                        {(hasVideo || images.length > 0) ? (
                            <div className="mt-3 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 group/media relative">
                                {hasVideo ? (
                                    <div className="relative aspect-video bg-black">
                                        {videoSrc && !videoSrc.includes('youtube.com') ? (
                                            <video src={videoSrc} className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                                                <FiVideo size={32} className="text-white/20 mb-2" />
                                                <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">Video Content</p>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover/media:bg-black/20 transition-colors">
                                            <div className="w-12 h-12 rounded-full bg-blue-500/90 flex items-center justify-center shadow-2xl scale-95 group-hover/media:scale-100 transition-transform">
                                                <FiPlay size={20} className="text-white fill-white ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <img src={images[0].preview} alt="Preview" className="w-full aspect-video object-cover transition-transform duration-500 group-hover/media:scale-105" />
                                )}
                            </div>
                        ) : (
                            <div className="mt-3 rounded-2xl border-2 border-dashed border-slate-100 aspect-video flex flex-col items-center justify-center bg-slate-50/50 opacity-50">
                                <FiImage size={32} className="text-slate-300 mb-2" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Post Preview</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-4 max-w-[340px] text-slate-500">
                            <button className="flex items-center gap-2 hover:text-blue-500 transition-all group/action">
                                <div className="p-2 rounded-full group-hover/action:bg-blue-50 transition-colors">
                                    <FiMessageCircle size={18} />
                                </div>
                                <span className="text-xs font-bold">24</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-green-500 transition-all group/action">
                                <div className="p-2 rounded-full group-hover/action:bg-green-50 transition-colors">
                                    <FiRepeat size={18} />
                                </div>
                                <span className="text-xs font-bold">12</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-pink-500 transition-all group/action">
                                <div className="p-2 rounded-full group-hover/action:bg-pink-50 transition-colors">
                                    <FiHeart size={18} className="group-hover/action:fill-pink-500" />
                                </div>
                                <span className="text-xs font-bold">156</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-blue-500 transition-all group/action">
                                <div className="p-2 rounded-full group-hover/action:bg-blue-50 transition-colors">
                                    <FiShare2 size={18} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
