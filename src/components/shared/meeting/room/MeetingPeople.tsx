"use client";
import React from "react";
import { UserPlus, Search, ChevronUp, MicOff, MoreVertical } from "lucide-react";
import { ParticipantState } from "./types";
import { MeetingDetails } from "@/utils/api/meeting/meeting.api";

interface MeetingPeopleProps {
    participants: ParticipantState[];
    meetingInfo: MeetingDetails | null;
    isMuted: boolean;
}

const avatarColors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-cyan-500",
];

const MeetingPeople: React.FC<MeetingPeopleProps> = ({
    participants,
    meetingInfo,
    isMuted,
}) => {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 space-y-4">
                <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium">
                    <UserPlus className="w-5 h-5" />
                    Add People
                </button>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for people"
                        className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4">
                <div className="border border-gray-200 rounded-lg">
                    <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                        <span className="font-medium text-gray-900">Contributors</span>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">{participants.length}</span>
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                        </div>
                    </button>
                    <div className="border-t border-gray-100 pb-2">
                        {participants.map((participant, index) => {
                            const isHost = meetingInfo?.host_user_object_id === participant.id || (participant.isLocal && meetingInfo?.host_details?._id === "local");
                            return (
                                <div key={participant.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                                    <div className={`w-9 h-9 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-medium text-sm flex-shrink-0`}>
                                        {participant.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-900 truncate font-medium">
                                                {participant.fullName}{participant.isLocal && " (You)"}
                                            </span>
                                            {isHost && (
                                                <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Host</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {(participant.isLocal ? isMuted : participant.isMuted) && <MicOff className="w-4 h-4 text-gray-400" />}
                                        <button className="p-1 hover:bg-gray-100 rounded-full">
                                            <MoreVertical className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingPeople;
