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

export interface TaskAttachmentInput {
  file?: File;
  url?: string;
  description?: string;
}

export interface TaskCreatePayload {
  title: string;
  description?: string;
  due_date?: string | null;
  priority?: "urgent" | "normal" | "low" | "High" | "Normal" | "Low";
  phase_object_id?: string;
  assigned_user_list?: string[];
  parent_task_object_id?: string | null;
  attachments?: TaskAttachmentInput[];
  [key: string]: any;
}

export const createTask = async (payload: TaskCreatePayload): Promise<any> => {
  try {
    console.log("🚀 Calling create task API with payload:", payload);

    const { attachments, ...restPayload } = payload;
    
    // Check if we have files to upload
    const hasFiles = attachments?.some((att) => att.file);

    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData();

      // Append all non-attachment fields
      Object.entries(restPayload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Append files and collect descriptions
      const descriptions: string[] = [];
      const existingAttachments: { url: string; description?: string }[] = [];

      attachments?.forEach((att) => {
        if (att.file) {
          formData.append("attachments", att.file);
          descriptions.push(att.description || "");
        } else if (att.url) {
          // For existing attachments (URLs without files)
          existingAttachments.push({ url: att.url, description: att.description });
        }
      });

      if (descriptions.length > 0) {
        formData.append("attachment_descriptions", JSON.stringify(descriptions));
      }

      if (existingAttachments.length > 0) {
        formData.append("existing_attachments", JSON.stringify(existingAttachments));
      }

      const response = await API.post(`/${initialRoute}/add-task`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Task creation successful:", response.data);
      return response.data;
    } else {
      // No files, use JSON
      const jsonPayload = {
        ...restPayload,
        attachments: attachments?.map((att) => ({
          url: att.url,
          description: att.description || "",
        })),
      };

      const response = await API.post(`/${initialRoute}/add-task`, jsonPayload);
      console.log("✅ Task creation successful:", response.data);
      return response.data;
    }
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

export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  due_date?: string | Date | null;
  priority?: "urgent" | "high" | "normal" | "low" | "High" | "Normal" | "Low";
  phase_object_id?: string;
  assigned_user_list?: string[];
  completed?: boolean;
  attachments?: TaskAttachmentInput[];
  [key: string]: any;
}

export const updateTask = async (
  taskId: string,
  payload: TaskUpdatePayload
): Promise<any> => {
  try {
    console.log("🚀 Calling update task API...");

    const { attachments, ...restPayload } = payload;

    // Check if we have files to upload
    const hasFiles = attachments?.some((att) => att.file);

    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData();

      // Append all non-attachment fields
      Object.entries(restPayload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === "boolean") {
            formData.append(key, value.toString());
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Append files and collect descriptions
      const descriptions: string[] = [];
      const existingAttachments: { url: string; description?: string }[] = [];

      attachments?.forEach((att) => {
        if (att.file) {
          formData.append("attachments", att.file);
          descriptions.push(att.description || "");
        } else if (att.url) {
          // For existing attachments (URLs without files)
          existingAttachments.push({ url: att.url, description: att.description });
        }
      });

      if (descriptions.length > 0) {
        formData.append("attachment_descriptions", JSON.stringify(descriptions));
      }

      if (existingAttachments.length > 0) {
        formData.append("existing_attachments", JSON.stringify(existingAttachments));
      }

      const response = await API.patch(
        `/${initialRoute}/update-task/${taskId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Task update successful:", response.data);
      return response.data;
    } else {
      // No files, use JSON
      const jsonPayload = {
        ...restPayload,
        attachments: attachments?.map((att) => ({
          url: att.url,
          description: att.description || "",
        })),
      };

      const response = await API.patch(
        `/${initialRoute}/update-task/${taskId}`,
        jsonPayload
      );
      console.log("✅ Task update successful:", response.data);
      return response.data;
    }
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
