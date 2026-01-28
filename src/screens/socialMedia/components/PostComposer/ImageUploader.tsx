"use client";
import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiImage, FiPlus, FiTrash2 } from "react-icons/fi";
import { UploadedImage } from "./types";

interface ImageUploaderProps {
    images: UploadedImage[];
    onUpload: (files: FileList) => void;
    onRemove: (id: string) => void;
}

export default function ImageUploader({
    images,
    onUpload,
    onRemove,
}: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onUpload(e.target.files);
        }
    };

    return (
        <div className="mt-5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                Media
            </label>
            <input
                type="file"
                id="image-upload-input"
                ref={fileInputRef}
                onChange={handleChange}
                accept="image/*"
                multiple
                className="hidden"
            />

            {images.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                    <AnimatePresence>
                        {images.map((img) => (
                            <motion.div
                                key={img.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border-2 border-slate-200"
                            >
                                <img
                                    src={img.preview}
                                    alt="Upload preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <button
                                    onClick={() => onRemove(img.id)}
                                    className="absolute bottom-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all"
                    >
                        <FiPlus size={24} />
                        <span className="text-xs font-medium">Add More</span>
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-8 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all"
                >
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <FiImage size={24} />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold">Drop images here or click to upload</p>
                        <p className="text-xs mt-1">Supports JPG, PNG, GIF up to 10MB</p>
                    </div>
                </button>
            )}
        </div>
    );
}
