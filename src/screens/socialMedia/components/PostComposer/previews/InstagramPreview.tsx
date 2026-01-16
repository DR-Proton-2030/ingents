"use client";
import React from "react";
import {
    FiImage,
    FiMoreHorizontal,
    FiHeart,
    FiMessageCircle,
    FiSend,
    FiBookmark,
} from "react-icons/fi";
import { UploadedImage } from "../types";

interface InstagramPreviewProps {
    content: string;
    images: UploadedImage[];
}

export default function InstagramPreview({ content, images }: InstagramPreviewProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-w-[350px] mx-auto shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-3 p-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-700">Y</span>
                    </div>
                </div>
                <div className="flex-grow">
                    <p className="text-sm font-semibold text-slate-900">your_brand</p>
                    <p className="text-[10px] text-slate-500">Sponsored</p>
                </div>
                <FiMoreHorizontal className="text-slate-600" />
            </div>

            {/* Image */}
            {images.length > 0 ? (
                <div className="aspect-square bg-slate-100">
                    <img src={images[0].preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <FiImage size={48} className="text-slate-300" />
                </div>
            )}

            {/* Actions */}
            <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <FiHeart size={22} className="text-slate-800 cursor-pointer hover:text-red-500 transition-colors" />
                        <FiMessageCircle size={22} className="text-slate-800 cursor-pointer" />
                        <FiSend size={20} className="text-slate-800 cursor-pointer" />
                    </div>
                    <FiBookmark size={22} className="text-slate-800 cursor-pointer" />
                </div>
                <p className="text-xs font-semibold text-slate-900 mb-1">1,234 likes</p>
                <p className="text-xs text-slate-800">
                    <span className="font-semibold">your_brand</span>{" "}
                    <span className="whitespace-pre-wrap">{content || "Your caption will appear here..."}</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-2 uppercase">Just now</p>
            </div>
        </div>
    );
}
