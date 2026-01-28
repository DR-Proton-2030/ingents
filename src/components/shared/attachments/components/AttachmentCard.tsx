"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrashBinMinimalistic } from "@solar-icons/react";

interface AttachmentCardProps {
    name: string;
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
    size,
    isExisting,
    theme,
    description,
    onRemove,
    onPreview,
    onUpdateDescription,
}) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative bg-white rounded-2xl p-4 border border-gray-200 shadow-m hover:shadow-md transition-all overflow-hidden"
        >
            <div className="flex items-start gap-4">
                <div
                    onClick={onPreview}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-all ${theme.bg} ${theme.text}`}
                >
                    {theme.icon}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <h5
                            onClick={onPreview}
                            className="text-xs font-bold text-gray-800 truncate cursor-pointer hover:text-indigo-600 transition-colors"
                        >
                            {name}
                        </h5>
                        <div className="flex items-center gap-1">
                            {/* <button
                                type="button"
                                onClick={onPreview}
                                className="p-1 px-2 rounded-lg hover:bg-indigo-50 text-[9px] font-bold text-indigo-600 uppercase tracking-wider transition-all opacity-0 group-hover:opacity-100"
                            >
                                View
                            </button> */}

                            {size && (
                                <span className={`text-[10px] w-16 text-center font-bold px-2 py-0.5 rounded-md ${theme.bg} ${theme.text}`}>
                                    {size}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={onRemove}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all opacity-100 group-over:opacity-100"
                            >
                                <TrashBinMinimalistic className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full ${isExisting ? "bg-green-500" : theme.bgStrong}`}
                        />
                    </div>


                    {/* Description Input */}
                    <div className="mt-2 relative">
                        <input
                            type="text"
                            placeholder="Add a description..."
                            value={description}
                            onChange={(e) => onUpdateDescription(e.target.value)}
                            className="w-full bg-gray-50/50 border border-transparent hover:border-gray-200 focus:border-indigo-300 focus:bg-white px-3 py-1.5 rounded-xl text-[10px] text-gray-600 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AttachmentCard;
