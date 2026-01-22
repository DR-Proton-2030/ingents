/* eslint-disable @typescript-eslint/no-explicit-any */
import API from "../api";

const initialRoute = "task-tags";
let tagsPromise: Promise<any> | null = null;

export const clearTaskTagsCache = () => {
  tagsPromise = null;
};

export const getTaskTags = async (): Promise<any> => {
  if (tagsPromise) {
    return tagsPromise;
  }

  tagsPromise = (async () => {
    try {
      const response = await API.get(`/${initialRoute}/get-all-tag`, {});
      console.log("✅ Task tags fetch successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Task tags fetch failed:",
        error.response?.data || error.message
      );
      tagsPromise = null; // Clear on error so it can retry
      throw new Error(error.response?.data?.message || "Task tags fetch failed");
    }
  })();

  return tagsPromise;
};

export const createTaskTag = async (payload: { name: string; color: string }): Promise<any> => {
  try {
    const response = await API.post(`/${initialRoute}/create-tag`, payload);
    console.log("✅ Task tag creation successful:", response.data);
    clearTaskTagsCache();
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Task tag creation failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Task tag creation failed");
  }
};
