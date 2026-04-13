/* eslint-disable @typescript-eslint/no-explicit-any */
import API from "../api";

const initialRoute = "activity";

export interface ActivityItem {
  _id: string;
  company_object_id: string;
  actor_object_id: string;
  actor_name: string;
  activity_type: string;
  message: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export const getActivities = async (limit: number = 10): Promise<any> => {
  try {
    const response = await API.get(`/${initialRoute}/get-activities`, { params: { limit } });
    return response.data;
  } catch (error: any) {
    console.error("❌ Activities fetch failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Activities fetch failed");
  }
};
