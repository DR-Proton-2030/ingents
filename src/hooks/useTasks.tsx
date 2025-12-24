/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "@/utils/api/task/task.api";
import { Task, TaskSection } from "@/types/interface/task.interface";
import { toast } from "react-toastify";
import { api } from "@/utils/api";

interface UseTasksReturn {
  tasks: Task[];
  sections: TaskSection[];
  loading: boolean;
  error: string | null;
  refetchTasks: () => Promise<void>;
  handleCreateTask: (payload: object) => Promise<void>;
  handleUpdateTask: (taskId: string, payload: object) => Promise<void>;
  handleDeleteTask: (taskId: string) => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sections, setSections] = useState<TaskSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.task.getTasks();
      if (response?.data) {
        // console.log("response data", response.data);
        setTasks(response.data);
        const grouped = groupTasksByStatus(response.data);
        // console.log("grouped sections", grouped);
        setSections(grouped);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch tasks";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = useCallback(async (payload: object) => {
    try {
      await createTask(payload);
      toast.success("Task created successfully");
      await fetchTasks();
    } catch (err: any) {
      toast.error(err.message || "Failed to create task");
      throw err;
    }
  }, [fetchTasks]);

  const handleUpdateTask = useCallback(async (taskId: string, payload: object) => {
    try {
      await updateTask(taskId, payload);
      toast.success("Task updated successfully");
      await fetchTasks();
    } catch (err: any) {
      toast.error(err.message || "Failed to update task");
      throw err;
    }
  }, [fetchTasks]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully");
      await fetchTasks();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete task");
      throw err;
    }
  }, [fetchTasks]);

  return {
    tasks,
    sections,
    loading,
    error,
    refetchTasks: fetchTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
  };
};

// Helper function to group tasks by status
function groupTasksByStatus(tasks: Task[]): TaskSection[] {
  const sections: TaskSection[] = [
    {
      id: "pending",
      title: "In Progress",
      status: "pending",
      color: "orange",
      count: 0,
      tasks: [],
    },
    {
      id: "ready-to-check",
      title: "Ready to check by PM",
      status: "ready-to-check",
      color: "blue",
      count: 0,
      tasks: [],
    },
    {
      id: "completed",
      title: "Completed",
      status: "completed",
      color: "green",
      count: 0,
      tasks: [],
    },
    {
      id: "backlog",
      title: "Backlog",
      status: "backlog",
      color: "gray",
      count: 0,
      tasks: [],
    },
  ];

  // Filter only parent tasks (those without parent_task_object_id)
  const parentTasks = tasks.filter(task => !task.parent_task_object_id);

  parentTasks.forEach((task) => {
    const section = sections.find((s) => s.status === task.status);
    if (section) {
      section.tasks.push(task);
      section.count++;
    }
  });

  // Filter out empty sections
  return sections.filter((section) => section.count > 0);
}
