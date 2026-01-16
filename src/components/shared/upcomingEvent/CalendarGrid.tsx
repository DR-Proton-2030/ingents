"use client";
import React from "react";
import { Meeting } from "@/utils/api/meeting/meeting.api";
import { WeekInfo } from "./types";
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
    // Generate dynamic time slots based on meeting range
    const { dynamicTimeSlots, minHour } = React.useMemo(() => {
        if (meetings.length === 0) {
            // Default range if no meetings: 9 AM to 6 PM
            const defaultStart = 9;
            const defaultEnd = 18;
            const slots = [];
            for (let h = defaultStart; h <= defaultEnd; h++) {
                const hour = h % 24;
                const ampm = hour >= 12 ? "pm" : "am";
                const displayHour = hour % 12 || 12;
                slots.push(`${displayHour} ${ampm}`);
            }
            return { dynamicTimeSlots: slots, minHour: defaultStart };
        }

        let firstHour = 24;
        let lastHour = 0;

        meetings.forEach((m) => {
            const start = new Date(m.scheduled_start_time).getHours();
            const duration = Math.ceil(m.duration_minutes / 60);
            const end = start + duration;

            if (start < firstHour) firstHour = start;
            if (end > lastHour) lastHour = end;
        });

        // Add 1 hour padding if possible
        const startHour = Math.max(0, firstHour - 1);
        const endHour = Math.min(24, lastHour + 1);

        const slots = [];
        for (let h = startHour; h < endHour; h++) {
            const hour = h % 24;
            const ampm = hour >= 12 ? "pm" : "am";
            const displayHour = hour % 12 || 12;
            slots.push(`${displayHour} ${ampm}`);
        }

        return { dynamicTimeSlots: slots, minHour: startHour };
    }, [meetings]);

    // Get meeting and its span for a specific slot
    const getEventInfoForSlot = (dayIndex: number, timeSlotIndex: number) => {
        const slotHour = minHour + timeSlotIndex;
        const targetDate = weekInfo.days[dayIndex]?.fullDate;

        if (!targetDate) return null;

        const meeting = meetings.find((meeting) => {
            const startTime = new Date(meeting.scheduled_start_time);
            const meetingHour = startTime.getHours();
            const meetingDate = startTime.toDateString();
            const targetDateString = targetDate.toDateString();

            return meetingHour === slotHour && meetingDate === targetDateString;
        });

        if (!meeting) return null;

        // Calculate duration in hours for colSpan using duration_minutes
        const colSpan = Math.max(1, Math.ceil(meeting.duration_minutes / 60));

        return { meeting, colSpan };
    };

    // Determine if a time slot has any meetings across all days (including spanned hours)
    const columnsWithMeetings = dynamicTimeSlots.map((_, timeIdx) => {
        const slotHour = minHour + timeIdx;
        return weekInfo.days.some((day) => {
            const targetDateString = day.fullDate.toDateString();
            return meetings.some((meeting) => {
                const startTime = new Date(meeting.scheduled_start_time);
                const meetingDate = startTime.toDateString();

                if (meetingDate !== targetDateString) return false;

                const startHour = startTime.getHours();
                const endHour = startHour + Math.ceil(meeting.duration_minutes / 60);

                return slotHour >= startHour && slotHour < endHour;
            });
        });
    });

    // Alternate dark/light styling for events
    let eventIndex = 0;
    const getEventStyle = () => eventIndex++ % 2 === 0;

    return (
        <div className="max-h-[300px] overflow-auto hidescroll scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
            <table className="w-full border-collapse table-fixed min-w-max">
                <thead>
                    <tr>
                        <th className="w-20 p-1 sticky left-0 z-10 bg-[#FAF9F6] border-b border-orange-200/80"></th>
                        {dynamicTimeSlots.map((time, idx) => (
                            <th
                                key={idx}
                                className={`p-1 text-center border-b border-orange-200/80 transition-all duration-300 ${columnsWithMeetings[idx] ? "w-[150px]" : "w-[40px]"
                                    }`}
                            >
                                <span className={`text-[10px] font-medium text-gray-400 whitespace-nowrap ${!columnsWithMeetings[idx] && "opacity-60"}`}>
                                    {time}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {weekInfo.days.map((day, dayIdx) => {
                        let slotsToSkip = 0;
                        return (
                            <tr key={dayIdx} className="border-t border-dashed border-orange-200/80">
                                <td className="w-20 p-2 align-middle sticky left-0 z-10 bg-[#FAF9F6] border-r border-orange-200/80">
                                    <div className="text-[10px] font-medium text-gray-400">{day.name}</div>
                                    <div
                                        className={`text-sm font-semibold flex items-center justify-center ${day.isToday
                                            ? "text-white bg-orange-500 rounded-full w-7 h-7 mx-auto"
                                            : "text-gray-700"
                                            }`}
                                    >
                                        {day.date}
                                    </div>
                                </td>
                                {dynamicTimeSlots.map((_, timeIdx) => {
                                    if (slotsToSkip > 0) {
                                        slotsToSkip--;
                                        return null;
                                    }

                                    const eventInfo = getEventInfoForSlot(dayIdx, timeIdx);
                                    if (eventInfo) {
                                        slotsToSkip = eventInfo.colSpan - 1;
                                        const isDark = getEventStyle();
                                        return (
                                            <td
                                                key={timeIdx}
                                                colSpan={eventInfo.colSpan}
                                                className={`p-1 align-top border-l border-dashed border-orange-200/80 h-16 transition-all duration-300`}
                                            >
                                                <div className="h-full w-full">
                                                    <EventCard
                                                        event={eventInfo.meeting}
                                                        isDark={isDark}
                                                        onClick={() => onMeetingClick(eventInfo.meeting._id)}
                                                    />
                                                </div>
                                            </td>
                                        );
                                    }

                                    return (
                                        <td
                                            key={timeIdx}
                                            className={`p-1 align-top border-l border-dashed border-orange-200/80 h-16 transition-all duration-300 ${columnsWithMeetings[timeIdx] ? "w-[140px]" : "w-[40px]"
                                                }`}
                                        />
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CalendarGrid;
