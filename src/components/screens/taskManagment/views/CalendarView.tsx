"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, AltArrowLeft, AltArrowRight } from "@solar-icons/react";

interface CalendarViewProps {
    tasks: any[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
    const [currentDate, setCurrentDate] = React.useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const days = new Date(year, month + 1, 0).getDate();
        return { firstDay, days, year, month };
    };

    const { firstDay, days, year, month } = getDaysInMonth(currentDate);

    const tasksByDate = useMemo(() => {
        const map: Record<string, any[]> = {};
        tasks.forEach((task) => {
            if (task.due_date) {
                const dateStr = new Date(task.due_date).toDateString();
                if (!map[dateStr]) map[dateStr] = [];
                map[dateStr].push(task);
            }
        });
        return map;
    }, [tasks]);

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
            return newDate;
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <button
                    onClick={() => navigateMonth("prev")}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    <AltArrowLeft className="w-5 h-5 text-gray-400" />
                </button>
                <h2 className="text-lg font-bold text-gray-800">
                    {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
                </h2>
                <button
                    onClick={() => navigateMonth("next")}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    <AltArrowRight className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-3 text-center text-xs font-bold text-gray-400 uppercase">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
                {/* Empty cells for first week */}
                {[...Array(firstDay)].map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[120px] border-b border-r border-gray-50 bg-gray-50/30" />
                ))}

                {/* Days */}
                {[...Array(days)].map((_, i) => {
                    const day = i + 1;
                    const date = new Date(year, month, day);
                    const dateStr = date.toDateString();
                    const dayTasks = tasksByDate[dateStr] || [];
                    const isToday = new Date().toDateString() === dateStr;

                    return (
                        <motion.div
                            key={day}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.01 }}
                            className={`min-h-[120px] p-2 border-b border-r border-gray-50 transition-colors hover:bg-orange-50/30 ${isToday ? "bg-orange-50/50" : ""
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold ${isToday
                                            ? "bg-orange-500 text-white"
                                            : "text-gray-600"
                                        }`}
                                >
                                    {day}
                                </span>
                                {dayTasks.length > 0 && (
                                    <span className="text-[10px] font-bold text-gray-400">
                                        {dayTasks.length} task{dayTasks.length > 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>
                            <div className="space-y-1">
                                {dayTasks.slice(0, 3).map((task: any) => (
                                    <div
                                        key={task._id}
                                        className="text-[10px] font-medium text-gray-600 bg-white px-2 py-1 rounded-lg border border-gray-100 truncate hover:border-orange-200 cursor-pointer transition-colors"
                                        style={{
                                            borderLeftWidth: "3px",
                                            borderLeftColor: task.phase_info?.color || "#f97316",
                                        }}
                                    >
                                        {task.title}
                                    </div>
                                ))}
                                {dayTasks.length > 3 && (
                                    <p className="text-[9px] font-bold text-gray-400 pl-1">
                                        +{dayTasks.length - 3} more
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
