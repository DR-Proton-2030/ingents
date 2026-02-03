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
export const postXContent = async (formData: FormData) => {
  try {
    const response = await axios.post("/api/x/post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Frontend X Posting Error:", error.response?.data || error.message);
    throw error;
  }
};
