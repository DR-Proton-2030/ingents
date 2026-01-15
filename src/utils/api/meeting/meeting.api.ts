/* eslint-disable @typescript-eslint/no-explicit-any */
import API from "../api";

const initialRoute = "meetings";

export interface Participant {
  _id: string;
  meeting_object_id: string;
  user_object_id: string | null;
  external_email: string | null;
  external_name: string | null;
  response_status: string;
  is_optional: boolean;
  user_details: {
    _id: string;
    full_name: string;
    email: string;
  } | null;
}

export interface Meeting {
  _id: string;
  title: string;
  description: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  duration_minutes: number;
  timezone: string;
  meeting_link: string;
  meeting_code: string;
  meeting_type: string;
  status: string;
  host_details: {
    _id: string;
    full_name: string;
    email: string;
  };
  participants: Participant[];
}

export interface MeetingsResponse {
  message: string;
  data: Meeting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getMeetings = async (
  from_date: string,
  to_date: string,
  page: number = 1,
  limit: number = 10
): Promise<MeetingsResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      from_date,
      to_date,
    });

    const response = await API.get(`/${initialRoute}/get-meetings?${queryParams.toString()}`);

    console.log("✅ Meetings fetch successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Meetings fetch failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Meetings fetch failed");
  }
};

// Meeting Details Response Interface
export interface MeetingDetails {
  _id: string;
  title: string;
  description: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  duration_minutes: number;
  timezone: string;
  host_user_object_id: string;
  meeting_link: string;
  meeting_code: string;
  meeting_type: string;
  is_recurring: boolean;
  recurrence_rule: string | null;
  parent_meeting_id: string | null;
  occurrence_index: number | null;
  status: string;
  reminder_minutes_before: number;
  is_reminder_sent: boolean;
  company_object_id: string;
  created_by_user_object_id: string;
  notes: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  parent_meeting: any | null;
  host_details: {
    _id: string;
    full_name: string;
    email: string;
  };
}

export interface MeetingDetailsResponse {
  message: string;
  data: {
    meeting: MeetingDetails;
    participants: Participant[];
    instances: any[];
  };
}

export const getMeetingById = async (
  meetingId: string
): Promise<MeetingDetailsResponse> => {
  try {
    const response = await API.get(`/${initialRoute}/${meetingId}`);

    console.log("✅ Meeting details fetch successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Meeting details fetch failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Meeting details fetch failed");
  }
};
export const getMeetingByCode = async (
  meetingId: string
): Promise<MeetingDetailsResponse> => {
  try {
    const response = await API.get(`/${initialRoute}/code/${meetingId}`);

    console.log("✅ Meeting details fetch successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Meeting details fetch failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Meeting details fetch failed");
  }
};

// Helper function to get the start and end of the current week
export const getCurrentWeekDates = (): { fromDate: string; toDate: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate start of week (Monday)
  const startOfWeek = new Date(now);
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Sunday
  startOfWeek.setDate(now.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Calculate end of week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  // Format as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  return {
    fromDate: formatDate(startOfWeek),
    toDate: formatDate(endOfWeek),
  };
};

export interface CreateMeetingPayload {
  title: string;
  description: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  duration_minutes: number;
  timezone: string;
  meeting_type: string;
  is_recurring: boolean;
  reminder_minutes_before: number;
  notes: string;
  participants: {
    user_object_id?: string;
    is_optional?: boolean;
    external_email?: string;
    external_name?: string;
  }[];
}

export const createMeeting = async (
  payload: CreateMeetingPayload
): Promise<any> => {
  try {
    const response = await API.post(`/${initialRoute}/create`, payload);

    console.log("✅ Meeting creation successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Meeting creation failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Meeting creation failed");
  }
};

export interface UpdateMeetingPayload {
  title?: string;
  description?: string;
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  duration_minutes?: number;
  notes?: string;
}

export const updateMeeting = async (
  meetingId: string,
  payload: UpdateMeetingPayload
): Promise<any> => {
  try {
    const response = await API.patch(`/${initialRoute}/${meetingId}`, payload);

    console.log("✅ Meeting update successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Meeting update failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Meeting update failed");
  }
};
