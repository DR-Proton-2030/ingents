import { API_BASE_URL } from "@/config/config";
import axios from "axios";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export const generateAIContent = async (userId: string, companyId: string, context: string) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/ai/generate`, {
      userId,
      companyId,
      context,
      feature: "social_post_generation"
    }, {
      withCredentials: true
    });

    if (response.data.success) {
      return response.data.result;
    }
    throw new Error(response.data.message || "Failed to generate content");
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
