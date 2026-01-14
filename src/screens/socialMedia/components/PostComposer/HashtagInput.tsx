"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHash, FiX, FiPlus } from "react-icons/fi";

interface HashtagInputProps {
    hashtags: string[];
    onAddHashtag: (tag: string) => void;
    onRemoveHashtag: (tag: string) => void;
}

export default function HashtagInput({
    hashtags,
    onAddHashtag,
    onRemoveHashtag,
}: HashtagInputProps) {
    const [newHashtag, setNewHashtag] = useState("");
    const [showInput, setShowInput] = useState(false);

    const handleAdd = () => {
        if (newHashtag.trim()) {
            const tag = newHashtag.startsWith("#") ? newHashtag : `#${newHashtag}`;
            onAddHashtag(tag);
            setNewHashtag("");
        }
    };

    return (
        <div className="mt-5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                Hashtags
            </label>
            <div className="flex items-center gap-2 flex-wrap p-3 bg-slate-50/80 border-2 border-slate-200 rounded-2xl min-h-[50px]">
                <AnimatePresence>
                    {hashtags.map((tag) => (
                        <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs font-semibold shadow-sm"
                        >
                            {tag}
                            <button
                                onClick={() => onRemoveHashtag(tag)}
                                className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <FiX size={12} />
                            </button>
                        </motion.span>
                    ))}
                </AnimatePresence>

                {showInput ? (
                    <div className="flex items-center gap-1">
                        <input
                            type="text"
                            value={newHashtag}
                            onChange={(e) => setNewHashtag(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAdd();
                                }
                                if (e.key === "Escape") {
                                    setShowInput(false);
                                    setNewHashtag("");
                                }
                            }}
                            placeholder="Type hashtag..."
                            className="w-32 px-3 py-1.5 text-xs bg-white border-2 border-indigo-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                            autoFocus
                        />
                        <button
                            onClick={handleAdd}
                            className="p-1.5 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors shadow-sm"
                        >
                            <FiPlus size={12} />
                        </button>
                        <button
                            onClick={() => {
                                setShowInput(false);
                                setNewHashtag("");
                            }}
                            className="p-1.5 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 transition-colors"
                        >
                            <FiX size={12} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowInput(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-dashed border-slate-300 text-slate-500 rounded-full text-xs font-medium hover:border-indigo-400 hover:text-indigo-500 transition-all"
                    >
                        <FiHash size={12} />
                        Add hashtag
                    </button>
                )}
            </div>
        </div>
    );
}
