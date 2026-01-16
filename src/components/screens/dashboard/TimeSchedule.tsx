"use client";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/contexts/authContext/authContext";
import { getUpcomingMeetings, Meeting } from "@/utils/api/meeting/meeting.api";

export const TimeSchedule = () => {
  const { user } = useContext(AuthContext);
  const [upcomingMeeting, setUpcomingMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setLoading(true);
        const response = await getUpcomingMeetings(1);
        if (response.data && response.data.length > 0) {
          console.log("===>", response.data)
          setUpcomingMeeting(response.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch upcoming meeting:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, []);

  if (loading) {
    return (
      <div className="rounded-[20px] bg-slate-900 shadow-xl p-5 min-h-[280px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!upcomingMeeting) return null;

  const currentUserId = user?.id || (user as any)?._id;

  const isTeamMeeting =
    upcomingMeeting.meeting_type === "team" ||
    upcomingMeeting.title.toLowerCase().includes("therapist team");

  // Robust background selection with fallbacks
  const getBackgroundImage = () => {
    // If it's a team meeting or specifically mentioned "therapist team", try company logo first
    if (isTeamMeeting && user?.company_details?.logo) return user.company_details.logo;

    // For 1-on-1 meetings, try to find the other person's profile picture
    if (upcomingMeeting.meeting_type === "one_on_one") {
      console.log("first")
      const otherParticipant = upcomingMeeting.participants[0]
      console.log("otherParticipant", otherParticipant.user_details)
      if (otherParticipant?.user_details?.profile_picture) {
        return otherParticipant.user_details.profile_picture;
      }
    }

    // Fallbacks: Host's photo -> User's Company Logo -> Default placeholder
    return (
      upcomingMeeting.host_details?.profile_picture ||
      user?.company_details?.logo ||
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop"
    );
  };

  const backgroundImage = getBackgroundImage();

  const startTime = new Date(upcomingMeeting.scheduled_start_time);
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const monthName = startTime.toLocaleString("default", { month: "long" });
  const day = startTime.getDate();
  const year = startTime.getFullYear();

  return (
    <div className="relative group rounded-[20px] bg-slate-900 shadow-xl p-5 overflow-hidden min-h-[280px] flex flex-col">
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={upcomingMeeting.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-800" />
      )}

      {/* Bottom Blur & Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
      <div className="absolute inset-0 backdrop-blur-[4px] rounded-[20px] [mask-image:linear-gradient(to_top,white_40%,transparent_60%)] z-10" />

      <div className="relative z-20 flex flex-col h-full flex-grow">
        <div className="mb-3 flex items-center justify-between">

          <h3 className="flex items-center gap-1 text-xl font-semibold text-white">
            Upcoming
          </h3>
          <button className="rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-2 py-1 text-xs text-white">
            {monthName} {year}
          </button>
        </div>

        <div className="mt-auto">
          <div className="text-sm text-gray-200">{monthName} {day}</div>
          <div className="mt-1 text-2xl font-bold text-white line-clamp-1">
            {upcomingMeeting.title}
          </div>
          <div className="text-xs text-gray-300">
            {formatTime(startTime)} - {formatTime(new Date(upcomingMeeting.scheduled_end_time))}
          </div>

          <div className="flex items-center gap-3 mt-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-3 text-sm text-white">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            {isTeamMeeting
              ? "Team Sync"
              : `Meeting with ${upcomingMeeting.meeting_type === "one_on_one"
                ? upcomingMeeting.participants.find((p) => p.user_details?._id !== currentUserId)?.user_details?.full_name || "Guest"
                : upcomingMeeting.host_details?.full_name || "Team"
              }`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSchedule;
