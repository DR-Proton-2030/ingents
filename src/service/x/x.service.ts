import axios from "axios";

export const getXDetails = async (userId: string) => {
  try {
    const response = await axios.get(`/api/x/profile?userId=${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Frontend X Service Error:", error.response?.data || error.message);
    throw error;
  }
};
