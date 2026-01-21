"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ClockCircle, AltArrowLeft, AltArrowRight } from "@solar-icons/react";
import { TaskDetailDrawer } from "@/components/shared/TaskDetailDrawer";

interface TimelineViewProps {
    tasks: any[];
    onAddSubtask: (taskId: string) => void;
    onEditTask: (taskId: string, updates: any) => void;
    onDeleteTask: (taskId: string) => void;
    onAssignTask: (taskId: string, userId: string) => void;
    onUnassignTask: (taskId: string, userId: string) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({
    tasks,
    onAddSubtask,
    onEditTask,
    onDeleteTask,
    onAssignTask,
    onUnassignTask,
}) => {
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        return startOfWeek;
    });
    const [selectedTask, setSelectedTask] = useState<any | null>(null);

    const weekDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentWeekStart);
            date.setDate(currentWeekStart.getDate() + i);
            days.push(date);
        }
        return days;
    }, [currentWeekStart]);

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

    const navigateWeek = (direction: "prev" | "next") => {
        setCurrentWeekStart((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
            return newDate;
        });
    };

    const today = new Date().toDateString();

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Timeline Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <button
                        onClick={() => navigateWeek("prev")}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <AltArrowLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <div className="text-center">
                        <h2 className="text-lg font-bold text-gray-800">
                            {weekDays[0].toLocaleDateString("default", { month: "short", day: "numeric" })} -{" "}
                            {weekDays[6].toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}
                        </h2>
                        <p className="text-xs text-gray-400 font-medium mt-1">Week Timeline</p>
                    </div>
                    <button
                        onClick={() => navigateWeek("next")}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <AltArrowRight className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Timeline Grid */}
                <div className="grid grid-cols-7 divide-x divide-gray-100">
                    {weekDays.map((date, index) => {
                        const dateStr = date.toDateString();
                        const dayTasks = tasksByDate[dateStr] || [];
                        const isToday = today === dateStr;

                        return (
                            <motion.div
                                key={dateStr}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`min-h-[400px] ${isToday ? "bg-orange-50/30" : ""}`}
                            >
                                {/* Day Header */}
                                <div className={`p-3 text-center border-b border-gray-100 ${isToday ? "bg-orange-50" : "bg-gray-50/50"}`}>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                                        {date.toLocaleDateString("default", { weekday: "short" })}
                                    </p>
                                    <p
                                        className={`text-xl font-black mt-1 ${isToday ? "text-orange-500" : "text-gray-700"
                                            }`}
                                    >
                                        {date.getDate()}
                                    </p>
                                </div>

                                {/* Tasks */}
                                <div className="p-2 space-y-2">
                                    {dayTasks.length > 0 ? (
                                        dayTasks.map((task: any) => (
                                            <motion.div
                                                key={task._id}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => setSelectedTask(task)}
                                                className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                                                style={{
                                                    borderLeftWidth: "3px",
                                                    borderLeftColor: task.phase_info?.color || "#f97316",
                                                }}
                                            >
                                                <p className="text-xs font-bold text-gray-800 line-clamp-2">
                                                    {task.title}
                                                </p>
                                                {task.due_date && (
                                                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                                        <ClockCircle className="w-3 h-3" />
                                                        {new Date(task.due_date).toLocaleTimeString("default", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                )}
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-[10px] text-gray-300 font-medium">No tasks</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Task Detail Drawer */}
            <TaskDetailDrawer
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onAddSubtask={onAddSubtask}
                onAssignTask={onAssignTask}
                onUnassignTask={onUnassignTask}
            />
        </>
    );
};

export default TimelineView;
