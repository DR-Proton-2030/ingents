import axios from "axios";

export interface YoutubeUploadPayload {
  user_id: string;
  title: string;
  description?: string;
  tags?: string[];
  privacyStatus?: "public" | "private" | "unlisted";
  videoURL: string;
  scheduleAt?: string;
  thumbnailDataUrl?: string;
}

/**
 * Service used by Frontend Components to upload a video.
 * It calls the internal Next.js API route.
 */
export const uploadYoutubeVideo = async (payload: YoutubeUploadPayload | FormData) => {
  try {
    const isFormData = payload instanceof FormData;
    const response = await axios.post("/api/youtube/upload-video", payload, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    const errorBody = error.response?.data;
    const errorMessage = (errorBody && typeof errorBody === 'object' && Object.keys(errorBody).length > 0) 
      ? JSON.stringify(errorBody) 
      : error.message;
    console.error("Frontend Youtube Service Error:", errorMessage);
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
