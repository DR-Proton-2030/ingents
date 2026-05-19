"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrashBinMinimalistic } from "@solar-icons/react";

interface AttachmentCardProps {
    name: string;
    url?: string;
    size?: string;
    isExisting: boolean;
    theme: {
        bg: string;
        bgStrong: string;
        text: string;
        icon: React.ReactNode;
    };
    description: string;
    onRemove: () => void;
    onPreview: () => void;
    onUpdateDescription: (desc: string) => void;
}

const AttachmentCard: React.FC<AttachmentCardProps> = ({
    name,
    url,
    size,
    isExisting,
    theme,
    description,
    onRemove,
    onPreview,
    onUpdateDescription,
}) => {
    const isImage = url ? (
        url.startsWith("blob:") ||
        ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(url.split("?")[0].split(".").pop()?.toLowerCase() || "")
    ) : false;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`group relative bg-gray-100 rounded-2xl border border-gray-100 transition-all overflow-hidden ${isExisting ? "p-0" : "p-4"}`}
        >
            <div className={isExisting ? "flex flex-col" : "flex items-start gap-4"}>
                {/* Preview Section */}
                {isExisting && isImage ? (
                    <div className="relative h-40 w-full bg-gray-50 overflow-hidden group/img">
                        <img
                            src={url}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-all flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={onPreview}
                                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover/img:opacity-100 transition-all hover:bg-white/40"
                            >
                                <span className="text-[10px] font-bold px-2 uppercase">Preview</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={onPreview}
                        className={`${isExisting ? "w-full h-20" : "w-12 h-12"} rounded-xl flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-all ${theme.bg} ${theme.text}`}
                    >
                        {theme.icon}
                    </div>
                )}

                <div className={isExisting ? "p-4" : "flex-1 min-w-0"}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex flex-col min-w-0">
                            <h5
                                onClick={onPreview}
                                className="text-[11px] font-black text-gray-800 truncate cursor-pointer hover:text-indigo-600 transition-colors "
                            >
                                {name}
                            </h5>
                            {size && (
                                <span className="text-[9px] font-bold text-gray-400">{size}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onRemove}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"
                            >
                                <TrashBinMinimalistic className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {!isExisting && (
                        <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden mb-3">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={`h-full ${theme.bgStrong}`}
                            />
                        </div>
                    )}

                    {/* Description Input */}
                    <div className="relative group/input">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 group-focus-within/input:text-indigo-400 transition-colors uppercase">
                            Note:
                        </div>
                        <input
                            type="text"
                            placeholder="Describe this attachment..."
                            value={description}
                            onChange={(e) => onUpdateDescription(e.target.value)}
                            className="w-full bg-white border border-gray-200  focus:bg-white pl-12 pr-3 py-2 rounded-xl text-[10px] text-gray-600 font-bold outline-none transition-all placeholder:text-gray-300 placeholder:font-medium"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AttachmentCard;
