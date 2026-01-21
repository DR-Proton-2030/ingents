"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    CloseCircle,
    Calendar,
    Document,
    Flag,
    UsersGroupRounded,
    Notes,
    AltArrowRight,
    MinusCircle,
    AddCircle,
    TrashBinMinimalistic,
    Pen,
    CheckCircle,
    Layers,
} from "@solar-icons/react";
import { SearchIcon, Plus } from "lucide-react";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";
import { formatDate } from "@/utils/commonFunction/formatDate";
import { cn } from "@/lib/utils";

interface TaskDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    task: any;
    onEditTask: (taskId: string, updates: any) => void;
    onDeleteTask: (taskId: string) => void;
    onAddSubtask: (taskId: string) => void;
    onAssignTask: (taskId: string, userId: string) => void;
    onUnassignTask: (taskId: string, userId: string) => void;
}

const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
    isOpen,
    onClose,
    task,
    onEditTask,
    onDeleteTask,
    onAddSubtask,
    onAssignTask,
    onUnassignTask,
}) => {
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [activePicker, setActivePicker] = useState<"time" | "participants" | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Calendar States
    const [viewDate, setViewDate] = useState(new Date());
    const [selDate, setSelDate] = useState(new Date());
    const [selHour, setSelHour] = useState("09");
    const [selMinute, setSelMinute] = useState("00");
    const [selAmPm, setSelAmPm] = useState("AM");

    // User search
    const { users: allUsers } = useGetUsers();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = (Array.isArray(allUsers) ? allUsers : []).filter((u) => {
        const term = searchQuery.toLowerCase().trim();
        if (!term) return false;
        const isAlreadyAssigned = task?.assignees?.some(
            (a: any) => a._id === u._id || a._id === (u as any).id
        );
        if (isAlreadyAssigned) return false;
        return (
            u.full_name?.toLowerCase().includes(term) ||
            u.email?.toLowerCase().includes(term)
        );
    });

    useEffect(() => {
        if (isOpen && task) {
            setEditedTitle(task.title || "");
            setEditedDescription(task.description || "");
            setIsEditingTitle(false);
            setIsEditingDescription(false);
            setActivePicker(null);
            setShowDeleteConfirm(false);
            setSearchQuery("");

            // Initialize date picker from task due_date
            if (task.due_date) {
                const d = new Date(task.due_date);
                setSelDate(d);
                setViewDate(d);
                let h = d.getHours();
                const m = d.getMinutes();
                setSelAmPm(h >= 12 ? "PM" : "AM");
                h = h % 12 || 12;
                setSelHour(String(h).padStart(2, "0"));
                setSelMinute(String(Math.floor(m / 15) * 15).padStart(2, "0"));
            }

            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, task]);

    // Close on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const days = new Date(year, month + 1, 0).getDate();
        return { firstDay, days };
    };

    const calendarData = getDaysInMonth(viewDate);

    const saveDateTime = () => {
        const year = selDate.getFullYear();
        const month = String(selDate.getMonth() + 1).padStart(2, "0");
        const day = String(selDate.getDate()).padStart(2, "0");

        let h = parseInt(selHour);
        if (selAmPm === "PM" && h < 12) h += 12;
        if (selAmPm === "AM" && h === 12) h = 0;

        const formattedDate = `${year}-${month}-${day}T${String(h).padStart(2, "0")}:${selMinute}`;
        onEditTask(task._id, { due_date: new Date(formattedDate) });
        setActivePicker(null);
    };

    const handleSaveTitle = () => {
        if (editedTitle.trim() && editedTitle !== task.title) {
            onEditTask(task._id, { title: editedTitle.trim() });
        }
        setIsEditingTitle(false);
    };

    const handleSaveDescription = () => {
        if (editedDescription !== task.description) {
            onEditTask(task._id, { description: editedDescription });
        }
        setIsEditingDescription(false);
    };

    const handleDelete = () => {
        onDeleteTask(task._id);
        onClose();
    };

    if (typeof document === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && task && (
                <div
                    className="fixed inset-0 z-[9999] transition-opacity duration-300"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="m-3 bg-gradient-to-r from-gray-800 to-gray-700 p-4 text-white shrink-0 rounded-xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Document className="w-5 h-5" />
                                    Task Details
                                </h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-300 hover:text-red-200"
                                    >
                                        <TrashBinMinimalistic className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <CloseCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 hidescroll">
                            <div className="space-y-6 pb-6">
                                {/* Title Section */}
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                        Task Title
                                    </label>
                                    {isEditingTitle ? (
                                        <div className="flex gap-2">
                                            <input
                                                autoFocus
                                                value={editedTitle}
                                                onChange={(e) => setEditedTitle(e.target.value)}
                                                onBlur={handleSaveTitle}
                                                onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                                                className="flex-1 h-12 px-4 rounded-xl outline-none text-lg font-bold text-gray-800 bg-gray-100 border-2 border-orange-200 focus:border-orange-400"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => setIsEditingTitle(true)}
                                            className="group flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <h3 className="flex-1 text-lg font-bold text-gray-800">{task.title}</h3>
                                            <Pen className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                </div>

                                {/* Description Section */}
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                        Description
                                    </label>
                                    {isEditingDescription ? (
                                        <textarea
                                            autoFocus
                                            value={editedDescription}
                                            onChange={(e) => setEditedDescription(e.target.value)}
                                            onBlur={handleSaveDescription}
                                            rows={4}
                                            className="w-full p-4 rounded-xl outline-none text-sm font-medium text-gray-700 bg-gray-100 border-2 border-orange-200 focus:border-orange-400 resize-none"
                                            placeholder="Add a description..."
                                        />
                                    ) : (
                                        <div
                                            onClick={() => setIsEditingDescription(true)}
                                            className="group p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors min-h-[80px]"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="flex-1 text-sm text-gray-600 whitespace-pre-wrap">
                                                    {task.description || <span className="italic text-gray-400">No description added...</span>}
                                                </p>
                                                <Pen className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Due Date Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                            Due Date
                                        </label>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setActivePicker(activePicker === "time" ? null : "time")}
                                        className={cn(
                                            "w-full h-12 px-4 rounded-xl border transition-all flex items-center justify-between group",
                                            activePicker === "time"
                                                ? "border-orange-500 bg-orange-50/30"
                                                : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Calendar className={cn("w-5 h-5", activePicker === "time" ? "text-orange-500" : "text-gray-400")} />
                                            <span className="text-sm font-bold text-gray-800">
                                                {task.due_date ? formatDate(task.due_date) : "Set due date"}
                                            </span>
                                        </div>
                                        <AltArrowRight className={cn("w-4 h-4 transition-transform", activePicker === "time" ? "rotate-90 text-orange-500" : "text-gray-400")} />
                                    </button>

                                    {/* Date Picker Dropdown */}
                                    <AnimatePresence>
                                        {activePicker === "time" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                                    {/* Month Header */}
                                                    <div className="flex items-center justify-between px-1">
                                                        <h5 className="text-xs font-black text-gray-800 uppercase">
                                                            {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                                        </h5>
                                                        <div className="flex gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}
                                                                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                                                            >
                                                                <AltArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}
                                                                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                                                            >
                                                                <AltArrowRight className="w-4 h-4 text-gray-400" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Calendar Grid */}
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
                                                                    className={cn(
                                                                        "h-9 w-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center",
                                                                        isSelected
                                                                            ? "bg-orange-500 text-white shadow-lg shadow-orange-200 scale-110"
                                                                            : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                                                                    )}
                                                                >
                                                                    {day}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Time Picker */}
                                                    <div className="pt-4 border-t border-gray-200">
                                                        <div className="flex items-center justify-between gap-2 p-1 bg-white rounded-2xl border border-gray-100">
                                                            <div className="flex-1 flex flex-col gap-1 items-center py-2">
                                                                <span className="text-[9px] font-bold text-gray-400 uppercase">Hour</span>
                                                                <div className="flex gap-1 flex-wrap justify-center px-1">
                                                                    {["09", "10", "11", "12", "01", "02", "03", "04", "05", "06"].map(h => (
                                                                        <button
                                                                            key={h}
                                                                            type="button"
                                                                            onClick={() => setSelHour(h)}
                                                                            className={cn(
                                                                                "w-7 h-7 rounded-lg text-[10px] font-bold transition-all",
                                                                                selHour === h ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
                                                                            )}
                                                                        >
                                                                            {h}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="w-px h-16 bg-gray-100 shrink-0" />
                                                            <div className="flex flex-col gap-2 shrink-0 pr-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSelAmPm("AM")}
                                                                    className={cn(
                                                                        "px-3 py-2 rounded-lg text-[10px] font-black transition-all",
                                                                        selAmPm === "AM" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"
                                                                    )}
                                                                >AM</button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSelAmPm("PM")}
                                                                    className={cn(
                                                                        "px-3 py-2 rounded-lg text-[10px] font-black transition-all",
                                                                        selAmPm === "PM" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"
                                                                    )}
                                                                >PM</button>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 flex gap-2">
                                                            {["00", "15", "30", "45"].map(m => (
                                                                <button
                                                                    key={m}
                                                                    type="button"
                                                                    onClick={() => setSelMinute(m)}
                                                                    className={cn(
                                                                        "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border",
                                                                        selMinute === m
                                                                            ? "bg-orange-50 border-orange-200 text-orange-600"
                                                                            : "bg-white border-gray-100 text-gray-400 hover:border-orange-200"
                                                                    )}
                                                                >
                                                                    :{m}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={saveDateTime}
                                                        className="w-full h-11 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all active:scale-95"
                                                    >
                                                        Update Date
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Assignees Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                            Assignees
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setActivePicker(activePicker === "participants" ? null : "participants")}
                                            className="text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase tracking-widest bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 transition-all active:scale-95"
                                        >
                                            Manage
                                        </button>
                                    </div>

                                    {/* Current Assignees */}
                                    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 min-h-[60px]">
                                        {task.assignees?.length > 0 ? (
                                            task.assignees.map((assignee: any) => (
                                                <div
                                                    key={assignee._id}
                                                    className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100 group"
                                                >
                                                    <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                                                        {assignee.profile_picture || assignee.avatar ? (
                                                            <img src={assignee.profile_picture || assignee.avatar} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            assignee.full_name?.charAt(0)?.toUpperCase() || "?"
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700">{assignee.full_name}</span>
                                                    <button
                                                        onClick={() => onUnassignTask(task._id, assignee._id)}
                                                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <MinusCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">No assignees yet</p>
                                        )}
                                    </div>

                                    {/* Add Assignee Panel */}
                                    <AnimatePresence>
                                        {activePicker === "participants" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                                    <div className="relative">
                                                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search users..."
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-orange-300"
                                                        />
                                                    </div>

                                                    {searchQuery && (
                                                        <div className="max-h-40 overflow-y-auto space-y-1">
                                                            {filteredUsers.length > 0 ? (
                                                                filteredUsers.map((user: any) => (
                                                                    <button
                                                                        key={user._id || user.id}
                                                                        onClick={() => {
                                                                            onAssignTask(task._id, user._id || user.id);
                                                                            setSearchQuery("");
                                                                        }}
                                                                        className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-orange-50 transition-colors"
                                                                    >
                                                                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                                                                            {user.profile_picture ? (
                                                                                <img src={user.profile_picture} alt="" className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                user.full_name?.charAt(0)?.toUpperCase() || "?"
                                                                            )}
                                                                        </div>
                                                                        <div className="text-left">
                                                                            <p className="text-xs font-bold text-gray-800">{user.full_name}</p>
                                                                            <p className="text-[10px] text-gray-400">{user.email}</p>
                                                                        </div>
                                                                        <AddCircle className="w-4 h-4 text-orange-500 ml-auto" />
                                                                    </button>
                                                                ))
                                                            ) : (
                                                                <p className="text-xs text-gray-400 text-center py-2">No users found</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Subtasks Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Layers className="w-4 h-4" />
                                            Subtasks ({task.subtask?.length || 0})
                                        </label>
                                        <button
                                            onClick={() => {
                                                onAddSubtask(task._id);
                                                onClose();
                                            }}
                                            className="flex items-center gap-1 text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase tracking-widest bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 transition-all active:scale-95"
                                        >
                                            <Plus className="w-3 h-3" />
                                            Add
                                        </button>
                                    </div>

                                    <div className="space-y-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        {task.subtask?.length > 0 ? (
                                            task.subtask.map((sub: any) => (
                                                <div
                                                    key={sub._id}
                                                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100"
                                                >
                                                    <CheckCircle className={cn("w-4 h-4 shrink-0", sub.status === "completed" ? "text-green-500" : "text-gray-300")} />
                                                    <span className={cn("text-sm font-medium flex-1", sub.status === "completed" ? "text-gray-400 line-through" : "text-gray-700")}>
                                                        {sub.title}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-400 italic text-center py-4">No subtasks yet</p>
                                        )}
                                    </div>
                                </div>

                                {/* Task Info */}
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-400 font-medium">Status</span>
                                        <span
                                            className="font-bold px-2 py-1 rounded-lg"
                                            style={{
                                                backgroundColor: task.phase_info?.color ? task.phase_info.color + "20" : "#f3f4f6",
                                                color: task.phase_info?.color || "#6b7280"
                                            }}
                                        >
                                            {task.phase_info?.name || task.status || "Unknown"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-400 font-medium">Priority</span>
                                        <span className={cn(
                                            "font-bold px-2 py-1 rounded-lg",
                                            task.priority === "High" ? "bg-red-100 text-red-600" :
                                                task.priority === "Low" ? "bg-gray-100 text-gray-600" :
                                                    "bg-blue-100 text-blue-600"
                                        )}>
                                            {task.priority || "Normal"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delete Confirmation */}
                        <AnimatePresence>
                            {showDeleteConfirm && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center p-6"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, y: 20 }}
                                        animate={{ scale: 1, y: 0 }}
                                        exit={{ scale: 0.9, y: 20 }}
                                        className="bg-white rounded-2xl p-6 max-w-sm w-full"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="text-center mb-6">
                                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <TrashBinMinimalistic className="w-8 h-8 text-red-500" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Task?</h3>
                                            <p className="text-sm text-gray-500">
                                                This will permanently remove "{task.title}" and all its subtasks.
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="flex-1 h-11 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="flex-1 h-11 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default TaskDetailDrawer;
