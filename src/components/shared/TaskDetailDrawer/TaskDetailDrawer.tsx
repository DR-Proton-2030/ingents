"use client";

import React, { useEffect, useState, useContext } from "react";
import AuthContext from "@/contexts/authContext/authContext";
import { createPortal } from "react-dom";
import { UsersGroupRounded, Calendar } from "@solar-icons/react";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";
import { TaskAttachment } from "@/types/interface/task.interface";
import { AttachmentInput } from "@/types/interface/task-modal.interface";
import { cn } from "@/lib/utils";
import {
    GeneralInfoSection,
    ScheduleSection,
    AssigneesSection,
    TagsSection,
    SubtasksSection,
    DateTimePicker,
    ParticipantsPicker,
    DeleteConfirmModal,
    TaskDrawerHeader,
    TaskMetadataSection,
    CommentsSection,
} from "./components";
import AttachmentsSection from "@/components/shared/attachments/AttachmentsSection";
import TagPicker from "@/components/shared/TagPicker/TagPicker";
import { ITag } from "@/types/interface/tag.interface";
import useProjects from "@/hooks/useProjects";

interface TaskDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    task: any;
    onEditTask: (taskId: string, updates: any, silent?: boolean) => void;
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
    const { user: currentUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "Normal" as "High" | "Normal" | "Low",
        project_object_id: null as string | null,
    });

    const [activePicker, setActivePicker] = useState<"time" | "participants" | "tags" | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Premium Interactive States
    const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"comments" | "updates">("comments");
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState<Array<{ id: string; author: string; avatar?: string; time: string; text: string }>>([]);

    // Calendar States
    const [viewDate, setViewDate] = useState(new Date());
    const [selDate, setSelDate] = useState(new Date());
    const [selHour, setSelHour] = useState("09");
    const [selMinute, setSelMinute] = useState("00");
    const [selAmPm, setSelAmPm] = useState("AM");

    // Attachments State
    const [newAttachments, setNewAttachments] = useState<AttachmentInput[]>([]);
    const [existingAttachments, setExistingAttachments] = useState<TaskAttachment[]>([]);

    // Project State
    const { projects } = useProjects();

    // User search
    const { users: allUsers } = useGetUsers();
    const [searchQuery, setSearchQuery] = useState("");
    const headerFileInputRef = React.useRef<HTMLInputElement>(null);
    const titleRef = React.useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOpen && titleRef.current) {
            setTimeout(() => {
                if (titleRef.current) {
                    titleRef.current.style.height = 'auto';
                    titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
                }
            }, 0);
        }
    }, [formData.title, isOpen]);

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
                project_object_id: task.project_object_id || null,
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

            setComments((task as any).comments || []);
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
            project_object_id: formData.project_object_id,
            attachments: [
                ...existingAttachments.map(att => ({ url: att.url, description: att.description })),
                ...newAttachments
            ],
            tag_object_id_list: task?.tags?.map((t: any) => t._id)
        }, false);
        setIsSaving(false);
        onClose();
    };

    // Attachment Handlers — auto-save on add/remove so files persist to DB immediately
    const handleAddFiles = async (files: File[]) => {
        const newAtts = files.map(file => ({ file, description: "" }));
        const allNew = [...newAttachments, ...newAtts].slice(0, 10 - existingAttachments.length);
        setNewAttachments(allNew);

        // Immediately upload to server
        await onEditTask(task._id, {
            attachments: [
                ...existingAttachments.map(att => ({ url: att.url, description: att.description })),
                ...allNew
            ],
        }, true);

        // After successful upload, refetch will update task.attachments via props,
        // so reset newAttachments (they are now existing on the server)
        setNewAttachments([]);
    };

    const handleHeaderFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleAddFiles(Array.from(files));
        }
        if (headerFileInputRef.current) headerFileInputRef.current.value = "";
    };

    const handleRemoveNewAttachment = (index: number) => {
        setNewAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingAttachment = async (index: number) => {
        const updated = existingAttachments.filter((_, i) => i !== index);
        setExistingAttachments(updated);

        // Persist removal to server immediately
        await onEditTask(task._id, {
            attachments: updated.map(att => ({ url: att.url, description: att.description })),
        }, true);
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

    const handleSendComment = () => {
        if (!commentText.trim()) return;
        const authorName = currentUser?.full_name || "Anonymous";
        const authorAvatar = (currentUser as any)?.profile_picture || (currentUser as any)?.avatar || "";
        const timeString = new Date().toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        const newComment = {
            id: String(Date.now()),
            author: authorName,
            avatar: authorAvatar,
            time: timeString,
            text: commentText.trim()
        };

        const updatedComments = [...comments, newComment];

        // Optimistic UI update
        setComments(updatedComments);
        setCommentText("");

        // Persist comment list update to backend silently
        onEditTask(task._id, { comments: updatedComments }, true);
    };

    if (typeof document === "undefined" || !task) return null;

    const currentDueDate = task?.due_date
        ? new Date(task.due_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
        : "Select Due Date";

    const selectedProject = projects.find(p => p._id === formData.project_object_id);

    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-[9999] transition-opacity duration-300",
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

            <div
                className={cn(
                    "absolute top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col border-l border-gray-100",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Action Bar */}
                <TaskDrawerHeader
                    phaseName={task?.phase_details?.name || ""}
                    onSave={handleSave}
                    onDeleteClick={() => setShowDeleteConfirm(true)}
                    onClose={onClose}
                    onAddAttachmentClick={() => headerFileInputRef.current?.click()}
                />

                <input
                    ref={headerFileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
                    onChange={handleHeaderFileChange}
                    className="hidden"
                />

                {/* Content Panel */}
                <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-hide space-y-6">
                    {/* Task Title (Inline Editable) */}
                    <textarea
                        ref={titleRef}
                        name="title"
                        value={formData.title}
                        onChange={(e) => {
                            handleChange(e);
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onBlur={handleSave}
                        placeholder="Schedule me an appointment..."
                        rows={1}
                        className="w-full text-2xl sm:text-3xl text-gray-900 tracking-tight leading-snug border-none p-0 focus:ring-0 focus:outline-none placeholder:text-gray-300 resize-none overflow-hidden bg-transparent focus-visible:outline-none"
                    />

                    {/* Metadata Properties Rows */}
                    <TaskMetadataSection
                        task={task}
                        formData={formData}
                        setFormData={setFormData}
                        projects={projects}
                        currentDueDate={currentDueDate}
                        onEditTask={onEditTask}
                        setActivePicker={setActivePicker}
                        isProjectDropdownOpen={isProjectDropdownOpen}
                        setIsProjectDropdownOpen={setIsProjectDropdownOpen}
                        isPriorityDropdownOpen={isPriorityDropdownOpen}
                        setIsPriorityDropdownOpen={setIsPriorityDropdownOpen}
                    />

                    {/* Description Textarea */}
                    <div className="space-y-2 max-w-lg pt-4">
                        <label className="block text-sm font-bold text-gray-800 tracking-tight">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            onBlur={handleSave}
                            placeholder="Provide context or instructions..."
                            rows={4}
                            className="w-full p-4 border border-gray-200/60 rounded-2xl outline-none text-sm font-medium text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/70 transition-all placeholder:text-gray-400 resize-none bg-white focus-visible:outline-none"
                        />
                    </div>

                    {/* Subtasks Section */}
                    <div className="pt-2 max-w-lg">
                        <SubtasksSection
                            subtasks={task?.subtask || []}
                            onAddSubtask={() => { onAddSubtask(task._id); onClose(); }}
                        />
                    </div>

                    {/* Attachments Section */}
                    <div className="pt-2 max-w-lg">
                        <AttachmentsSection
                            attachments={newAttachments}
                            existingAttachments={existingAttachments}
                            onAddFiles={handleAddFiles}
                            onRemoveAttachment={handleRemoveNewAttachment}
                            onRemoveExisting={handleRemoveExistingAttachment}
                            onUpdateDescription={handleUpdateNewDescription}
                            onUpdateExistingDescription={handleUpdateExistingDescription}
                        />
                    </div>

                    {/* Tabs & Live Comments Section */}
                    <CommentsSection
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        commentText={commentText}
                        setCommentText={setCommentText}
                        comments={comments}
                        onSendComment={handleSendComment}
                    />
                </div>

                {/* Side Picker Panel */}
                <div className={cn(
                    "absolute top-1/2 -translate-y-1/2 right-[100%] mr-4 w-96 bg-white rounded-3xl shadow-2xl transition-all duration-300 transform border border-white/40 backdrop-blur-md z-[99999]",
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
                    {activePicker === "tags" && (
                        <div className="p-6">
                            <TagPicker
                                selectedTagIds={task?.tags?.map((t: any) => t._id) || []}
                                onAddTag={(tag) => onEditTask(task._id, {
                                    tag_object_id_list: [...(task?.tags?.map((t: any) => t._id) || []), tag._id]
                                })}
                                onRemoveTag={(id) => onEditTask(task._id, {
                                    tag_object_id_list: (task?.tags?.map((t: any) => t._id) || []).filter((tid: string) => tid !== id)
                                })}
                                onClose={() => setActivePicker(null)}
                            />
                        </div>
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
