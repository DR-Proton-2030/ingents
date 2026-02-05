"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiCalendar } from "react-icons/fi";

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
                    className="mt-4 overflow-hidden"
                >
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-4">
                            <FiCalendar size={16} className="text-slate-600" />
                            <span className="text-sm font-semibold text-slate-700">Schedule Post</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => onDateChange(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Time</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => onTimeChange(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
