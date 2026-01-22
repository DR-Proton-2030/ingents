/* eslint-disable @typescript-eslint/no-explicit-any */
import API from "../api";

const initialRoute = "task-phase";
let phasesPromise: Promise<any> | null = null;

export const clearTaskPhasesCache = () => {
  phasesPromise = null;
};

export const getTaskPhases = async (): Promise<any> => {
  if (phasesPromise) {
    return phasesPromise;
  }

  phasesPromise = (async () => {
    try {
      const response = await API.get(`/${initialRoute}/list`, {});
      console.log("✅ Task phases fetch successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Task phases fetch failed:",
        error.response?.data || error.message
      );
      phasesPromise = null; // Clear on error so it can retry
      throw new Error(error.response?.data?.message || "Task phases fetch failed");
    }
  })();

  return phasesPromise;
};

export const createTaskPhase = async (payload: { name: string; task_object_id?: string }): Promise<any> => {
  try {
    const response = await API.post(`/${initialRoute}/create`, payload);
    console.log("✅ Task phase creation successful:", response.data);
    clearTaskPhasesCache();
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Task phase creation failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Task phase creation failed");
  }
};

export const updateTaskPhase = async (
  phaseId: string,
  payload: object
): Promise<any> => {
  try {
    console.log("🚀 Calling update task API...");
    const response = await API.patch(
      `/${initialRoute}/update-phase/${phaseId}`,
      payload
    );

    console.log("✅ Phase update successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Phase update failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Phase update failed");
  }
};