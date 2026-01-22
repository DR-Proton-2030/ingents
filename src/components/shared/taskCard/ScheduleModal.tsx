"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CloseCircle, AltArrowRight } from "@solar-icons/react";

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    dueDate: string | Date | undefined;
    onSave: (date: Date) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
    isOpen,
    onClose,
    dueDate,
    onSave,
}) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [selDate, setSelDate] = useState(new Date());
    const [selHour, setSelHour] = useState("09");
    const [selMinute, setSelMinute] = useState("00");
    const [selAmPm, setSelAmPm] = useState("AM");

    useEffect(() => {
        if (dueDate) {
            const d = new Date(dueDate);
            setSelDate(d);
            setViewDate(d);
            let h = d.getHours();
            const m = d.getMinutes();
            setSelAmPm(h >= 12 ? "PM" : "AM");
            h = h % 12 || 12;
            setSelHour(String(h).padStart(2, "0"));
            setSelMinute(String(m).padStart(2, "0"));
        }
    }, [dueDate, isOpen]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const days = new Date(year, month + 1, 0).getDate();
        return { firstDay, days };
    };

    const calendarData = getDaysInMonth(viewDate);

    const handleSave = () => {
        const year = selDate.getFullYear();
        const month = String(selDate.getMonth() + 1).padStart(2, "0");
        const day = String(selDate.getDate()).padStart(2, "0");

        let h = parseInt(selHour);
        if (selAmPm === "PM" && h < 12) h += 12;
        if (selAmPm === "AM" && h === 12) h = 0;

        const formattedDate = `${year}-${month}-${day}T${String(h).padStart(2, "0")}:${selMinute}`;
        onSave(new Date(formattedDate));
        onClose();
    };

    if (typeof document === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-[360px] bg-white shadow-2xl rounded-[32px] border border-white/20 flex flex-col gap-4 overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-lg font-bold text-gray-800">Update Schedule</h4>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <CloseCircle className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <h5 className="text-xs font-black text-gray-800 uppercase">
                                        {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </h5>
                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}
                                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <AltArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}
                                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <AltArrowRight className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 gap-1">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                        <div key={d} className="text-[10px] font-bold text-gray-300 text-center py-1">{d}</div>
                                    ))}
                                    {[...Array(calendarData.firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
                                    {[...Array(calendarData.days)].map((_, i) => {
                                        const day = i + 1;
                                        const isSelected = selDate.getDate() === day && selDate.getMonth() === viewDate.getMonth() && selDate.getFullYear() === viewDate.getFullYear();
                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => setSelDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day))}
                                                className={`h-9 w-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${isSelected ? "bg-orange-500 text-white shadow-lg shadow-orange-200 scale-110" : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                                                    }`}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between gap-2 p-1 bg-gray-50 rounded-2xl">
                                        <div className="flex-1 flex flex-col gap-1 items-center py-2">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase">Hour</span>
                                            <div className="flex gap-1 flex-wrap justify-center px-1">
                                                {["09", "10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08"].map(h => (
                                                    <button
                                                        key={h}
                                                        type="button"
                                                        onClick={() => setSelHour(h)}
                                                        className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${selHour === h ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-200"
                                                            }`}
                                                    >
                                                        {h}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="w-px h-16 bg-gray-200 shrink-0" />
                                        <div className="flex flex-col gap-2 shrink-0 pr-1">
                                            <button
                                                type="button"
                                                onClick={() => setSelAmPm("AM")}
                                                className={`px-3 py-2 rounded-lg text-[10px] font-black transition-all ${selAmPm === "AM" ? "bg-orange-500 text-white shadow-sm" : "bg-white text-gray-400 border border-gray-100"}`}
                                            >AM</button>
                                            <button
                                                type="button"
                                                onClick={() => setSelAmPm("PM")}
                                                className={`px-3 py-2 rounded-lg text-[10px] font-black transition-all ${selAmPm === "PM" ? "bg-orange-500 text-white shadow-sm" : "bg-white text-gray-400 border border-gray-100"}`}
                                            >PM</button>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        {["00", "15", "30", "45"].map(m => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => setSelMinute(m)}
                                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${selMinute === m ? "bg-orange-50 border-orange-200 text-orange-600 shadow-sm" : "bg-white border-gray-100 text-gray-400 hover:border-orange-200"
                                                    }`}
                                            >
                                                :{m}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="w-full h-12 bg-black text-white rounded-2xl text-xs font-bold hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-gray-200 mt-2"
                                >
                                    Update Schedule
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ScheduleModal;
