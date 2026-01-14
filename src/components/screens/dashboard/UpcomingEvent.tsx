"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  getMeetings,
  Meeting,
  Participant,
} from "@/utils/api/meeting/meeting.api";

// Avatar colors for participants
const avatarColors = [
  "bg-gradient-to-br from-indigo-500 to-purple-600",
  "bg-gradient-to-br from-emerald-500 to-teal-600",
  "bg-gradient-to-br from-orange-500 to-red-600",
  "bg-gradient-to-br from-cyan-500 to-blue-600",
  "bg-gradient-to-br from-pink-500 to-rose-600",
  "bg-gradient-to-br from-amber-500 to-yellow-600",
];

// Helper to get initials from email or name
const getInitial = (email: string | null, name: string | null): string => {
  if (name && name.trim()) {
    return name.trim().charAt(0).toUpperCase();
  }
  if (email && email.trim()) {
    return email.trim().charAt(0).toUpperCase();
  }
  return "?";
};

// Helper to get display name for tooltip
const getDisplayName = (participant: Participant): string => {
  if (participant.user_details?.full_name) {
    return participant.user_details.full_name;
  }
  if (participant.external_name) {
    return participant.external_name;
  }
  if (participant.user_details?.email) {
    return participant.user_details.email;
  }
  if (participant.external_email) {
    return participant.external_email;
  }
  return "Unknown";
};

