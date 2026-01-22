"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CloseCircle, CheckCircle } from "@solar-icons/react";
import type { CreateTaskModalProps, TaskFormData, AttachmentInput } from "@/types/interface/task-modal.interface";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";
import { cn } from "@/lib/utils";
import {
  CreateGeneralInfo,
  CreateSchedule,
  CreateAssignees,
  CreateDateTimePicker,
  CreateParticipantsPicker,
} from "./components";
import AttachmentsSection from "@/components/shared/attachments/AttachmentsSection";
import PhaseSelect from "@/components/shared/PhaseSelect/PhaseSelect";
import useProjects from "@/hooks/useProjects";
import ProjectSelect from "@/components/shared/ProjectSelect/ProjectSelect";

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialStatus,
  phases,
  initialProjectId,
}) => {
  const getInitialPhaseId = () => {
    if (initialStatus) return initialStatus;
    if (phases && phases.length > 0) {
      return [...phases].sort((a, b) => (a.index || 0) - (b.index || 0))[0]._id;
    }
    return undefined;
  };

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    due_date: "",
    priority: "Normal",
    assigned_user_list: [],
    phase_object_id: getInitialPhaseId(),
    project_object_id: initialProjectId || null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [activePicker, setActivePicker] = useState<"time" | "participants" | null>(null);
  const [attachments, setAttachments] = useState<AttachmentInput[]>([]);

  // Custom Picker States
  const [viewDate, setViewDate] = useState(new Date());
  const [selDate, setSelDate] = useState(new Date());
  const [selHour, setSelHour] = useState("09");
  const [selMinute, setSelMinute] = useState("00");
  const [selAmPm, setSelAmPm] = useState("AM");

  // Project State
  const { projects } = useProjects();

  // User Search State
  const { users: allUsers } = useGetUsers();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = (Array.isArray(allUsers) ? allUsers : []).filter((u) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return false;
    return u.full_name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term);
  });

  useEffect(() => {
    if (isOpen) {
      setFormData((p) => ({
        ...p,
        title: "",
        description: "",
        due_date: "",
        priority: "Normal",
        assigned_user_list: [],
        phase_object_id: getInitialPhaseId(),
        project_object_id: initialProjectId || null,
      }));
      setSelectedUsers([]);
      setAttachments([]);
      setActivePicker(null);
      setSearchQuery("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, initialStatus]);

  // Sync custom picker states to due_date
  useEffect(() => {
    const year = selDate.getFullYear();
    const month = String(selDate.getMonth() + 1).padStart(2, "0");
    const day = String(selDate.getDate()).padStart(2, "0");
    let h = parseInt(selHour);
    if (selAmPm === "PM" && h < 12) h += 12;
    if (selAmPm === "AM" && h === 12) h = 0;
    const formattedDate = `${year}-${month}-${day}T${String(h).padStart(2, "0")}:${selMinute}`;
    setFormData(prev => ({ ...prev, due_date: formattedDate }));
  }, [selDate, selHour, selMinute, selAmPm]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const addAssignee = (user: IUser) => {
    if (selectedUsers.some(u => (u.id || (u as any)._id) === (user.id || (user as any)._id))) return;
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery("");
  };

  const removeAssignee = (id: string) => {
    setSelectedUsers(selectedUsers.filter(u => (u.id || (u as any)._id) !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Title is required");
    setIsSubmitting(true);
    await onSubmit({
      ...formData,
      assigned_user_list: selectedUsers.map((u) => u.id || (u as any)._id),
      attachments: attachments,
    });
    setIsSubmitting(false);
    onClose();
  };

  // Attachment handlers
  const handleAddFiles = (files: File[]) => {
    const newAttachments = files.map((file) => ({ file, description: "" }));
    setAttachments((prev) => [...prev, ...newAttachments].slice(0, 10));
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateDescription = (index: number, description: string) => {
    setAttachments((prev) =>
      prev.map((att, i) => (i === index ? { ...att, description } : att))
    );
  };

  if (typeof document === "undefined") return null;

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
            <h2 className="text-lg font-semibold flex items-center gap-2">Create New Task</h2>
            <button type="button" onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <CloseCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide">
          <form onSubmit={handleSubmit} id="create-task-form" className="space-y-8 pb-6">
            <CreateGeneralInfo
              title={formData.title}
              description={formData.description}
              onChange={handleChange}
            />
            <PhaseSelect
              phases={phases}
              selectedPhaseId={formData.phase_object_id}
              onPhaseChange={(id) => setFormData(prev => ({ ...prev, phase_object_id: id }))}
            />
            <ProjectSelect
              projects={projects}
              selectedProjectId={formData.project_object_id}
              onProjectChange={(id) => setFormData(prev => ({ ...prev, project_object_id: id }))}
            />
            <CreateSchedule
              dueDate={formData.due_date}
              priority={formData.priority}
              activePicker={activePicker}
              onTogglePicker={() => setActivePicker(activePicker === "time" ? null : "time")}
              onPriorityChange={(p) => setFormData(prev => ({ ...prev, priority: p }))}
            />
            <CreateAssignees
              selectedUsers={selectedUsers}
              onManageClick={() => setActivePicker("participants")}
            />
            <AttachmentsSection
              attachments={attachments}
              onAddFiles={handleAddFiles}
              onRemoveAttachment={handleRemoveAttachment}
              onUpdateDescription={handleUpdateDescription}
            />
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-100 shrink-0 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.05)]">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-all active:scale-95"
            >
              Discard
            </button>
            <button
              type="submit"
              form="create-task-form"
              disabled={isSubmitting}
              className="flex-[2] h-12 rounded-xl bg-black/80 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-gray-200"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Create Task
                </>
              )}
            </button>
          </div>
        </div>

        {/* Side Picker Panel */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 right-[100%] mr-4 w-96 bg-white rounded-3xl shadow-2xl transition-all duration-300 transform border border-white/40 backdrop-blur-md",
            activePicker ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"
          )}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-800">
                {activePicker === "time" ? "Select Due Time" : "Assign Teammates"}
              </h4>
              <button type="button" onClick={() => setActivePicker(null)} className="p-1 hover:bg-gray-50 rounded-full">
                <CloseCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {activePicker === "time" && (
              <CreateDateTimePicker
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
                onClose={() => setActivePicker(null)}
              />
            )}

            {activePicker === "participants" && (
              <CreateParticipantsPicker
                searchQuery={searchQuery}
                filteredUsers={filteredUsers}
                selectedUsers={selectedUsers}
                onSearchChange={setSearchQuery}
                onAddAssignee={addAssignee}
                onRemoveAssignee={removeAssignee}
                onClose={() => setActivePicker(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateTaskModal;
