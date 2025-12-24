/* eslint-disable @typescript-eslint/no-explicit-any */
import { Payload } from "@/types/api/api.types";
import API from "../api";

const initialRoute = "messages";

export const sendMessage = async (payload: FormData): Promise<any> => {
  try {
    console.log("🚀 Calling messages API...");
    const response = await API.post(`/${initialRoute}/send`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("✅ Message Sent successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Message sending failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Message sending failed");
  }
};