"use client";
import React, { useState } from "react";
import MeetingDrawer from "./MeetingDrawer";
import {
  WeekNavigation,
  CalendarGrid,
  useWeekInfo,
  useMeetings,
} from "@/components/shared/upcomingEvent";

export const UpcomingEvent = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Use custom hooks for week info and meetings
  const weekInfo = useWeekInfo(weekOffset);
  const { meetings, isLoading, error } = useMeetings(weekInfo.fromDate, weekInfo.toDate);

  // Navigation handlers
  const goToPreviousWeek = () => setWeekOffset((prev) => prev - 1);
  const goToNextWeek = () => setWeekOffset((prev) => prev + 1);
  const goToCurrentWeek = () => setWeekOffset(0);

  // Drawer handlers
  const handleMeetingClick = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedMeetingId(null);
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="rounded-[18px] bg-white/30 backdrop-blur-[10px] shadow-[1px_1px_10px_4px_rgba(0,0,0,0.04)] p-4">
        <div className="flex items-center justify-center h-48">
          <span className="text-sm text-red-500">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[18px] bg-white/30 backdrop-blur-[10px] shadow-[1px_1px_10px_4px_rgba(0,0,0,0.04)] p-4 overflow-hidden">
      {/* Week Navigation */}
      <WeekNavigation
        weekInfo={weekInfo}
        onPrevWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        onCurrentWeek={goToCurrentWeek}
      />

      {/* Calendar Grid */}
      <CalendarGrid
        weekInfo={weekInfo}
        meetings={meetings}
        onMeetingClick={handleMeetingClick}
      />

      {/* No meetings message */}
      {meetings.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No meetings scheduled for this week
        </div>
      )}

      {/* Meeting Details Drawer */}
      <MeetingDrawer
        meetingId={selectedMeetingId}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  );
};

export default UpcomingEvent;
