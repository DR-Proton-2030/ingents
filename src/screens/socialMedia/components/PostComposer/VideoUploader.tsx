"use client";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiVideo, FiPlus, FiTrash2, FiLink } from "react-icons/fi";
import { UploadedVideo } from "./types";

interface VideoUploaderProps {
    video: UploadedVideo | null;
    onUpload: (file: File) => void;
    onUrlSubmit: (url: string) => void;
    onRemove: () => void;
    hideUrlInput?: boolean;
}

export default function VideoUploader({
    video,
    onUpload,
    onUrlSubmit,
    onRemove,
    hideUrlInput = false,
}: VideoUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [showUrlInput, setShowUrlInput] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (videoUrl.trim()) {
            onUrlSubmit(videoUrl.trim());
            setVideoUrl("");
            setShowUrlInput(false);
        }
    };

    return (
        <div className="">
            <input
                type="file"
                id="video-upload-input"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*"
                className="hidden"
            />

            {video ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 aspect-video shadow-sm group">
                    {video.file ? (
                        <video
                            src={video.preview}
                            className="w-full h-full object-cover"
                            controls
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 gap-2">
                            <FiVideo size={32} className="text-indigo-500" />
                            <span className="text-xs font-medium text-slate-600 truncate max-w-[80%] px-4">
                                {video.url}
                            </span>
                        </div>
                    )}
                    <button
                        onClick={onRemove}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg z-10"
                    >
                        <FiTrash2 size={16} />
                    </button>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
            ) : (
                <div className="space-y-3">
                    {!showUrlInput ? (
                        <div className={`grid ${hideUrlInput ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-8 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                                    <FiVideo size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold">Upload Video</p>
                                    <p className="text-[10px] mt-1">MP4, MOV up to 100MB</p>
                                </div>
                            </button>

                            {!hideUrlInput && (
                                <button
                                    onClick={() => setShowUrlInput(true)}
                                    className="p-8 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                                        <FiLink size={24} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-semibold">Video URL</p>
                                        <p className="text-[10px] mt-1">Direct link to video</p>
                                    </div>
                                </button>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleUrlSubmit} className="relative">
                            <input
                                type="url"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="Paste video URL (e.g. S3 or Drive link)..."
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-400 pr-24"
                                autoFocus
                            />
                            <div className="absolute right-2 top-2 bottom-2 flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => setShowUrlInput(false)}
                                    className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
