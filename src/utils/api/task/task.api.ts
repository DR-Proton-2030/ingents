/* eslint-disable @typescript-eslint/no-explicit-any */
import API from "../api";

const initialRoute = "tasks";

export const getTasks = async (params: any = {}): Promise<any> => {
  try {
    const response = await API.get(`/${initialRoute}/get-tasks`, { params });

    console.log("✅ Tasks fetch successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Tasks fetch failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Tasks fetch failed");
  }
};

export const createTask = async (payload: object): Promise<any> => {
  try {
    // const token = typeof window !== 'undefined' ? localStorage.getItem("@token") : null;
    // if (!token) {
    //   throw new Error("Token not found");
    // }

    console.log("🚀 Calling create task API with payload:", payload);
    const response = await API.post(`/${initialRoute}/add-task`, payload, {
      // headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ Task creation successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Task creation failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Task creation failed");
  }
};

export const updateTaskStatus = async (
  taskId: string,
  payload: object
): Promise<any> => {
  try {
    console.log("🚀 Calling update task API...");
    const response = await API.patch(
      `/${initialRoute}/update-task-status/${taskId}`,
      payload
    );

    console.log("✅ Task update successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Task update failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Task update failed");
  }
};

export const updateTask = async (
  taskId: string,
  payload: object
): Promise<any> => {
  try {
    console.log("🚀 Calling update task API...");
    const response = await API.patch(
      `/${initialRoute}/update-task/${taskId}`,
     payload
    );

    console.log("✅ Task update successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Task update failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Task update failed");
  }
};
export const deleteTask = async (taskId: string): Promise<any> => {
  try {
    console.log("🚀 Calling delete task API...");

    const response = await API.delete(
      `/${initialRoute}/delete-task/${taskId}`,
      {}
    );

    console.log("✅ Task creation successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Task creation failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Task creation failed");
  }
};

export const unassignTask = async (
  taskId: string,
  userId: string
): Promise<any> => {
  try {
    console.log("🚀 Calling delete task API...");

    const response = await API.delete(
      `/${initialRoute}/unassign/${taskId}/${userId}`,
      {}
    );
    console.log("✅ Task creation successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Task unassign failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Task unassign failed");
  }
};

export const assignTask = async (
  taskId: string,
  userId: string
): Promise<any> => {
  try {
      console.log("🚀 Calling task assign task API...");

  const response = await API.post(`/${initialRoute}/assign/${taskId}/${userId}`, {
   
  });
     console.log("✅ Task creation successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Task assign failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Task assign failed");
  }



};
