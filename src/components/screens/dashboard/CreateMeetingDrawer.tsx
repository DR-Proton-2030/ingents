"use client";
import React, { useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";
import {
    createMeeting,
    CreateMeetingPayload
} from "@/utils/api/meeting/meeting.api";
import { searchUsers, UserOption } from "@/utils/api/user/user.api";
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
    AltArrowRight
} from "@solar-icons/react";
import AuthContext from "@/contexts/authContext/authContext";
import { toast } from "react-toastify";

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

    // Participants State
    const [internalParticipants, setInternalParticipants] = useState<UserOption[]>([]);
    const [externalParticipants, setExternalParticipants] = useState<{ email: string; name: string }[]>([]);
    const [newExternalEmail, setNewExternalEmail] = useState("");
    const [newExternalName, setNewExternalName] = useState("");

    // User Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UserOption[]>([]);
    const [isSearching, setIsSearching] = useState(false);

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

    // User Search Debounce
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await searchUsers({ q: searchQuery });
                setSearchResults(res.data || res);
            } catch (err) {
                console.error("User search failed:", err);
            } finally {
                setIsSearching(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery]);

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

    const addInternalParticipant = (u: UserOption) => {
        if (internalParticipants.find(p => p._id === u._id)) return;
        setInternalParticipants([...internalParticipants, u]);
        setSearchQuery("");
    };

    const removeInternalParticipant = (id: string) => {
        setInternalParticipants(internalParticipants.filter(p => p._id !== id));
    };

    const addExternalParticipant = () => {
        if (!newExternalEmail.trim()) return;
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
            {/* Backdrop with sophisticated blur */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />


            {/* Side Panel */}
            <div
                className={`absolute top-0 right-0 h-full w-full max-w-lg bg-[#F8F9FB] shadow-[-20px_0_50px_-15px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Schedule Meeting</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <CloseCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Form Content: Structured in Logical Cards */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scrollbar-hide">

                    {/* Card 1: Primary Details */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)] space-y-5">


                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-wider">Discussion Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Strategic Product Alignment"
                                    className="w-full h-11 px-4 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none text-sm font-medium text-slate-800 placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-wider">Context & Objectives</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Define the scope of this session..."
                                    rows={3}
                                    className="w-full p-4 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none text-sm font-medium text-slate-800 resize-none placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Schedule & Type */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)] space-y-5">


                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-wider">Commencement</label>
                                <input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-orange-500 transition-all outline-none text-sm font-medium text-slate-800"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-wider">Duration Slot</label>
                                <div className="relative">
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        className="w-full h-11 px-4 pr-10 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-orange-500 transition-all outline-none text-sm font-medium text-slate-800 appearance-none"
                                    >
                                        <option value={15}>15 Minutes</option>
                                        <option value={30}>30 Minutes</option>
                                        <option value={45}>45 Minutes</option>
                                        <option value={60}>1 Hour</option>
                                        <option value={90}>1.5 Hours</option>
                                        <option value={120}>2 Hours</option>
                                    </select>
                                    <AltArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-wider">Session Format</label>
                            <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                                {["one_on_one", "team", "interview", "other"].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setMeetingType(type)}
                                        className={`flex-1 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${meetingType === type
                                            ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                                            : "text-slate-400 hover:text-slate-600"
                                            }`}
                                    >
                                        {type.replace("_", " ")}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Stakeholders */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)] space-y-5">

                        {/* Search Internal */}
                        <div className="relative">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search teammates by name or email..."
                                    className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-orange-500 transition-all outline-none text-sm font-medium text-slate-800 placeholder:text-slate-400"
                                />
                                {isSearching && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                )}
                            </div>

                            {/* Refined Results Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="p-2">
                                        {searchResults.map((u) => (
                                            <button
                                                key={u._id}
                                                type="button"
                                                onClick={() => addInternalParticipant(u)}
                                                className="w-full p-3 flex items-center gap-3 hover:bg-slate-50 rounded-xl transition-all group"
                                            >
                                                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold border border-white shadow-sm ring-1 ring-slate-100">
                                                    {u.full_name.charAt(0)}
                                                </div>
                                                <div className="text-left flex-1">
                                                    <p className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{u.full_name}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">{u.email}</p>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <AddCircle className="w-5 h-5 text-orange-500" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Guest Area */}
                        <div className="bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200 space-y-3">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">External Stakeholder</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newExternalName}
                                    onChange={(e) => setNewExternalName(e.target.value)}
                                    placeholder="Guest Name"
                                    className="h-10 px-3 rounded-lg bg-white border border-slate-200 focus:border-orange-500 outline-none text-sm font-medium text-slate-800 flex-1 shadow-sm placeholder:text-slate-300"
                                />
                                <input
                                    type="email"
                                    value={newExternalEmail}
                                    onChange={(e) => setNewExternalEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    className="h-10 px-3 rounded-lg bg-white border border-slate-200 focus:border-orange-500 outline-none text-sm font-medium text-slate-800 flex-2 shadow-sm placeholder:text-slate-300"
                                />
                                <button
                                    type="button"
                                    onClick={addExternalParticipant}
                                    className="h-10 w-10 shrink-0 bg-slate-900 text-white rounded-lg hover:bg-orange-500 active:scale-90 transition-all flex items-center justify-center shadow-lg shadow-slate-900/10"
                                >
                                    <AddCircle className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Selected chips List */}
                        {(internalParticipants.length > 0 || externalParticipants.length > 0) && (
                            <div className="space-y-3 pt-2">
                                <div className="flex flex-wrap gap-2">
                                    {internalParticipants.map(u => (
                                        <div key={u._id} className="group flex items-center gap-2 pl-1 pr-2 py-1 bg-white border border-slate-200 rounded-full shadow-sm hover:border-orange-200 transition-all animate-in zoom-in-95 duration-200">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 flex items-center justify-center border border-slate-50">
                                                {u.full_name.charAt(0)}
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-700">{u.full_name}</span>
                                            <button onClick={() => removeInternalParticipant(u._id)} className="w-4 h-4 flex items-center justify-center rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
                                                <MinusCircle className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    {externalParticipants.map((u, i) => (
                                        <div key={i} className="group flex items-center gap-2 pl-1 pr-2 py-1 bg-orange-50 border border-orange-100 rounded-full shadow-sm hover:border-orange-300 transition-all animate-in zoom-in-95 duration-200">
                                            <div className="w-6 h-6 rounded-full bg-orange-500 text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                                                {u.name.charAt(0) || "G"}
                                            </div>
                                            <span className="text-[11px] font-bold text-orange-700">{u.name || "Guest"}</span>
                                            <button onClick={() => removeExternalParticipant(i)} className="w-4 h-4 flex items-center justify-center rounded-full text-orange-300 hover:text-red-500 hover:bg-red-50 transition-all">
                                                <MinusCircle className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Card 4: Preparation */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)] space-y-5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                            <Notes className="w-3.5 h-3.5 text-orange-500" />
                            Briefing Notes
                        </div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Type any specific preparation required for participants..."
                            rows={3}
                            className="w-full p-4 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none text-sm font-medium text-slate-800 placeholder:text-slate-400 resize-none shadow-inner"
                        />
                    </div>
                </form>

                {/* Footer: Prominent Actions */}
                <div className="p-8 bg-white border-t border-slate-100 shrink-0">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl border border-slate-200 text-slate-500 text-xs font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex-[2] h-12 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-orange-500 transition-all active:scale-95 shadow-xl shadow-slate-900/10 hover:shadow-orange-500/30 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Letter className="w-4 h-4 fill-current" />
                                    Orchestrate Session
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CreateMeetingDrawer;
