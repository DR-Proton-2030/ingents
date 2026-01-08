/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  unassignTask,
  assignTask,
} from "@/utils/api/task/task.api";
import { Task, TaskSection } from "@/types/interface/task.interface";
import { toast } from "react-toastify";
import { api } from "@/utils/api";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sections, setSections] = useState<TaskSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeTask = (task: any): Task => ({
    ...task,
    assignees: task.assignees ?? [],
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.task.getTasks();

      if (response?.data) {
        const normalized = response.data.map(normalizeTask);
        setTasks(normalized);
        setSections(groupTasksByStatus(normalized));
      }
    } catch (err: any) {
      const msg = err.message || "Failed to fetch tasks";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);



  const handleCreateTask = async (payload: object) => {
    await createTask(payload);
    toast.success("Task created");
    fetchTasks();
  };

  const handleUpdateTask = async (taskId: string, payload: object) => {
    await updateTask(taskId, payload);
    toast.success("Task updated");
    fetchTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    toast.success("Task deleted");
    fetchTasks();
  };


  const handleAssignTask = async (taskId: string, userId: string) => {
    await assignTask(taskId, userId);
    toast.success("User assigned");
    fetchTasks(); 
  };

  const handleUnassignTask = async (taskId: string, userId: string) => {
    await unassignTask(taskId, userId);
    toast.success("User unassigned");
    fetchTasks(); 
  };

  return {
    tasks,
    sections,
    loading,
    error,
    refetchTasks: fetchTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleAssignTask,
    handleUnassignTask,
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
  const parentTasks = tasks.filter((task) => !task.parent_task_object_id);
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