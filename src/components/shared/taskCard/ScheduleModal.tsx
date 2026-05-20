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
    const [step, setStep] = useState<1 | 2>(1);
    const [viewDate, setViewDate] = useState(new Date());
    const [selDate, setSelDate] = useState(new Date());
    const [selHour, setSelHour] = useState("09");
    const [selMinute, setSelMinute] = useState("00");
    const [selAmPm, setSelAmPm] = useState("AM");

    useEffect(() => {
        if (isOpen) {
            setStep(1);
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
            } else {
                const now = new Date();
                setSelDate(now);
                setViewDate(now);
                let h = now.getHours();
                const m = now.getMinutes();
                setSelAmPm(h >= 12 ? "PM" : "AM");
                h = h % 12 || 12;
                setSelHour(String(h).padStart(2, "0"));
                setSelMinute("00");
            }
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
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-[450px] bg-gray-50 shadow-2xl rounded-2xl border border-gray-100 flex flex-col overflow-hidden"
                    >
                        <div className="p-6 flex flex-col gap-5">
                            <div className="flex items-center justify-between">
                                {step === 1 ? (
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-2xl font-semibold text-gray-800 ">Select Date</h4>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="w-5 h-1.5 rounded-full bg-orange-500 transition-all duration-300" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 transition-all duration-300" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setStep(1)}
                                            className="p-2 hover:bg-gray-55 rounded-xl transition-all"
                                        >
                                            <AltArrowRight className="w-4 h-4 text-gray-500 rotate-180" />
                                        </motion.button>
                                        <div className="flex flex-col gap-1">
                                            <h4 className="text-lg font-black text-gray-800 tracking-tight">Select Time</h4>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-200 transition-all duration-300" />
                                                <span className="w-5 h-1.5 rounded-full bg-orange-500 transition-all duration-300" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-55 rounded-full transition-colors"
                                >
                                    <CloseCircle className="w-5 h-5 text-gray-400" />
                                </motion.button>
                            </div>

                            <div className=" flex flex-col justify-between">
                                <AnimatePresence mode="wait">
                                    {step === 1 ? (
                                        <motion.div
                                            key="step-date"
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 16 }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                            className="flex flex-col gap-4"
                                        >
                                            <div className="flex items-center justify-between px-1">
                                                <h5 className="text-md text-gray-800 ">
                                                    {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                                </h5>
                                                <div className="flex gap-1.5">
                                                    <motion.button
                                                        type="button"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}
                                                        className="p-3 hover:bg-gray-55 rounded-full bg-gray-200 transition"
                                                    >
                                                        <AltArrowRight className="w-4 h-4 text-gray-800 rotate-180" />
                                                    </motion.button>
                                                    <motion.button
                                                        type="button"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}
                                                        className="p-3 hover:bg-gray-55 rounded-full bg-gray-200 transition"
                                                    >
                                                        <AltArrowRight className="w-4 h-4 text-gray-800" />
                                                    </motion.button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-7 gap-0.5">
                                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                                                    <div key={`${d}-${idx}`} className="text-xs font-black text-gray-300 text-center  tracking-widest">{d}</div>
                                                ))}
                                                {[...Array(calendarData.firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
                                                {[...Array(calendarData.days)].map((_, i) => {
                                                    const day = i + 1;
                                                    const isSelected = selDate.getDate() === day && selDate.getMonth() === viewDate.getMonth() && selDate.getFullYear() === viewDate.getFullYear();
                                                    const today = new Date();
                                                    const isToday = today.getDate() === day && today.getMonth() === viewDate.getMonth() && today.getFullYear() === viewDate.getFullYear();

                                                    const cellDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                                                    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                                                    const isPast = cellDate < todayDateOnly;

                                                    return (
                                                        <div key={day} className="flex justify-center items-center gap-0">
                                                            <motion.button
                                                                type="button"
                                                                disabled={isPast}
                                                                whileTap={isPast ? undefined : { scale: 0.92 }}
                                                                onClick={() => {
                                                                    setSelDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
                                                                    setStep(2);
                                                                }}
                                                                className={`h-12 w-20 rounded-xl m-0 text-sm font-semibold transition-all flex flex-col items-center justify-center relative ${isPast
                                                                    ? "text-gray-300 cursor-not-allowed"
                                                                    : isSelected
                                                                        ? "bg-blue-500 text-white "
                                                                        : isToday
                                                                            ? "text-gray-600 hover:bg-black/10 hover:text-gray-100"
                                                                            : "text-gray-600 hover:bg-black/10 hover:text-gray-500"
                                                                    }`}
                                                            >
                                                                <span className="">{day}</span>
                                                                {isToday && !isSelected && (
                                                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full absolute bottom-1.5" />
                                                                )}
                                                            </motion.button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="step-time"
                                            initial={{ opacity: 0, x: 16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -16 }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                            className="flex flex-col gap-4"
                                        >
                                            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100/50 flex flex-col items-center justify-center text-center">
                                                <span className="text-[10px] uppercase font-black tracking-wider text-orange-500 mb-1">Selected Date</span>
                                                <span className="text-base font-black text-orange-950">
                                                    {selDate.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="text-xs text-orange-700/80 mt-1 font-bold">
                                                    {selHour}:{selMinute} {selAmPm}
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-1">Hour</span>
                                                <div className="grid grid-cols-4 gap-1.5">
                                                    {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(h => {
                                                        const isSelected = selHour === h;
                                                        return (
                                                            <motion.button
                                                                key={h}
                                                                type="button"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => setSelHour(h)}
                                                                className={`py-2 rounded-xl text-xs font-bold transition-all border text-center ${isSelected
                                                                    ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20"
                                                                    : "bg-white border-gray-100 text-gray-500 hover:border-orange-200 hover:text-orange-500"
                                                                    }`}
                                                            >
                                                                {h}
                                                            </motion.button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Minutes</span>
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest pr-4">Period</span>
                                                </div>
                                                <div className="grid grid-cols-5 gap-2">
                                                    <div className="col-span-4 grid grid-cols-4 gap-1.5">
                                                        {["00", "15", "30", "45"].map(m => {
                                                            const isSelected = selMinute === m;
                                                            return (
                                                                <motion.button
                                                                    key={m}
                                                                    type="button"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => setSelMinute(m)}
                                                                    className={`py-2 rounded-xl text-xs font-bold transition-all border text-center ${isSelected
                                                                        ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20"
                                                                        : "bg-white border-gray-100 text-gray-500 hover:border-orange-200 hover:text-orange-500"
                                                                        }`}
                                                                >
                                                                    :{m}
                                                                </motion.button>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className="col-span-1 flex flex-col gap-1 bg-gray-50 p-0.5 rounded-xl border border-gray-100 shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelAmPm("AM")}
                                                            className={`flex-1 py-1 rounded-lg text-[10px] font-black transition-all ${selAmPm === "AM"
                                                                ? "bg-black text-white shadow-sm"
                                                                : "text-gray-400 hover:text-gray-600"
                                                                }`}
                                                        >
                                                            AM
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelAmPm("PM")}
                                                            className={`flex-1 py-1 rounded-lg text-[10px] font-black transition-all ${selAmPm === "PM"
                                                                ? "bg-black text-white shadow-sm"
                                                                : "text-gray-400 hover:text-gray-600"
                                                                }`}
                                                        >
                                                            PM
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleSave}
                                                className="w-full h-12 bg-black hover:bg-gray-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-black/10 mt-4 transition-all"
                                            >
                                                Confirm & Schedule
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
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
