import axios from "axios";

export const getFacebookDetails = async (userId: string) => {
  try {
    const response = await axios.get(`/api/facebook/profile?userId=${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Frontend Facebook Service Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getFacebookPageDetails = async (userId: string, pageId: string) => {
  try {
    const response = await axios.get(`/api/facebook/page-details?userId=${userId}&pageId=${pageId}`);
    return response.data;
  } catch (error: any) {
    console.error("Frontend Facebook Page Details Service Error:", error.response?.data || error.message);
    throw error;
  }
};
