"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  CloseCircle,
  Calendar,
  Document,
  Flag,
  UsersGroupRounded,
  CheckCircle,
  Notes,
  AltArrowRight,
  MinusCircle,
  AddCircle,
} from "@solar-icons/react";
import type {
  CreateTaskModalProps,
  TaskFormData,
} from "@/types/interface/task-modal.interface";
import { SearchIcon } from "lucide-react";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialStatus,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    due_date: "",
    priority: "Normal",
    assigned_user_list: [],
    phase_object_id: initialStatus,
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [activePicker, setActivePicker] = useState<"time" | "participants" | null>(null);

  // Custom Picker States
  const [viewDate, setViewDate] = useState(new Date());
  const [selDate, setSelDate] = useState(new Date());
  const [selHour, setSelHour] = useState("09");
  const [selMinute, setSelMinute] = useState("00");
  const [selAmPm, setSelAmPm] = useState("AM");

  // User Search State
  const { users: allUsers } = useGetUsers();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = (Array.isArray(allUsers) ? allUsers : []).filter((u) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return false;
    return (
      u.full_name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
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
        phase_object_id: initialStatus
      }));
      setSelectedUsers([]);
      setActivePicker(null);
      setSearchQuery("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
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

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return { firstDay, days };
  };

  const calendarData = getDaysInMonth(viewDate);

  // Close on escape key
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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
    });
    setIsSubmitting(false);
    onClose();
  };

  // Use portal to render at body level (SSR guard)
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Drawer Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="m-3 bg-gradient-to-r from-orange-500 to-orange-400 p-4 text-white shrink-0 rounded-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Create New Task
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <CloseCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide">
          <form onSubmit={handleSubmit} id="create-task-form" className="space-y-8 pb-6">
            {/* Primary Details */}
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
                    onChange={handleChange}
                    placeholder="e.g. Design System Audit"
                    className="w-full h-11 px-4 rounded-xl outline-none text-sm font-medium text-gray-800 bg-gray-100"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide context or instructions..."
                    className="w-full p-4 rounded-xl outline-none text-sm font-medium text-gray-800 bg-gray-100 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Timeline & Priority */}
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
                    onClick={() => setActivePicker(activePicker === "time" ? null : "time")}
                    className={`w-full h-11 px-3 rounded-xl border transition-all flex items-center justify-between group ${activePicker === "time" ? "border-orange-500 bg-orange-50/30" : "border-gray-100 bg-white"
                      }`}
                  >
                    <span className="text-xs font-bold text-gray-800">
                      {formData.due_date ? new Date(formData.due_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : "Select Due Date"}
                    </span>
                    <Calendar className={`w-4 h-4 transition-colors ${activePicker === "time" ? "text-orange-500" : "text-gray-400 group-hover:text-orange-500"}`} />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Priority Level</label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-200/70 rounded-xl">
                    {["High", "Normal", "Low"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priority: p as any }))}
                        className={`h-8 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${formData.priority === p
                          ? "bg-gradient-to-r from-black/70 to-black/70 text-white border border-gray-100"
                          : "text-gray-500 hover:text-gray-700"
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Assignees */}
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
                  onClick={() => setActivePicker("participants")}
                  className="text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase tracking-widest bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 transition-all active:scale-95"
                >
                  Manage
                </button>
              </h3>

              <div className="space-y-2">
                {selectedUsers.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 min-h-[60px]">
                    {selectedUsers.map(u => (
                      <div key={u.id || (u as any)._id} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm" title={u.full_name}>
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
                      {selectedUsers.length} Teammates Assigned
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-orange-200 transition-colors cursor-pointer" onClick={() => setActivePicker("participants")}>
                    <UsersGroupRounded className="w-8 h-8 text-gray-300 group-hover:text-orange-300 transition-colors mb-2" />
                    <p className="text-xs font-bold text-gray-400 group-hover:text-gray-500">No assignees yet</p>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Click to assign teammates</p>
                  </div>
                )}
              </div>
            </div>
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
          className={`absolute top-1/2 -translate-y-1/2 right-[100%] mr-4 w-96 bg-white rounded-3xl shadow-2xl transition-all duration-300 transform border border-white/40 backdrop-blur-md ${activePicker ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"
            }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-800">
                {activePicker === "time" ? "Select Due Time" : "Assign Teammates"}
              </h4>
              <button onClick={() => setActivePicker(null)} className="p-1 hover:bg-gray-50 rounded-full">
                <CloseCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {activePicker === "time" && (
              <div className="space-y-6">
                {/* Month Header */}
                <div className="flex items-center justify-between px-1">
                  <h5 className="text-xs font-black text-gray-800">
                    {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h5>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <AltArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
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
                        className={`h-8 w-8 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center ${isSelected ? "bg-orange-500 text-white shadow-lg shadow-orange-200 scale-110" : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                          }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Time Picker Section */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between gap-2 p-1 bg-gray-50 rounded-2xl">
                    <div className="flex-1 flex flex-col gap-1 items-center">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Hour</span>
                      <div className="flex gap-1 flex-wrap justify-center">
                        {["09", "10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08"].map(h => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setSelHour(h)}
                            className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${selHour === h ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-200"
                              }`}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="w-px h-12 bg-gray-200" />
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => setSelAmPm("AM")}
                        className={`px-2 py-1.5 rounded-lg text-[9px] font-black transition-all ${selAmPm === "AM" ? "bg-orange-500 text-white" : "bg-white text-gray-400"}`}
                      >AM</button>
                      <button
                        type="button"
                        onClick={() => setSelAmPm("PM")}
                        className={`px-2 py-1.5 rounded-lg text-[9px] font-black transition-all ${selAmPm === "PM" ? "bg-orange-500 text-white" : "bg-white text-gray-400"}`}
                      >PM</button>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {["00", "15", "30", "45"].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSelMinute(m)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${selMinute === m ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-white border-gray-100 text-gray-400 hover:border-orange-200"
                          }`}
                      >
                        :{m}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePicker(null)}
                  className="w-full h-12 bg-gray-900 text-white rounded-2xl text-xs font-bold hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200 mt-4"
                >
                  Done Selecting
                </button>
              </div>
            )}

            {activePicker === "participants" && (
              <div className="space-y-6">
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search teammates..."
                    className="w-full h-12 pl-11 pr-4 rounded-2xl transition-all outline-none text-sm font-bold bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/10 border border-transparent focus:border-orange-500 text-gray-800"
                  />

                  {searchQuery.trim() && filteredUsers.length > 0 && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="p-2 max-h-64 overflow-y-auto">
                        {filteredUsers.map((u) => (
                          <button
                            key={u.id || (u as any)._id}
                            type="button"
                            onClick={() => addAssignee(u)}
                            className="w-full p-2.5 flex items-center gap-3 hover:bg-orange-50 rounded-xl transition-all group"
                          >
                            <div className="w-10 h-10 rounded-full bg-white text-gray-600 flex items-center justify-center text-xs font-bold border border-gray-100 shadow-sm uppercase overflow-hidden">
                              {u.profile_picture ? (
                                <img src={u.profile_picture} alt="" className="w-full h-full object-cover" />
                              ) : (
                                u.full_name?.charAt(0) || "?"
                              )}
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800 group-hover:text-orange-600 truncate">{u.full_name}</p>
                              <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                            </div>
                            <AddCircle className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1 border-b border-gray-100 pb-2">
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected Assignees ({selectedUsers.length})</h5>
                  </div>
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {selectedUsers.map(u => (
                      <div key={u.id || (u as any)._id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 hover:border-orange-100 transition-all group">
                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-black shadow-sm uppercase overflow-hidden">
                          {u.profile_picture ? (
                            <img src={u.profile_picture} alt="" className="w-full h-full object-cover" />
                          ) : (
                            u.full_name?.charAt(0) || "?"
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{u.full_name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                        </div>
                        <button type="button" onClick={() => removeAssignee(u.id || (u as any)._id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <MinusCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {selectedUsers.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-xs font-bold text-gray-400">Search above to assign people</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePicker(null)}
                  className="w-full h-12 bg-gray-900 text-white rounded-2xl text-xs font-bold hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200 mt-4"
                >
                  Done Managing
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateTaskModal;
