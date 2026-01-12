import { Params } from "@/types/api/api.types";
import API from "../api";
import { IUser } from "@/types/interface/user.interface";

const initialRoute = "user";

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
    return response.data;
  } catch (error: any) {
    console.error("❌ Search failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Search failed");
  }
}