"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock } from "react-icons/fi";

interface SchedulerProps {
    isOpen: boolean;
    date: string;
    time: string;
    onDateChange: (date: string) => void;
    onTimeChange: (time: string) => void;
}

export default function Scheduler({
    isOpen,
    date,
    time,
    onDateChange,
    onTimeChange,
}: SchedulerProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-5 overflow-hidden"
                >
                    <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100">
                        <div className="flex items-center gap-2 mb-4">
                            <FiClock size={16} className="text-indigo-600" />
                            <span className="text-sm font-bold text-indigo-900">Schedule Post</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => onDateChange(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border-2 border-indigo-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Time</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => onTimeChange(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border-2 border-indigo-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
