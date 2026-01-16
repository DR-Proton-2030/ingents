"use client";
import React, { useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";
import {
    createMeeting,
    CreateMeetingPayload
} from "@/utils/api/meeting/meeting.api";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";
import {
    CloseCircle,
    Calendar,
    ClockCircle,
    Document,
    Notes,
    User,
    UsersGroupRounded,
    AddCircle,
    MinusCircle,
    Letter,
    AltArrowRight,
    NotebookMinimalistic
} from "@solar-icons/react";
import AuthContext from "@/contexts/authContext/authContext";
import { toast } from "react-toastify";
import { Search } from "@solar-icons/react/category";
import { SearchCode, SearchIcon } from "lucide-react";

interface CreateMeetingDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateMeetingDrawer: React.FC<CreateMeetingDrawerProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [duration, setDuration] = useState(60);
    const [notes, setNotes] = useState("");
    const [meetingType, setMeetingType] = useState("team");
    const [activePicker, setActivePicker] = useState<"time" | "duration" | "participants" | null>(null);

    // Custom Picker States
    const [viewDate, setViewDate] = useState(new Date());
    const [selDate, setSelDate] = useState(new Date());
    const [selHour, setSelHour] = useState("09");
    const [selMinute, setSelMinute] = useState("00");
    const [selAmPm, setSelAmPm] = useState("AM");

    // Participants State
    const [internalParticipants, setInternalParticipants] = useState<{ _id: string; full_name: string; email: string; profile_picture?: string }[]>([]);
    const [externalParticipants, setExternalParticipants] = useState<{ email: string; name: string }[]>([]);
    const [newExternalEmail, setNewExternalEmail] = useState("");
    const [newExternalName, setNewExternalName] = useState("");

    // User Search State
    const { users: allUsers } = useGetUsers();
    const [searchQuery, setSearchQuery] = useState("");

    // Sync end time when start time or duration changes
    useEffect(() => {
        if (startTime) {
            const start = new Date(startTime);
            const end = new Date(start.getTime() + duration * 60000);

            // Format to YYYY-MM-DDTHH:mm to match datetime-local input
            const pad = (n: number) => String(n).padStart(2, '0');
            const localEnd = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}`;
            setEndTime(localEnd);
        }
    }, [startTime, duration]);

    // Handle participant limit for one-on-one
    useEffect(() => {
        if (meetingType === "one_on_one") {
            const total = internalParticipants.length + externalParticipants.length;
            if (total > 1) {
                // Priority: Keep first internal if exists, else first external
                if (internalParticipants.length > 0) {
                    setInternalParticipants([internalParticipants[0]]);
                    setExternalParticipants([]);
                } else if (externalParticipants.length > 0) {
                    setExternalParticipants([externalParticipants[0]]);
                }
                toast.info("Trimmed to one participant for One-on-one meeting.");
            }
        }
    }, [meetingType]);

    // Frontend user filtering
    const safeUsers = Array.isArray(allUsers) ? allUsers : [];
    const filteredUsers = safeUsers.filter((user: IUser) => {
        const term = searchQuery.toLowerCase().trim();
        if (!term) return true;
        return (
            (user?.full_name || "").toLowerCase().includes(term) ||
            (user?.email || "").toLowerCase().includes(term)
        );
    });

    // Sync custom picker states to startTime
    useEffect(() => {
        const year = selDate.getFullYear();
        const month = String(selDate.getMonth() + 1).padStart(2, "0");
        const day = String(selDate.getDate()).padStart(2, "0");

        let h = parseInt(selHour);
        if (selAmPm === "PM" && h < 12) h += 12;
        if (selAmPm === "AM" && h === 12) h = 0;

        const formattedDate = `${year}-${month}-${day}T${String(h).padStart(2, "0")}:${selMinute}`;
        setStartTime(formattedDate);
    }, [selDate, selHour, selMinute, selAmPm]);

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
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    const addInternalParticipant = (u: IUser) => {
        if (meetingType === "one_on_one" && (internalParticipants.length + externalParticipants.length) >= 1) {
            toast.warning("One-on-one meetings only allow a single participant.");
            return;
        }
        const mapped = { _id: u.id || (u as any)._id, full_name: u.full_name, email: u.email, profile_picture: u.profile_picture };
        if (internalParticipants.find(p => p._id === mapped._id)) return;
        setInternalParticipants([...internalParticipants, mapped]);
        setSearchQuery("");
    };

    const removeInternalParticipant = (id: string) => {
        setInternalParticipants(internalParticipants.filter(p => p._id !== id));
    };

    const addExternalParticipant = () => {
        if (!newExternalEmail.trim()) return;
        if (meetingType === "one_on_one" && (internalParticipants.length + externalParticipants.length) >= 1) {
            toast.warning("One-on-one meetings only allow a single participant.");
            return;
        }
        setExternalParticipants([...externalParticipants, { email: newExternalEmail, name: newExternalName }]);
        setNewExternalEmail("");
        setNewExternalName("");
    };

    const removeExternalParticipant = (index: number) => {
        setExternalParticipants(externalParticipants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !startTime) {
            toast.error("Please fill in title and start time");
            return;
        }

        try {
            setIsLoading(true);

            const payload: CreateMeetingPayload = {
                title,
                description,
                scheduled_start_time: new Date(startTime).toISOString(),
                scheduled_end_time: new Date(endTime).toISOString(),
                duration_minutes: duration,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                meeting_type: meetingType,
                is_recurring: false,
                reminder_minutes_before: 15,
                notes,
                participants: [
                    ...internalParticipants.map(p => ({ user_object_id: p._id, is_optional: false })),
                    ...externalParticipants.map(p => ({ external_email: p.email, external_name: p.name, is_optional: false }))
                ]
            };

            await createMeeting(payload);
            toast.success("Meeting scheduled successfully!");
            if (onSuccess) onSuccess();
            onClose();

            // Reset form
            setTitle("");
            setDescription("");
            setStartTime("");
            setEndTime("");
            setParticipantsStates();
        } catch (err: any) {
            toast.error(err.message || "Failed to schedule meeting");
        } finally {
            setIsLoading(false);
        }
    };

    const setParticipantsStates = () => {
        setInternalParticipants([]);
        setExternalParticipants([]);
        setNotes("");
        setDescription("");
    }

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
                {/* Header: Exact match to MeetingDrawer */}
                <div className="sticky m-3 top-0 bg-gradient-to-r from-orange-500 to-orange-400 p-4 text-white shrink-0 rounded-xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            {/* <Calendar className="w-5 h-5" /> */}
                            Schedule Meeting
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
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-6 space-y-8 scrollbar-hide">

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
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1 tracking-wide">Meeting Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Weekly Product Sync"
                                    className="w-full h-11 px-4 rounded-xl 
                                    outline-none text-sm font-medium text-gray-800 bg-gray-100"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1 tracking-wide">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief outline of the agenda..."
                                    rows={3}
                                    className="w-full p-4 rounded-xl 
                                    outline-none text-sm font-medium text-gray-800 bg-gray-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Timeline & Type */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg">
                                <ClockCircle className="w-5 h-5 text-amber-500" />
                            </div>

                            Time & Format
                        </h3>


                        <div className="bg-gray-50 rounded-2xl p-4 space-y-4 border border-gray-100">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Commence At</label>
                                    <button
                                        type="button"
                                        onClick={() => setActivePicker(activePicker === "time" ? null : "time")}
                                        className={`w-full h-11 px-3 rounded-xl border transition-all flex items-center justify-between group ${activePicker === "time" ? "border-orange-500 bg-orange-50/30" : "border-gray-100 bg-white"
                                            }`}
                                    >
                                        <span className="text-xs font-bold text-gray-800">
                                            {startTime ? new Date(startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : "Select Time"}
                                        </span>
                                        <Calendar className={`w-4 h-4 transition-colors ${activePicker === "time" ? "text-orange-500" : "text-gray-400 group-hover:text-orange-500"}`} />
                                    </button>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Duration</label>
                                    <button
                                        type="button"
                                        onClick={() => setActivePicker(activePicker === "duration" ? null : "duration")}
                                        className={`w-full h-11 px-3 rounded-xl border transition-all flex items-center justify-between group ${activePicker === "duration" ? "border-orange-500 bg-orange-50/30" : "border-gray-100 bg-white"
                                            }`}
                                    >
                                        <span className="text-xs font-bold text-gray-800">
                                            {duration} Minutes
                                        </span>
                                        <AltArrowRight className={`w-4 h-4 transition-all ${activePicker === "duration" ? "text-orange-500 rotate-90" : "text-gray-400 group-hover:text-orange-500 rotate-90"}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Session Protocol</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-gray-200/70 rounded-xl">
                                    {["one_on_one", "team", "interview", "other"].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setMeetingType(type)}
                                            className={`h-8 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${meetingType === type
                                                ? "bg-gradient-to-r from-black/70 to-black/70 text-white  border border-gray-100"
                                                : "text-gray-500 hover:text-gray-700"
                                                }`}
                                        >
                                            {type.replace("_", " ")}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Participants */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg">
                                    <UsersGroupRounded className="w-5 h-5 text-amber-500" />
                                </div>
                                Invitees
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
                            {(internalParticipants.length > 0 || externalParticipants.length > 0) ? (
                                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 min-h-[60px]">
                                    {internalParticipants.map(u => (
                                        <div key={u._id} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm" title={u.full_name}>
                                            {u.profile_picture ? (
                                                <img src={u.profile_picture} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase">
                                                    {u.full_name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {externalParticipants.map((u, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm" title={u.name || u.email}>
                                            {u.name?.charAt(0) || "G"}
                                        </div>
                                    ))}
                                    <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                        {internalParticipants.length + externalParticipants.length} Participants Added
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-orange-200 transition-colors cursor-pointer" onClick={() => setActivePicker("participants")}>
                                    <UsersGroupRounded className="w-8 h-8 text-gray-300 group-hover:text-orange-300 transition-colors mb-2" />
                                    <p className="text-xs font-bold text-gray-400 group-hover:text-gray-500">No participants added yet</p>
                                    <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Click to manage invitees</p>
                                </div>
                            )}
                        </div>
                    </div>



                    {/* Preparation */}
                    <div className="space-y-4 pb-4">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <NotebookMinimalistic className="w-4 h-4 text-orange-500" />
                            Preparation Notes
                        </h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add briefing notes or specific preparation required for participants..."
                            rows={3}
                            className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-orange-500 transition-all outline-none text-sm font-medium text-gray-700 resize-none shadow-sm"
                        />
                    </div>
                </form>

                {/* Footer Buttons */}
                <div className="p-6 bg-white border-t border-gray-100 shrink-0 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.05)]">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-500 text-xs font-bold  hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex-[2] h-12 rounded-xl bg-black/80 text-white text-xs font-bold  flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Schedule Meeting
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div
                    className={`absolute top-1/2 -translate-y-1/2 right-[100%] mr-4 w-96 bg-white rounded-3xl shadow-2xl transition-all duration-300 transform border border-white/40 backdrop-blur-md ${activePicker ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"
                        }`}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xl font-bold text-gray-800 ">
                                {activePicker === "time" ? "Select Start Time" : activePicker === "duration" ? "Set Duration" : "Manage Invitees"}
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
                            </div>
                        )}

                        {activePicker === "duration" && (
                            <div className="grid grid-cols-2 gap-3">
                                {[15, 30, 45, 60, 90, 120, 180, 240].map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => {
                                            setDuration(m);
                                            setActivePicker(null);
                                        }}
                                        className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${duration === m
                                            ? "bg-gray-900 border-gray-900 text-white shadow-lg"
                                            : "bg-white border-gray-100 text-gray-600 hover:border-orange-500"
                                            }`}
                                    >
                                        {m} Min {m >= 60 && `(${m / 60}h)`}
                                    </button>
                                ))}
                            </div>
                        )}

                        {activePicker === "participants" && (
                            <div className="space-y-6">
                                {/* Internal Search */}
                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="relative">
                                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                disabled={meetingType === "one_on_one" && (internalParticipants.length + externalParticipants.length) >= 1}
                                                placeholder={meetingType === "one_on_one" && (internalParticipants.length + externalParticipants.length) >= 1
                                                    ? "Participant limit reached"
                                                    : "Search teammate..."}
                                                className={`w-full h-12 pl-11 pr-4 rounded-2xl transition-all outline-none text-sm font-bold bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/10 border border-transparent focus:border-orange-500 ${meetingType === "one_on_one" && (internalParticipants.length + externalParticipants.length) >= 1
                                                    ? "opacity-50 cursor-not-allowed text-gray-400"
                                                    : "text-gray-800"
                                                    }`}
                                            />
                                        </div>

                                        {searchQuery.trim() && filteredUsers.length > 0 && (
                                            <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="p-2 max-h-64 overflow-y-auto shadow-inner">
                                                    {filteredUsers.map((u: IUser) => (
                                                        <button
                                                            key={u.id || (u as any)._id}
                                                            type="button"
                                                            onClick={() => addInternalParticipant(u)}
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
                                </div>

                                {/* External Guest */}
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">External Guest</span>
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={newExternalName}
                                            onChange={(e) => setNewExternalName(e.target.value)}
                                            placeholder="Guest Name"
                                            className="w-full h-10 px-4 rounded-xl border border-gray-200 outline-none text-xs font-bold text-gray-800 focus:border-orange-500 bg-white"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="email"
                                                value={newExternalEmail}
                                                onChange={(e) => setNewExternalEmail(e.target.value)}
                                                placeholder="Guest Email"
                                                className="flex-1 h-10 px-4 rounded-xl border border-gray-200 outline-none text-xs font-bold text-gray-800 focus:border-orange-500 bg-white"
                                            />
                                            <button
                                                type="button"
                                                disabled={meetingType === "one_on_one" && (internalParticipants.length + externalParticipants.length) >= 1}
                                                onClick={addExternalParticipant}
                                                className="h-10 w-10 bg-orange-500 text-white rounded-xl hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:grayscale"
                                            >
                                                <AddCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Selected List */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-1 border-b border-gray-100 pb-2">
                                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected Invitees ({internalParticipants.length + externalParticipants.length})</h5>
                                    </div>
                                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                                        {internalParticipants.map(u => (
                                            <div key={u._id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 hover:border-orange-100 transition-all group">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-black shadow-sm uppercase overflow-hidden">
                                                    {u.profile_picture ? (
                                                        <img src={u.profile_picture} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        u.full_name.charAt(0)
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-800 truncate">{u.full_name}</p>
                                                    <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                                                </div>
                                                <button onClick={() => removeInternalParticipant(u._id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <MinusCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                        {externalParticipants.map((u, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-2xl border border-orange-100 group">
                                                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black shadow-sm uppercase">
                                                    {u.name?.charAt(0) || "G"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-orange-800 truncate">{u.name || "Guest"}</p>
                                                    <p className="text-[10px] text-orange-600/70 truncate">{u.email}</p>
                                                </div>
                                                <button onClick={() => removeExternalParticipant(i)} className="p-2 text-orange-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <MinusCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                        {internalParticipants.length === 0 && externalParticipants.length === 0 && (
                                            <div className="text-center py-8">
                                                <p className="text-xs font-bold text-gray-400">Search above to add people</p>
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

export default CreateMeetingDrawer;
