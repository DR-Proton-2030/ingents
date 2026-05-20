"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CloseCircle, CheckCircle as CheckCircleIcon, Calendar as CalendarIcon, UsersGroupRounded } from "@solar-icons/react";
import { ArrowRight, ChevronDown, Clock, Plus } from "lucide-react";
import type { CreateTaskModalProps, TaskFormData, AttachmentInput } from "@/types/interface/task-modal.interface";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";
import { cn } from "@/lib/utils";
import {
  CreateDateTimePicker,
  CreateParticipantsPicker,
} from "./components";
import TagPicker from "@/components/shared/TagPicker/TagPicker";
import { ITag } from "@/types/interface/tag.interface";
import AttachmentsSection from "@/components/shared/attachments/AttachmentsSection";
import useProjects from "@/hooks/useProjects";

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
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);
  const [activePicker, setActivePicker] = useState<"time" | "participants" | "tags" | null>(null);
  const [attachments, setAttachments] = useState<AttachmentInput[]>([]);

  // Dropdown States
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);

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
      setSelectedTags([]);
      setIsStatusDropdownOpen(false);
      setIsProjectDropdownOpen(false);
      setIsPriorityDropdownOpen(false);
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
    if (!formData.title.trim()) return;
    setIsSubmitting(true);
    await onSubmit({
      ...formData,
      assigned_user_list: selectedUsers.map((u) => u.id || (u as any)._id),
      tag_object_id_list: selectedTags.map(tag => tag._id),
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

  const selectedProject = projects.find(p => p._id === formData.project_object_id);
  const selectedPhase = phases.find(p => p._id === formData.phase_object_id);

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
        {/* Premium Header */}
        <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">


          <div className="flex items-center gap-2">
            <button
              type="submit"
              form="create-task-form"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-full cursor-pointer hover:bg-blue-500 hover:text-white  text-black text-lg border  border-gray-200  flex  items-center  gap-2 "
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Task
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <button type="button" onClick={onClose} className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
              <ArrowRight className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-hide space-y-6 bg-white">
          <form onSubmit={handleSubmit} id="create-task-form" className="space-y-6">

            {/* Task Title (Big Textarea like Drawer) */}
            <textarea
              name="title"
              value={formData.title}
              onChange={(e) => {
                handleChange(e);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              placeholder="Schedule me an appointment..."
              rows={1}
              className="w-full text-2xl sm:text-3xl text-gray-900 tracking-tight leading-snug border-none p-0 focus:ring-0 focus:outline-none placeholder:text-gray-300 resize-none overflow-hidden bg-transparent focus-visible:outline-none font-bold"
              required
            />

            {/* Metadata Properties Rows */}
            <div className="space-y-3">
              {/* Assignee Row */}
              <div className="flex items-center gap-3">
                <span className="w-28 text-sm text-gray-700 font-semibold">Assignee</span>
                <div
                  onClick={() => setActivePicker("participants")}
                  className="flex items-center gap-2 hover:bg-gray-50 rounded-full px-2.5 py-1.5 transition-all cursor-pointer border border-transparent hover:border-gray-200/50"
                >
                  {selectedUsers.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        {selectedUsers.map((u: any) => (
                          <div key={u._id || u.id} className="w-6 h-6 rounded-full border border-white bg-gray-200 overflow-hidden shadow-sm">
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
                      <span className="text-sm text-gray-800">
                        {selectedUsers.map((u: any) => u.full_name).join(", ")}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-400">
                      <UsersGroupRounded className="w-4.5 h-4.5" />
                      <span>Unassigned</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Due Date Row */}
              <div className="flex items-center gap-3">
                <span className="w-28 text-sm text-gray-700 font-semibold">Due Date</span>
                <div
                  onClick={() => setActivePicker("time")}
                  className="flex items-center gap-2 hover:bg-gray-50 rounded-full px-2.5 py-1.5 transition-all cursor-pointer border border-transparent hover:border-gray-200/50 text-sm text-gray-800"
                >
                  <CalendarIcon className="w-4.5 h-4.5 text-gray-400" />
                  <span>{formData.due_date ? new Date(formData.due_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : "Select Due Date"}</span>
                </div>
              </div>

              {/* Projects Dropdown */}
              <div className="flex items-center gap-3 relative">
                <span className="w-28 text-sm text-gray-700 font-semibold">Projects</span>
                <button
                  type="button"
                  onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full hover:bg-blue-100 text-sm text-blue-600 transition-all cursor-pointer font-semibold"
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
                    <div className="w-1/3 px-4 py-3.5 flex items-center gap-2 text-xs text-gray-700">
                      <CheckCircleIcon className="w-4.5 h-4.5 text-gray-700" />
                      <span>Status</span>
                    </div>
                    <div className="w-2/3 px-4 py-2">
                      <button
                        type="button"
                        onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                        className="px-3 py-1.5 rounded-lg text-xs transition-all bg-amber-50 text-amber-700 font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: selectedPhase?.color || "#8350e8" }}
                        />
                        {selectedPhase?.name || "Select Phase"}
                      </button>
                      {isStatusDropdownOpen && (
                        <div className="absolute top-full left-1/3 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-[99999] p-1 flex flex-col gap-1 w-44 max-h-64 overflow-y-auto">
                          {phases.map((p) => (
                            <button
                              key={p._id}
                              type="button"
                              onClick={() => {
                                setFormData((prev: any) => ({ ...prev, phase_object_id: p._id }));
                                setIsStatusDropdownOpen(false);
                              }}
                              className="text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 text-gray-700 transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <div
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: p.color || "#8350e8" }}
                              />
                              {p.name}
                            </button>
                          ))}
                        </div>
                      )}
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
                          "px-3 py-1.5 rounded-lg text-xs transition-all font-semibold cursor-pointer",
                          formData.priority === "High" ? "bg-red-50 text-red-600 border-red-100" :
                            formData.priority === "Low" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                              "bg-blue-50 text-blue-600"
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
                                setIsPriorityDropdownOpen(false);
                              }}
                              className="text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 text-gray-700 transition-all cursor-pointer"
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

            {/* Tags Section */}
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-gray-700 font-semibold">Tags</span>
              <button
                type="button"
                onClick={() => setActivePicker("tags")}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-full px-3 py-1.5  transition-all cursor-pointer text-xs font-semibold text-gray-600"
              >
                {selectedTags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTags.map((tag) => (
                      <span key={tag._id} className="px-2.5 py-1.5 rounded-lg text-[14px] shrink-0]" style={{
                        backgroundColor: tag.color + "15",
                        borderColor: tag.color + "40",
                        color: tag.color
                      }}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span>Manage Tags</span>
                )}
              </button>
            </div>

            {/* Description Textarea */}
            <div className="space-y-2 max-w-lg pt-4">
              <label className="block text-sm font-bold text-gray-800 tracking-tight">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide context or instructions..."
                rows={4}
                className="w-full p-4 border border-gray-200/60 rounded-2xl outline-none text-sm font-medium text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/70 transition-all placeholder:text-gray-400 resize-none bg-white focus-visible:outline-none"
              />
            </div>

            {/* Attachments Section */}
            <div className="pt-2 max-w-lg">
              <AttachmentsSection
                attachments={attachments}
                onAddFiles={handleAddFiles}
                onRemoveAttachment={handleRemoveAttachment}
                onUpdateDescription={handleUpdateDescription}
              />
            </div>

          </form>
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
                {activePicker === "time" ? "Select Due Time" :
                  activePicker === "participants" ? "Assign Teammates" : "Manage Tags"}
              </h4>
              <button type="button" onClick={() => setActivePicker(null)} className="p-1 hover:bg-gray-50 rounded-full cursor-pointer">
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

            {activePicker === "tags" && (
              <TagPicker
                selectedTagIds={selectedTags.map(t => t._id)}
                onAddTag={(tag) => setSelectedTags([...selectedTags, tag])}
                onRemoveTag={(id) => setSelectedTags(selectedTags.filter(t => t._id !== id))}
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
