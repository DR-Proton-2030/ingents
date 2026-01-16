"use client";
import React, { useState } from "react";
import { Participant } from "@/utils/api/meeting/meeting.api";
import { avatarColors, getInitial, getDisplayName } from "./types";

interface ParticipantAvatarProps {
    participant: Participant;
    index: number;
    isDark: boolean;
}

export const ParticipantAvatar: React.FC<ParticipantAvatarProps> = ({
    participant,
    index,
    isDark,
}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const colorClass = avatarColors[index % avatarColors.length];
    const initial = getInitial(
        participant.user_details?.email || participant.external_email,
        participant.user_details?.full_name || participant.external_name
    );
    const displayName = getDisplayName(participant);

    return (
        <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shadow-sm cursor-pointer transition-transform hover:scale-110 ${colorClass} border-2 ${isDark ? "border-gray-800" : "border-white"
                    }`}
            >
                {initial}
            </div>
            {showTooltip && (
                <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded-md whitespace-nowrap shadow-lg">
                    {displayName}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
            )}
        </div>
    );
};

export default ParticipantAvatar;
