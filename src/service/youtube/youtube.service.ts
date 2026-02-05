import axios from "axios";

export interface YoutubeUploadPayload {
  user_id: string;
  title: string;
  description?: string;
  tags?: string[];
  privacyStatus?: "public" | "private" | "unlisted";
  videoURL: string;
  scheduleAt?: string;
}

/**
 * Service used by Frontend Components to upload a video.
 * It calls the internal Next.js API route.
 */
export const uploadYoutubeVideo = async (payload: YoutubeUploadPayload) => {
  try {
    const response = await axios.post("/api/youtube/upload-video", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Frontend Youtube Service Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getChannelDetails = async (userId: string) => {
  try {
    const response = await axios.get(`/api/youtube/get-channel-details?userId=${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Frontend Youtube Service Error:", error.response?.data || error.message);
    throw error;
  }
};
