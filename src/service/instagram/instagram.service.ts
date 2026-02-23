import axios from "axios";

export const getInstagramDetails = async (userId: string) => {
  try {
    const response = await axios.get(`/api/instagram/profile?userId=${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Frontend Instagram Service Error:", error.response?.data || error.message);
    throw error;
  }
};

export const postInstagramContent = async (formData: FormData) => {
  try {
    const response = await axios.post("/api/instagram/post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Frontend Instagram Posting Error:", error.response?.data || error.message);
    throw error;
  }
};
