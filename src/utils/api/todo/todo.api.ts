/* eslint-disable @typescript-eslint/no-explicit-any */
import API from "../api";

const initialRoute = "todos";

export interface Todo {
  _id: string;
  user_object_id: string;
  company_object_id: string;
  text: string;
  completed: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export const getTodos = async (date: string): Promise<any> => {
  try {
    const response = await API.get(`/${initialRoute}/get-todos`, { params: { date } });
    return response.data;
  } catch (error: any) {
    console.error("❌ Todos fetch failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Todos fetch failed");
  }
};

export const createTodo = async (payload: { text: string; date: string }): Promise<any> => {
  try {
    const response = await API.post(`/${initialRoute}/create-todo`, payload);
    return response.data;
  } catch (error: any) {
    console.error("❌ Todo create failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Todo create failed");
  }
};

export const updateTodo = async (payload: { todoId: string; text?: string; completed?: boolean }): Promise<any> => {
  try {
    const response = await API.patch(`/${initialRoute}/update-todo`, payload);
    return response.data;
  } catch (error: any) {
    console.error("❌ Todo update failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Todo update failed");
  }
};

export const deleteTodo = async (id: string): Promise<any> => {
  try {
    const response = await API.delete(`/${initialRoute}/delete-todo/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Todo delete failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Todo delete failed");
  }
};
