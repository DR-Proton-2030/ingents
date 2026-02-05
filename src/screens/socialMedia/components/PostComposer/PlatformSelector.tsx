"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiAlertCircle } from "react-icons/fi";
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
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                <FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-700 font-medium">
                    Connect your social media accounts to start posting.
                </p>
            </div>
        );
    }

    return (
        <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
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
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isSelected
                                    ? `${config.bgColor} text-white shadow-md`
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
