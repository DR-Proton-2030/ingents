import { Participant } from "@/utils/api/meeting/meeting.api";

// Avatar gradient colors for participants
export const avatarColors = [
  "bg-gradient-to-br from-indigo-500 to-purple-600",
  "bg-gradient-to-br from-emerald-500 to-teal-600",
  "bg-gradient-to-br from-orange-500 to-red-600",
  "bg-gradient-to-br from-cyan-500 to-blue-600",
  "bg-gradient-to-br from-pink-500 to-rose-600",
  "bg-gradient-to-br from-amber-500 to-yellow-600",
];

// Time slots for calendar display (8am to 12am)
export const TIME_SLOTS = [
  "8 am", "9 am", "10 am", "11 am", "12 pm",
  "1 pm", "2 pm", "3 pm", "4 pm", "5 pm",
  "6 pm", "7 pm", "8 pm", "9 pm", "10 pm",
  "11 pm", "12 am",
];

// Day names for calendar header
export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Types
export interface DayInfo {
  name: string;
  date: number;
  fullDate: Date;
  isToday: boolean;
}

export interface WeekInfo {
  days: DayInfo[];
  monthName: string;
  year: number;
  endMonthName: string;
  endYear: number;
  fromDate: string;
  toDate: string;
  isCurrentWeek: boolean;
}

// Helper functions
export const getInitial = (email: string | null, name: string | null): string => {
  if (name && name.trim()) return name.trim().charAt(0).toUpperCase();
  if (email && email.trim()) return email.trim().charAt(0).toUpperCase();
  return "?";
};

export const getDisplayName = (participant: Participant): string => {
  return (
    participant.user_details?.full_name ||
    participant.external_name ||
    participant.user_details?.email ||
    participant.external_email ||
    "Unknown"
  );
};

export const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
