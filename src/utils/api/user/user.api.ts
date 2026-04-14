import { Params } from "@/types/api/api.types";
import API from "../api";
import { IUser } from "@/types/interface/user.interface";

const initialRoute = "user";

export interface UserOption {
  _id: string;
  full_name: string;
  email: string;
}

export const searchUsers = async (query: Params): Promise<any> => {
  try {
    const response = await API.get(`/${initialRoute}/search-user`, { params: query });
    return response.data;
  } catch (error: any) {
    console.error("❌ Search failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Search failed");
  }
}

export const getUser = async (query: Params): Promise<IUser[]> => {
  try {
    const response = await API.get(`/${initialRoute}/getUser`, { params: query });
    if(response.data){
      return response.data.data;
    }
    throw new Error("No data found");
  } catch (error: any) {
    console.error("❌ Search failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Search failed");
  }
}

export const updateUser = async (payload : any): Promise<IUser[]> => {
  try {
    const response = await API.patch(`/${initialRoute}/update-user`, payload);
    return response.data;
  } catch (error: any) {
    console.error("❌ Update failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Update failed");
  }
}

export const markAttendance = async (): Promise<any> => {
  try {
    const response = await API.post(`/${initialRoute}/mark-attendance`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Mark attendance failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Mark attendance failed");
  }
}

export const getAttendanceStats = async (): Promise<any> => {
  try {
    const response = await API.get(`/${initialRoute}/attendance-stats`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Get attendance stats failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Get attendance stats failed");
  }
}