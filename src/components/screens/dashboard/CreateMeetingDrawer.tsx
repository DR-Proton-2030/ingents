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
                                    <input
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-orange-500 outline-none text-xs font-bold text-gray-800 bg-white "
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Duration</label>
                                    <div className="relative">
                                        <select
                                            value={duration}
                                            onChange={(e) => setDuration(Number(e.target.value))}
                                            className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-200 focus:border-orange-500 outline-none text-xs font-bold text-gray-800 bg-white appearance-none cursor-pointer"
                                        >
                                            {[15, 30, 45, 60, 90, 120, 180, 240].map(m => (
                                                <option key={m} value={m}>{m} Minutes {m >= 60 && `(${m / 60}h)`}</option>
                                            ))}
                                        </select>
                                        <AltArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
                                    </div>
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
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg">
                                <UsersGroupRounded className="w-5 h-5 text-amber-500" />
                            </div>

                            Invitees
                        </h3>
                        <div className="space-y-5">
                            {/* Internal Search */}
                            <div className="relative">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Internal Teammates</label>
                                <div className="relative">
                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        disabled={meetingType === "one_on_one" && (internalParticipants.length + externalParticipants.length) >= 1}
                                        placeholder={meetingType === "one_on_one" && (internalParticipants.length + externalParticipants.length) >= 1
                                            ? "Participant limit reached"
                                            : "Search by name or corporate email..."}
                                        className={`w-full h-11 pl-11 pr-4 rounded-xl transition-all outline-none text-sm font-medium bg-gray-100 ${meetingType === "one_on_one" && (internalParticipants.length + externalParticipants.length) >= 1
                                            ? "opacity-50 cursor-not-allowed text-gray-400"
                                            : "text-gray-800"
                                            }`}
                                    />
                                </div>

                                {searchQuery.trim() && filteredUsers.length > 0 && (
                                    <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="p-2 max-h-64 overflow-y-auto">
                                            {filteredUsers.map((u: IUser) => (
                                                <button
                                                    key={u.id || (u as any)._id}
                                                    type="button"
                                                    onClick={() => addInternalParticipant(u)}
                                                    className="w-full p-2.5 flex items-center gap-3 hover:bg-gray-50 rounded-lg transition-all group"
                                                >
                                                    <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold border border-white shadow-sm ring-1 ring-gray-100 uppercase overflow-hidden">
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

                            {/* External */}
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">External Guest</label>
                                <div className="grid grid-cols-[1fr_1.5fr_auto] gap-2">
                                    <input
                                        type="text"
                                        value={newExternalName}
                                        onChange={(e) => setNewExternalName(e.target.value)}
                                        placeholder="Full Name"
                                        className="h-10 px-3 rounded-lg border border-gray-200 focus:border-orange-500 outline-none text-xs font-medium bg-white"
                                    />
                                    <input
                                        type="email"
                                        value={newExternalEmail}
                                        onChange={(e) => setNewExternalEmail(e.target.value)}
                                        placeholder="Email address"
                                        className="h-10 px-3 rounded-lg border border-gray-200 focus:border-orange-500 outline-none text-xs font-medium bg-white"
                                    />
                                    <button
                                        type="button"
                                        disabled={meetingType === "one_on_one" && (internalParticipants.length + externalParticipants.length) >= 1}
                                        onClick={addExternalParticipant}
                                        className="h-10 w-10 bg-orange-500 text-white rounded-lg hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                                    >
                                        <AddCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Selected Chips */}
                            {(internalParticipants.length > 0 || externalParticipants.length > 0) && (
                                <div className="space-y-3 pt-1">
                                    <div className="flex flex-col gap-2">
                                        {internalParticipants.map(u => (
                                            <div key={u._id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-black shadow-sm uppercase overflow-hidden">
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
                                                <button onClick={() => removeInternalParticipant(u._id)} className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                                                    <MinusCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                        {externalParticipants.map((u, i) => (
                                            <div key={i} className="flex items-center gap-3 p-2.5 bg-orange-50 rounded-xl border border-orange-100 animate-in zoom-in-95 duration-200">
                                                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black shadow-sm uppercase">
                                                    {u.name.charAt(0) || "G"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-orange-800 truncate">{u.name || "Guest"}</p>
                                                    <p className="text-[10px] text-orange-600/70 truncate">{u.email}</p>
                                                </div>
                                                <button onClick={() => removeExternalParticipant(i)} className="p-1 text-orange-300 hover:text-red-500 transition-colors">
                                                    <MinusCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
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
            </div>
        </div>,
        document.body
    );
};

export default CreateMeetingDrawer;
