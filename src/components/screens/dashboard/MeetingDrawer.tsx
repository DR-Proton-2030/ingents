"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    getMeetingById,
    MeetingDetails,
    Participant,
} from "@/utils/api/meeting/meeting.api";
import {
    CloseCircle,
    Calendar,
    ClockCircle,
    Document,
    Notes,
    Link,
    Copy,
    User,
    UsersGroupRounded,
    NotebookSquare,
    NotebookMinimalistic,
} from "@solar-icons/react";
import { LinkCircle } from "@solar-icons/react/ssr";

// Avatar colors for participants
const avatarColors = [
    "bg-gradient-to-br from-indigo-500 to-purple-600",
    "bg-gradient-to-br from-emerald-500 to-teal-600",
    "bg-gradient-to-br from-orange-500 to-red-600",
    "bg-gradient-to-br from-cyan-500 to-blue-600",
    "bg-gradient-to-br from-pink-500 to-rose-600",
    "bg-gradient-to-br from-amber-500 to-yellow-600",
];

interface MeetingDrawerProps {
    meetingId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

// Helper to format date/time
const formatDateTime = (dateString: string, timezone: string) => {
    const date = new Date(dateString);
    return {
        date: date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: timezone,
        }),
        time: date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: timezone,
        }),
    };
};

// Get initials from name or email
const getInitial = (name: string | null, email: string | null): string => {
    if (name && name.trim()) {
        return name.trim().charAt(0).toUpperCase();
    }
    if (email && email.trim()) {
        return email.trim().charAt(0).toUpperCase();
    }
    return "?";
};

// Get display name
const getDisplayName = (participant: Participant): string => {
    return (
        participant.user_details?.full_name ||
        participant.external_name ||
        participant.user_details?.email ||
        participant.external_email ||
        "Unknown"
    );
};

// Get status color
const getStatusColor = (status: string) => {
    switch (status) {
        case "accepted":
            return "bg-green-100 text-green-700";
        case "declined":
            return "bg-red-100 text-red-700";
        case "pending":
        default:
            return "bg-yellow-100 text-yellow-700";
    }
};

// Get meeting type badge
const getMeetingTypeBadge = (type: string) => {
    switch (type) {
        case "team":
            return "bg-blue-100 text-blue-700";
        case "one_on_one":
            return "bg-purple-100 text-purple-700";
        case "external":
            return "bg-orange-100 text-orange-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

export const MeetingDrawer: React.FC<MeetingDrawerProps> = ({
    meetingId,
    isOpen,
    onClose,
}) => {
    const [meeting, setMeeting] = useState<MeetingDetails | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && meetingId) {
            const fetchMeeting = async () => {
                try {
                    setIsLoading(true);
                    setError(null);
                    const response = await getMeetingById(meetingId);
                    setMeeting(response.data.meeting);
                    setParticipants(response.data.participants);
                } catch (err) {
                    console.error("Failed to fetch meeting:", err);
                    setError("Failed to load meeting details");
                } finally {
                    setIsLoading(false);
                }
            };

            fetchMeeting();
        }
    }, [isOpen, meetingId]);

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

    const startTime = meeting
        ? formatDateTime(meeting.scheduled_start_time, meeting.timezone)
        : null;
    const endTime = meeting
        ? formatDateTime(meeting.scheduled_end_time, meeting.timezone)
        : null;

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
                className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Meeting Details</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <CloseCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="h-[calc(100%-64px)] overflow-y-auto px-5 py-4">
                    {isLoading && (
                        <div className="flex items-center justify-center h-48">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm text-gray-500">Loading...</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center justify-center h-48">
                            <span className="text-sm text-red-500">{error}</span>
                        </div>
                    )}

                    {meeting && !isLoading && (
                        <div className="space-y-6">
                            {/* Title & Status */}
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {meeting.title}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${meeting.status === "scheduled"
                                            ? "bg-green-100 text-green-700"
                                            : meeting.status === "cancelled"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {meeting.status}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {/* <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getMeetingTypeBadge(
                                            meeting.meeting_type
                                        )}`}
                                    >
                                        {meeting.meeting_type.replace("_", " ")}
                                    </span> */}
                                    {meeting.is_recurring && (
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                                            Recurring
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-200 rounded-lg">
                                        <Calendar className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {startTime?.date}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {startTime?.time} - {endTime?.time} ({meeting.timezone})
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-200 rounded-lg">
                                        <ClockCircle className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            Duration: {meeting.duration_minutes} minutes
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Reminder: {meeting.reminder_minutes_before} min before
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {meeting.description && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Document className="w-4 h-4" />
                                        Description
                                    </h4>
                                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                                        {meeting.description}
                                    </p>
                                </div>
                            )}

                            {/* Notes */}
                            {meeting.notes && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <NotebookMinimalistic className="w-4 h-4" />
                                        Notes
                                    </h4>
                                    <p className="text-sm text-gray-600 bg-amber-50 rounded-lg p-3 border border-amber-100">
                                        {meeting.notes}
                                    </p>
                                </div>
                            )}

                            {/* Meeting Link */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <LinkCircle className="w-4 h-4" />
                                    Meeting Link
                                </h4>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={meeting.meeting_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-gradient-to-r from-black/70 to-black/80 text-white text-sm font-medium py-2.5 px-4
                                         rounded-lg hover:from-black/80 hover:to-black/90 transition-all shadow-md hover:shadow-lg text-center"
                                    >
                                        Join Meeting
                                    </a>
                                    <button
                                        onClick={() =>
                                            navigator.clipboard.writeText(meeting.meeting_link)
                                        }
                                        className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                        title="Copy link"
                                    >
                                        <Copy className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Meeting Code: <span className="font-mono font-medium">{meeting.meeting_code}</span>
                                </p>
                            </div>

                            {/* Host */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Host
                                </h4>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div
                                        className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${avatarColors[0]}`}
                                    >
                                        {getInitial(meeting.host_details.full_name, meeting.host_details.email)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {meeting.host_details.full_name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {meeting.host_details.email}
                                        </p>
                                    </div>
                                    <span className="ml-auto px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                        Host
                                    </span>
                                </div>
                            </div>

                            {/* Participants */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <UsersGroupRounded className="w-4 h-4" />
                                    Participants ({participants.length})
                                </h4>
                                <div className="space-y-2">
                                    {participants.map((participant, index) => (
                                        <div
                                            key={participant._id}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div
                                                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${avatarColors[(index + 1) % avatarColors.length]
                                                    }`}
                                            >
                                                {getInitial(
                                                    participant.user_details?.full_name || participant.external_name,
                                                    participant.user_details?.email || participant.external_email
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">
                                                    {getDisplayName(participant)}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {participant.user_details?.email ||
                                                        participant.external_email}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                                                    participant.response_status
                                                )}`}
                                            >
                                                {participant.response_status}
                                            </span>
                                        </div>
                                    ))}
                                    {participants.length === 0 && (
                                        <p className="text-sm text-gray-500 text-center py-4">
                                            No participants added yet
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MeetingDrawer;
