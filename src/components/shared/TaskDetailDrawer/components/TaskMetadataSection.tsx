"use client";
import React from "react";
import { UsersGroupRounded, Calendar, CheckCircle } from "@solar-icons/react";
import { ChevronDown, Clock, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import StatusDropdown from "../../statusDropdown/StatusDropdown";

interface TaskMetadataSectionProps {
    task: any;
    formData: {
        title: string;
        description: string;
        priority: "High" | "Normal" | "Low";
        project_object_id: string | null;
    };
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    projects: any[];
    currentDueDate: string;
    onEditTask: (taskId: string, updates: any) => void;
    setActivePicker: (picker: "time" | "participants" | "tags" | null) => void;
    isProjectDropdownOpen: boolean;
    setIsProjectDropdownOpen: (open: boolean) => void;
    isPriorityDropdownOpen: boolean;
    setIsPriorityDropdownOpen: (open: boolean) => void;
}

const AVATAR_COLORS = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-teal-500",
];

const getAvatarColor = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const TaskMetadataSection: React.FC<TaskMetadataSectionProps> = ({
    task,
    formData,
    setFormData,
    projects,
    currentDueDate,
    onEditTask,
    setActivePicker,
    isProjectDropdownOpen,
    setIsProjectDropdownOpen,
    isPriorityDropdownOpen,
    setIsPriorityDropdownOpen,
}) => {
    const selectedProject = projects.find(p => p._id === formData.project_object_id);

    return (
        <div className="space-y-3">
            {/* Assignee */}
            <div className="flex items-center gap-3">
                <span className="w-28 text-sm text-gray-700 font-semibold">Assignee</span>
                <div
                    onClick={() => setActivePicker("participants")}
                    className="flex items-center gap-2 hover:bg-gray-50 rounded-full px-2.5 py-1.5 transition-all cursor-pointer border border-transparent hover:border-gray-200/50"
                >
                    {task?.assignees?.length > 0 ? (
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5">
                                {task.assignees.map((u: any) => (
                                    <div key={u._id} className="w-6 h-6 rounded-full border border-white bg-gray-200 overflow-hidden shadow-sm">
                                        {u.profile_picture ? (
                                            <img src={u.profile_picture} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className={cn(
                                                "w-full h-full flex items-center justify-center text-[8px] font-bold text-white uppercase",
                                                getAvatarColor(u._id || u.id || u.full_name || "")
                                            )}>
                                                {u.full_name?.charAt(0) || "?"}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm  text-gray-800">
                                {task.assignees.map((u: any) => u.full_name).join(", ")}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-400">
                            <UsersGroupRounded className="w-4 h-4" />
                            <span>Unassigned</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-3">
                <span className="w-28 text-sm text-gray-700 font-semibold">Due Date</span>
                <div
                    onClick={() => setActivePicker("time")}
                    className="flex items-center gap-2 hover:bg-gray-50 rounded-full px-2.5 py-1.5 transition-all cursor-pointer border border-transparent hover:border-gray-200/50 text-sm  text-gray-800"
                >
                    <Calendar className="w-4.5 h-4.5 text-gray-400" />
                    <span>{currentDueDate}</span>
                </div>
            </div>

            {/* Projects */}
            <div className="flex items-center gap-3 relative">
                <span className="w-28 text-sm text-gray-700 font-semibold">Projects</span>
                <button
                    type="button"
                    onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100  rounded-full hover:bg-blue-100 text-sm font- text-blue-600  transition-all cursor-pointer"
                >
                    <span>{selectedProject ? selectedProject.name : "Select Project"}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                </button>
                {isProjectDropdownOpen && (
                    <div className="absolute top-full left-32 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-[99999] p-1 flex flex-col gap-1 w-56 max-h-64 overflow-y-auto">
                        <button
                            type="button"
                            onClick={() => {
                                setFormData((prev: any) => ({ ...prev, project_object_id: null }));
                                onEditTask(task._id, { project_object_id: null });
                                setIsProjectDropdownOpen(false);
                            }}
                            className="text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 text-gray-700 transition-all"
                        >
                            None
                        </button>
                        {projects.map((p) => (
                            <button
                                key={p._id}
                                type="button"
                                onClick={() => {
                                    setFormData((prev: any) => ({ ...prev, project_object_id: p._id }));
                                    onEditTask(task._id, { project_object_id: p._id });
                                    setIsProjectDropdownOpen(false);
                                }}
                                className="text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 text-gray-700 transition-all"
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fields Grid Box */}
            <div className="flex items-start gap-3">
                <span className="w-28 text-sm text-gray-700 font-semibold mt-2.5">Fields</span>
                <div className="flex-1 border border-gray-200/60 rounded-2xl bg-white max-w-md relative">
                    {/* Status Column */}
                    <div className="flex items-center border-b border-gray-100 divide-x divide-gray-100 rounded-t-2xl">
                        <div className="w-1/3 px-4 py-3.5 flex items-center gap-2 text-xs  text-gray-700">
                            <CheckCircle className="w-4 h-4 text-gray-700" />
                            <span>Status</span>
                        </div>
                        <div className="w-2/3 px-4 py-2">
                            <StatusDropdown
                                taskId={task._id}
                                currentStatus={task.phase_info?.name || task.phase_object_id || task.status_object_id || task.status}
                                phaseInfo={task.phase_info}
                                onStatusChange={async (taskId, phaseId) => {
                                    onEditTask(taskId, { phase_object_id: phaseId });
                                }}
                            />
                        </div>
                    </div>

                    {/* Priority Column */}
                    <div className="flex items-center divide-x divide-gray-100 relative rounded-b-2xl z-10">
                        <div className="w-1/3 px-4 py-3.5 flex items-center gap-2 text-xs text-gray-700">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>Priority</span>
                        </div>
                        <div className="w-2/3 px-4 py-2">
                            <button
                                type="button"
                                onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs  transition-all ",
                                    formData.priority === "High" ? "bg-red-50 text-red-600 border-red-100" :
                                        formData.priority === "Low" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            "bg-blue-100"
                                )}
                            >
                                {formData.priority}
                            </button>
                            {isPriorityDropdownOpen && (
                                <div className="absolute top-full left-1/3 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-[99999] p-1 flex flex-col gap-1 w-28">
                                    {(["High", "Normal", "Low"] as const).map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => {
                                                setFormData((prev: any) => ({ ...prev, priority: p }));
                                                onEditTask(task._id, { priority: p });
                                                setIsPriorityDropdownOpen(false);
                                            }}
                                            className="text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 text-gray-700 transition-all"
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
