"use client";
import React from "react";
import { Meeting } from "@/utils/api/meeting/meeting.api";
import { WeekInfo, TIME_SLOTS } from "./types";
import EventCard from "./EventCard";

interface CalendarGridProps {
    weekInfo: WeekInfo;
    meetings: Meeting[];
    onMeetingClick: (meetingId: string) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
    weekInfo,
    meetings,
    onMeetingClick,
}) => {
    // Get meeting for a specific slot
    const getEventForSlot = (timeSlotIndex: number, dayIndex: number) => {
        const slotHour = 8 + timeSlotIndex; // Starting from 8am
        const targetDate = weekInfo.days[dayIndex]?.fullDate;

        if (!targetDate) return null;

        return meetings.find((meeting) => {
            const startTime = new Date(meeting.scheduled_start_time);
            const meetingHour = startTime.getUTCHours();
            const meetingDate = startTime.toDateString();
            const targetDateString = targetDate.toDateString();

            return meetingHour === slotHour && meetingDate === targetDateString;
        });
    };

    // Alternate dark/light styling for events
    let eventIndex = 0;
    const getEventStyle = () => eventIndex++ % 2 === 0;

    return (
        <div className="max-h-[300px] overflow-auto hidescroll scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
            <table className="w-full border-collapse">
                {/* Days Header */}
                <thead>
                    <tr>
                        <th className="w-14 p-1"></th>
                        {weekInfo.days.map((day, idx) => (
                            <th key={idx} className="p-1 text-center">
                                <div className="text-[10px] font-medium text-gray-400">{day.name}</div>
                                <div
                                    className={`text-sm font-semibold ${day.isToday
                                            ? "text-white bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center mx-auto"
                                            : "text-gray-700"
                                        }`}
                                >
                                    {day.date}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Time Rows */}
                <tbody>
                    {TIME_SLOTS.map((time, timeIdx) => (
                        <tr key={timeIdx} className="border-t border-dashed border-orange-200/80">
                            <td className="w-14 p-1 align-top">
                                <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">
                                    {time}
                                </span>
                            </td>
                            {weekInfo.days.map((_, dayIdx) => {
                                const event = getEventForSlot(timeIdx, dayIdx);
                                const isDark = event ? getEventStyle() : false;
                                return (
                                    <td
                                        key={dayIdx}
                                        className="p-0.5 align-top border-l border-dashed border-orange-200/80 h-14"
                                    >
                                        {event && (
                                            <EventCard
                                                event={event}
                                                isDark={isDark}
                                                onClick={() => onMeetingClick(event._id)}
                                            />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CalendarGrid;
