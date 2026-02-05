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
        <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                Hashtags
            </label>
            <div className="flex items-center gap-2 flex-wrap p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[50px]">
                <AnimatePresence>
                    {hashtags.map((tag) => (
                        <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium shadow-sm"
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
                            id="hashtag-input-field"
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
                            className="w-32 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                            autoFocus
                        />
                        <button
                            onClick={handleAdd}
                            className="p-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            <FiPlus size={12} />
                        </button>
                        <button
                            onClick={() => {
                                setShowInput(false);
                                setNewHashtag("");
                            }}
                            className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            <FiX size={12} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowInput(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-dashed border-slate-300 text-slate-500 rounded-lg text-xs font-medium hover:border-slate-400 hover:text-slate-700 transition-all"
                    >
                        <FiHash size={12} />
                        Add hashtag
                    </button>
                )}
            </div>
        </div>
    );
}
