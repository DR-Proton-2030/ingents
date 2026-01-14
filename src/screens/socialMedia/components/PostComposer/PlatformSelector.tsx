"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { platformIcons } from "./types";

interface PlatformSelectorProps {
    connectedPlatforms: string[];
    selectedPlatforms: string[];
    onTogglePlatform: (platform: string) => void;
}

export default function PlatformSelector({
    connectedPlatforms,
    selectedPlatforms,
    onTogglePlatform,
}: PlatformSelectorProps) {
    if (connectedPlatforms.length === 0) {
        return (
            <div className="mb-5 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl">
                <p className="text-sm text-amber-700 font-medium">
                    ⚠️ Connect your social media accounts above to start posting.
                </p>
            </div>
        );
    }

    return (
        <div className="mb-5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Select Platforms
            </label>
            <div className="flex flex-wrap gap-2">
                {connectedPlatforms.map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform);
                    const config = platformIcons[platform];
                    return (
                        <motion.button
                            key={platform}
                            onClick={() => onTogglePlatform(platform)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isSelected
                                    ? `${config.bgColor} text-white shadow-lg`
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                                }`}
                        >
                            {config.icon}
                            <span>{config.name}</span>
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-4 h-4 bg-white/30 rounded-full flex items-center justify-center"
                                >
                                    <FiCheck size={10} />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
