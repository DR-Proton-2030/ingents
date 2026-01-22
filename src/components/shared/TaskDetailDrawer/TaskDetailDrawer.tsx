"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CloseCircle, CheckCircle, TrashBinMinimalistic } from "@solar-icons/react";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";
import { TaskAttachment } from "@/types/interface/task.interface";
import { AttachmentInput } from "@/types/interface/task-modal.interface";
import { cn } from "@/lib/utils";
import {
    GeneralInfoSection,
    ScheduleSection,
    AssigneesSection,
    SubtasksSection,
    DateTimePicker,
    ParticipantsPicker,
    DeleteConfirmModal,
} from "./components";
import AttachmentsSection from "@/components/shared/attachments/AttachmentsSection";

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
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "Normal" as "High" | "Normal" | "Low",
    });

    const [activePicker, setActivePicker] = useState<"time" | "participants" | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Calendar States
    const [viewDate, setViewDate] = useState(new Date());
    const [selDate, setSelDate] = useState(new Date());
    const [selHour, setSelHour] = useState("09");
    const [selMinute, setSelMinute] = useState("00");
    const [selAmPm, setSelAmPm] = useState("AM");

    // Attachments State
    const [newAttachments, setNewAttachments] = useState<AttachmentInput[]>([]);
    const [existingAttachments, setExistingAttachments] = useState<TaskAttachment[]>([]);

    // User search
    const { users: allUsers } = useGetUsers();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = (Array.isArray(allUsers) ? allUsers : []).filter((u: any) => {
        const term = searchQuery.toLowerCase().trim();
        if (!term) return false;
        const isAlreadyAssigned = task?.assignees?.some(
            (a: any) => a._id === u._id || a._id === u.id
        );
        if (isAlreadyAssigned) return false;
        return u.full_name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term);
    });

    useEffect(() => {
        if (isOpen && task) {
            setFormData({
                title: task.title || "",
                description: task.description || "",
                priority: task.priority || "Normal",
            });
            setExistingAttachments(task.attachments || []);
            setNewAttachments([]);
            setActivePicker(null);
            setShowDeleteConfirm(false);
            setSearchQuery("");

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
            } else {
                setViewDate(new Date());
                setSelDate(new Date());
                setSelHour("09");
                setSelMinute("00");
                setSelAmPm("AM");
            }

            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen, task]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (isOpen) document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    const saveDateTimeAndClose = () => {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleSave = async () => {
        if (!formData.title.trim()) return;
        setIsSaving(true);
        await onEditTask(task._id, {
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            attachments: [
                ...existingAttachments.map(att => ({ url: att.url, description: att.description })),
                ...newAttachments
            ]
        });
        setIsSaving(false);
        onClose();
    };

    // Attachment Handlers
    const handleAddFiles = (files: File[]) => {
        const newAtts = files.map(file => ({ file, description: "" }));
        setNewAttachments(prev => [...prev, ...newAtts].slice(0, 10 - existingAttachments.length));
    };

    const handleRemoveNewAttachment = (index: number) => {
        setNewAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingAttachment = (index: number) => {
        setExistingAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdateNewDescription = (index: number, description: string) => {
        setNewAttachments(prev => prev.map((att, i) => i === index ? { ...att, description } : att));
    };

    const handleUpdateExistingDescription = (index: number, description: string) => {
        setExistingAttachments(prev => prev.map((att, i) => i === index ? { ...att, description } : att));
    };

    const handleDelete = () => {
        onDeleteTask(task._id);
        onClose();
    };

    const addAssignee = (user: IUser) => {
        onAssignTask(task._id, (user as any)._id || user.id);
        setSearchQuery("");
    };

    const removeAssignee = (userId: string) => {
        onUnassignTask(task._id, userId);
    };

    if (typeof document === "undefined") return null;

    const currentDueDate = task?.due_date
        ? new Date(task.due_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
        : "Select Due Date";

    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-[9999] transition-opacity duration-300",
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div
                className={cn(
                    "absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="m-3 bg-gradient-to-r from-orange-500 to-orange-400 p-4 text-white shrink-0 rounded-xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2">Edit Task</h2>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setShowDeleteConfirm(true)} className="p-2 hover:bg-white/30 rounded-full transition-colors">
                                <TrashBinMinimalistic className="w-5 h-5 text-white" />
                            </button>
                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                <CloseCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide">
                    <form id="edit-task-form" className="space-y-8 pb-6">
                        <GeneralInfoSection formData={formData} onChange={handleChange} />
                        <ScheduleSection
                            currentDueDate={currentDueDate}
                            priority={formData.priority}
                            activePicker={activePicker}
                            onTogglePicker={() => setActivePicker(activePicker === "time" ? null : "time")}
                            onPriorityChange={(p) => setFormData(prev => ({ ...prev, priority: p }))}
                        />
                        <AssigneesSection
                            assignees={task?.assignees || []}
                            onManageClick={() => setActivePicker("participants")}
                        />
                        <SubtasksSection
                            subtasks={task?.subtask || []}
                            onAddSubtask={() => { onAddSubtask(task._id); onClose(); }}
                        />
                        <AttachmentsSection
                            attachments={newAttachments}
                            existingAttachments={existingAttachments}
                            onAddFiles={handleAddFiles}
                            onRemoveAttachment={handleRemoveNewAttachment}
                            onRemoveExisting={handleRemoveExistingAttachment}
                            onUpdateDescription={handleUpdateNewDescription}
                            onUpdateExistingDescription={handleUpdateExistingDescription}
                        />
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-gray-100 shrink-0 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.05)]">
                    <div className="flex gap-4">
                        <button type="button" onClick={onClose} disabled={isSaving}
                            className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-all active:scale-95">
                            Cancel
                        </button>
                        <button type="button" onClick={handleSave} disabled={isSaving}
                            className="flex-[2] h-12 rounded-xl bg-black/80 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-gray-200">
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <><CheckCircle className="w-5 h-5" />Save Changes</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Side Picker Panel */}
                <div className={cn(
                    "absolute top-1/2 -translate-y-1/2 right-[100%] mr-4 w-96 bg-white rounded-3xl shadow-2xl transition-all duration-300 transform border border-white/40 backdrop-blur-md",
                    activePicker ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"
                )}>
                    {activePicker === "time" && (
                        <DateTimePicker
                            viewDate={viewDate}
                            selDate={selDate}
                            selHour={selHour}
                            selMinute={selMinute}
                            selAmPm={selAmPm}
                            onViewDateChange={setViewDate}
                            onSelDateChange={setSelDate}
                            onSelHourChange={setSelHour}
                            onSelMinuteChange={setSelMinute}
                            onSelAmPmChange={setSelAmPm}
                            onSave={saveDateTimeAndClose}
                            onClose={() => setActivePicker(null)}
                        />
                    )}
                    {activePicker === "participants" && (
                        <ParticipantsPicker
                            searchQuery={searchQuery}
                            filteredUsers={filteredUsers}
                            assignees={task?.assignees || []}
                            onSearchChange={setSearchQuery}
                            onAddAssignee={addAssignee}
                            onRemoveAssignee={removeAssignee}
                            onClose={() => setActivePicker(null)}
                        />
                    )}
                </div>

                <DeleteConfirmModal
                    isOpen={showDeleteConfirm}
                    taskTitle={task?.title || ""}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={handleDelete}
                />
            </div>
        </div>,
        document.body
    );
};

export default TaskDetailDrawer;
