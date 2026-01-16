"use client";
import React from "react";
import { Meeting, Participant } from "@/utils/api/meeting/meeting.api";
import ParticipantAvatar from "./ParticipantAvatar";

interface EventCardProps {
    event: Meeting;
    isDark: boolean;
    onClick: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isDark, onClick }) => {
    // Convert host to participant format for avatar
    const hostAsParticipant: Participant | null = event.host_details
        ? {
            _id: event.host_details._id,
            meeting_object_id: event._id,
            user_object_id: event.host_details._id,
            external_email: null,
            external_name: null,
            response_status: "accepted",
            is_optional: false,
            user_details: event.host_details,
        }
        : null;

    return (
        <div
            onClick={onClick}
            className={`rounded-xl p-2 h-full flex flex-row justify-between item-end cursor-pointer transition-all hover:scale-[1.02] ${isDark
                ? "bg-gray-800 text-white shadow-lg shadow-black/30"
                : "bg-white border border-gray-100 shadow-lg"
                }`}
            title={event.title}
        >
            <div className="pt-1 flex-1 min-h-0">
                <h4
                    className={`text-[10px] font-semibold leading-tight truncate ${isDark ? "text-white" : "text-gray-800"
                        }`}
                >
                    {event.title}
                </h4>
                <p
                    className={`text-[7px] mt-0.5 leading-tight truncate ${isDark ? "text-gray-300" : "text-gray-500"
                        }`}
                >
                    View more
                </p>
            </div>

            <div className="flex -space-x-1 mt-1 items-end">
                {/* Host avatar */}
                {hostAsParticipant && (
                    <ParticipantAvatar
                        key="host"
                        participant={hostAsParticipant}
                        index={0}
                        isDark={isDark}
                    />
                )}
                {/* Participant avatars (limit to 3) */}
                {event.participants.slice(0, 2).map((participant, i) => (
                    <ParticipantAvatar
                        key={participant._id}
                        participant={participant}
                        index={i + 1}
                        isDark={isDark}
                    />
                ))}
                {/* +N indicator */}
                {event.participants.length > 3 && (
                    <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center text-[8px] font-semibold border-2 ${isDark
                            ? "bg-gray-700 text-gray-300 border-gray-800"
                            : "bg-gray-100 text-gray-600 border-white"
                            }`}
                    >
                        +{event.participants.length - 3}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;