// Avatar component with tooltip
const ParticipantAvatar = ({
  participant,
  index,
  isDark,
}: {
  participant: Participant;
  index: number;
  isDark: boolean;
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
        className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shadow-sm cursor-pointer transition-transform hover:scale-110 ${colorClass} border-2 ${isDark ? "border-gray-800" : "border-white"}`}
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

export const UpcomingEvent = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = prev week, 1 = next week

  // Get week dates based on offset
  const weekInfo = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() + diff);

    // Apply week offset
    const startOfWeek = new Date(startOfCurrentWeek);
    startOfWeek.setDate(startOfCurrentWeek.getDate() + (weekOffset * 7));

    const days = [];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push({
        name: dayNames[i],
        date: date.getDate(),
        fullDate: date,
        isToday: date.toDateString() === now.toDateString(),
      });
    }

    const monthName = startOfWeek.toLocaleString("default", { month: "long" });
    const year = startOfWeek.getFullYear();

    // Calculate end of week for display
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const endMonthName = endOfWeek.toLocaleString("default", { month: "long" });
    const endYear = endOfWeek.getFullYear();

    // Format date range for API
    const formatDate = (date: Date): string => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    return {
      days,
      monthName,
      year,
      endMonthName,
      endYear,
      fromDate: formatDate(startOfWeek),
      toDate: formatDate(endOfWeek),
      isCurrentWeek: weekOffset === 0,
    };
  }, [weekOffset]);

  // Time slots (compact view with 4 slots)
  const timeSlots = useMemo(() => [
    "8:00 am",
    "9:00 am",
    "10:00 am",
    "11:00 am",
    "12:00 pm",
    "1:00 pm",
    "2:00 pm",
    "3:00 pm",
    "4:00 pm",
    "5:00 pm",
    "6:00 pm",
    "7:00 pm",
    "8:00 pm",
    "9:00 pm",
    "10:00 pm",
    "11:00 pm",
    "12:00 am",
  ], []);

  // Fetch meetings when week changes
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getMeetings(weekInfo.fromDate, weekInfo.toDate, 1, 50);
        setMeetings(response.data || []);
      } catch (err) {
        console.error("Failed to fetch meetings:", err);
        setError("Failed to load meetings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [weekInfo.fromDate, weekInfo.toDate]);

  // Navigation handlers
  const goToPreviousWeek = () => setWeekOffset((prev) => prev - 1);
  const goToNextWeek = () => setWeekOffset((prev) => prev + 1);
  const goToCurrentWeek = () => setWeekOffset(0);

  // Get meeting for a specific slot
  const getEventForSlot = (timeSlotIndex: number, dayIndex: number) => {
    const slotHour = 8 + timeSlotIndex; // Starting from 8am
    const targetDate = weekInfo.days[dayIndex]?.fullDate;

    if (!targetDate) return null;

    return meetings.find((meeting) => {
      const startTime = new Date(meeting.scheduled_start_time);
      const meetingHour = startTime.getUTCHours(); // Use UTC to match the API times
      const meetingDate = startTime.toDateString();
      const targetDateString = targetDate.toDateString();

      return meetingHour === slotHour && meetingDate === targetDateString;
    });
  };

  // Alternate dark/light styling for events
  const getEventStyle = (index: number) => {
    return index % 2 === 0;
  };

  if (isLoading) {
    return (
      <div className="rounded-[18px] bg-white/30 backdrop-blur-[10px] shadow-[1px_1px_10px_4px_rgba(0,0,0,0.04)] p-4">
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Loading meetings...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[18px] bg-white/30 backdrop-blur-[10px] shadow-[1px_1px_10px_4px_rgba(0,0,0,0.04)] p-4">
        <div className="flex items-center justify-center h-48">
          <span className="text-sm text-red-500">{error}</span>
        </div>
      </div>
    );
  }

  let eventIndex = 0;

  return (
    <div className="rounded-[18px] bg-white/30 backdrop-blur-[10px] shadow-[1px_1px_10px_4px_rgba(0,0,0,0.04)] p-4 overflow-hidden">
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousWeek}
          className="rounded-full shadow bg-white px-3 py-1.5 text-xs font-medium text-black/80 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Prev Week
        </button>
        <div className="text-center">
          <h2 className="text-base font-semibold text-gray-800">
            {weekInfo.monthName === weekInfo.endMonthName
              ? `${weekInfo.monthName} ${weekInfo.year}`
              : `${weekInfo.monthName} - ${weekInfo.endMonthName} ${weekInfo.year}`
            }
          </h2>
          {!weekInfo.isCurrentWeek && (
            <button
              onClick={goToCurrentWeek}
              className="text-[10px] text-orange-500 hover:text-orange-600 font-medium"
            >
              Go to current week
            </button>
          )}
        </div>
        <button
          onClick={goToNextWeek}
          className="rounded-full shadow bg-white px-3 py-1.5 text-xs font-medium text-black/80 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-1"
        >
          Next Week
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Table */}
      <div className="max-h-[300px] overflow-auto hidescroll scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
        <table className="w-full border-collapse">
          {/* Days Header */}
          <thead>
            <tr>
              <th className="w-14 p-1"></th>
              {weekInfo.days.map((day, idx) => (
                <th key={idx} className="p-1 text-center">
                  <div className="text-[10px] font-medium text-gray-400">
                    {day.name}
                  </div>
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
            {timeSlots.map((time, timeIdx) => (
              <tr
                key={timeIdx}
                className="border-t border-dashed border-orange-200/80"
              >
                <td className="w-14 p-1 align-top">
                  <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">
                    {time}
                  </span>
                </td>
                {weekInfo.days.map((_, dayIdx) => {
                  const event = getEventForSlot(timeIdx, dayIdx);
                  const isDark = event ? getEventStyle(eventIndex++) : false;
                  return (
                    <td
                      key={dayIdx}
                      className="p-0.5 align-top border-l border-dashed border-orange-200/80 h-14"
                    >
                      {event && (
                        <div
                          className={`rounded-lg p-2 h-full flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] ${isDark
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
                              {event.description}
                            </p>
                          </div>

                          <div className="flex -space-x-1 mt-1">
                            {/* Host avatar */}
                            {event.host_details && (
                              <ParticipantAvatar
                                key="host"
                                participant={{
                                  _id: event.host_details._id,
                                  meeting_object_id: event._id,
                                  user_object_id: event.host_details._id,
                                  external_email: null,
                                  external_name: null,
                                  response_status: "accepted",
                                  is_optional: false,
                                  user_details: event.host_details,
                                }}
                                index={0}
                                isDark={isDark}
                              />
                            )}
                            {/* Participant avatars (limit to 3 to avoid overflow) */}
                            {event.participants.slice(0, 3).map((participant, i) => (
                              <ParticipantAvatar
                                key={participant._id}
                                participant={participant}
                                index={i + 1}
                                isDark={isDark}
                              />
                            ))}
                            {/* +N indicator if more participants */}
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
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No meetings message */}
      {meetings.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No meetings scheduled for this week
        </div>
      )}
    </div>
  );
};

export default UpcomingEvent;
