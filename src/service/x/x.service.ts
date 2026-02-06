import axios from "axios";

export const getXDetails = async (userId: string, accessToken?: string) => {
  try {
    const url = `/api/x/get-all-details?userId=${userId}${accessToken ? `&access_token=${accessToken}` : ""}`;
    const response = await axios.get(url);
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
