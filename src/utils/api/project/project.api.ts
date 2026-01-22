/* eslint-disable @typescript-eslint/no-explicit-any */
import API from "../api";
import { CreateProjectPayload, UpdateProjectPayload } from "@/types/interface/project.interface";

const initialRoute = "projects";

export const getProjects = async (params: any = {}): Promise<any> => {
  try {
    const response = await API.get(`/${initialRoute}/get-projects`, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Projects fetch failed");
  }
};

export const createProject = async (payload: CreateProjectPayload): Promise<any> => {
  try {
    const response = await API.post(`/${initialRoute}/create-project`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Project creation failed");
  }
};

export const updateProject = async (projectId: string, payload: UpdateProjectPayload): Promise<any> => {
  try {
    const response = await API.patch(`/${initialRoute}/update-project/${projectId}`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Project update failed");
  }
};

export const deleteProject = async (projectId: string): Promise<any> => {
  try {
    const response = await API.delete(`/${initialRoute}/delete-project/${projectId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Project deletion failed");
  }
};
