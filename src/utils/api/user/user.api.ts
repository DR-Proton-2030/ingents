import { Params } from "@/types/api/api.types";
import API from "../api";

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