"use client";
import React from "react";
import { Document, Calendar, UsersGroupRounded, Layers, CheckCircle } from "@solar-icons/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneralInfoSectionProps {
    formData: { title: string; description: string };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({ formData, onChange }) => (
    <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg">
                <Document className="w-5 h-5 text-amber-500" />
            </div>
            General Information
        </h3>

        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Task Title *</label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    placeholder="e.g. Design System Audit"
                    className="w-full h-11 px-4 rounded-xl outline-none text-sm font-medium text-gray-800 bg-gray-100"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Description</label>
                <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={onChange}
                    placeholder="Provide context or instructions..."
                    className="w-full p-4 rounded-xl outline-none text-sm font-medium text-gray-800 bg-gray-100 resize-none"
                />
            </div>
        </div>
    </div>
);

interface ScheduleSectionProps {
    currentDueDate: string;
    priority: "High" | "Normal" | "Low";
    activePicker: "time" | "participants" | null;
    onTogglePicker: () => void;
    onPriorityChange: (p: "High" | "Normal" | "Low") => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({
    currentDueDate,
    priority,
    activePicker,
    onTogglePicker,
    onPriorityChange,
}) => (
    <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-500" />
            </div>
            Schedule & Urgency
        </h3>

        <div className="bg-gray-50 rounded-2xl p-4 space-y-4 border border-gray-100">
            <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Due Date</label>
                <button
                    type="button"
                    onClick={onTogglePicker}
                    className={cn(
                        "w-full h-11 px-3 rounded-xl border transition-all flex items-center justify-between group",
                        activePicker === "time" ? "border-orange-500 bg-orange-50/30" : "border-gray-100 bg-white"
                    )}
                >
                    <span className="text-xs font-bold text-gray-800">{currentDueDate}</span>
                    <Calendar className={cn("w-4 h-4 transition-colors", activePicker === "time" ? "text-orange-500" : "text-gray-400 group-hover:text-orange-500")} />
                </button>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Priority Level</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-200/70 rounded-xl">
                    {(["High", "Normal", "Low"] as const).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => onPriorityChange(p)}
                            className={cn(
                                "h-8 rounded-full text-[9px] font-black uppercase tracking-wider transition-all",
                                priority === p
                                    ? "bg-gradient-to-r from-black/70 to-black/70 text-white border border-gray-100"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

interface AssigneesSectionProps {
    assignees: any[];
    onManageClick: () => void;
}

export const AssigneesSection: React.FC<AssigneesSectionProps> = ({ assignees, onManageClick }) => (
    <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg">
                    <UsersGroupRounded className="w-5 h-5 text-amber-500" />
                </div>
                Assignees
            </div>

            <button
                type="button"
                onClick={onManageClick}
                className="text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase tracking-widest bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 transition-all active:scale-95"
            >
                Manage
            </button>
        </h3>

        <div className="space-y-2">
            {assignees?.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 min-h-[60px]">
                    {assignees.map((u: any) => (
                        <div key={u._id} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm" title={u.full_name}>
                            {u.profile_picture ? (
                                <img src={u.profile_picture} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase">
                                    {u.full_name?.charAt(0) || "?"}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                        {assignees.length} Teammates Assigned
                    </div>
                </div>
            ) : (
                <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-orange-200 transition-colors cursor-pointer" onClick={onManageClick}>
                    <UsersGroupRounded className="w-8 h-8 text-gray-300 group-hover:text-orange-300 transition-colors mb-2" />
                    <p className="text-xs font-bold text-gray-400 group-hover:text-gray-500">No assignees yet</p>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Click to assign teammates</p>
                </div>
            )}
        </div>
    </div>
);

interface SubtasksSectionProps {
    subtasks: any[];
    onAddSubtask: () => void;
}

export const SubtasksSection: React.FC<SubtasksSectionProps> = ({ subtasks, onAddSubtask }) => (
    <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg">
                    <Layers className="w-5 h-5 text-amber-500" />
                </div>
                Subtasks ({subtasks?.length || 0})
            </div>
            <button
                type="button"
                onClick={onAddSubtask}
                className="text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase tracking-widest bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 transition-all active:scale-95 flex items-center gap-1"
            >
                <Plus className="w-3 h-3" />
                Add
            </button>
        </h3>

        <div className="space-y-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            {subtasks?.length > 0 ? (
                subtasks.map((sub: any) => (
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
);
