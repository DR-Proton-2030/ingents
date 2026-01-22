/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  unassignTask,
  assignTask,
  updateTaskStatus,
  TaskCreatePayload,
  TaskUpdatePayload,
} from "@/utils/api/task/task.api";
import { Task, TaskSection } from "@/types/interface/task.interface";
import { toast } from "react-toastify";
import { api } from "@/utils/api";

export const useTasks = (filters: any = {}, searchQuery: string = "") => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sections, setSections] = useState<TaskSection[]>([]);
  const [phases, setPhases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const normalizeTask = (task: any): Task => ({
    ...task,
    assignees: task.assignees ?? [],
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Map frontend filters to backend params
      const params: any = {};
      if (filters.userId) params.assigned_user_id = filters.userId;
      if (filters.statusId) params.phase_object_id = filters.statusId;
      if (filters.dueDate) {
        params.due_date_from = new Date().toISOString().split("T")[0]; // Today's date
        params.due_date_to = filters.dueDate; // Selected date
      }
      if (filters.onlyMyTasks) params.my_tasks = "true";
      if (filters.project_object_id) params.project_object_id = filters.project_object_id;
      // Add pagination to params
      params.page = currentPage;
      params.limit = itemsPerPage;

      const [tasksRes, phasesRes] = await Promise.all([
        getTasks(params),
        api.taskPhase.getTaskPhases()
      ]);

      if (tasksRes?.data) {
        const normalized = tasksRes.data.map(normalizeTask);
        setTasks(normalized);

        // Update pagination from backend response
        if (tasksRes.pagination) {
          setTotalItems(tasksRes.pagination.totalCount);
          setTotalPages(tasksRes.pagination.totalPages);
        } else {
          setTotalItems(normalized.length);
          setTotalPages(Math.ceil(normalized.length / itemsPerPage));
        }

        const fetchedPhases = phasesRes?.data || [];
        setPhases(fetchedPhases);
        setSections(groupTasksByStatus(normalized, fetchedPhases));
      }
    } catch (err: any) {
      const msg = err.message || "Failed to fetch tasks";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);



  const handleCreateTask = async (payload: TaskCreatePayload) => {
    await createTask(payload);
    toast.success("Task created");
    fetchTasks();
  };

  const handleUpdateTask = async (taskId: string, payload: object) => {
    await updateTaskStatus(taskId, payload);
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

  const handleEditTask = async (taskId: string, payload: TaskUpdatePayload) => {
    await updateTask(taskId, payload);
    toast.success("Task updated");
    fetchTasks();
  };
  return {
    tasks,
    sections,
    phases,
    loading,
    error,
    refetchTasks: fetchTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleAssignTask,
    handleUnassignTask,
    handleEditTask,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalItems,
    totalPages
  };
};

// Helper function to group tasks by phase_info
export function groupTasksByStatus(tasks: Task[], allPhases: any[] = []): TaskSection[] {
  // 1. Initialize sections from all available phases
  let sections: TaskSection[] = allPhases
    .sort((a, b) => a.index - b.index)
    .map(phase => ({
      id: phase._id,
      title: phase.name,
      status: phase.name,
      color: phase.color || "#9CA3AF",
      count: 0,
      tasks: [],
    }));

  // 2. If no phases fetched, find unique phases used in tasks
  if (sections.length === 0) {
    const phaseMap = new Map<string, any>();
    tasks.forEach(t => {
      if (t.phase_info && !phaseMap.has(t.phase_info._id)) {
        phaseMap.set(t.phase_info._id, t.phase_info);
      }
    });

    sections = Array.from(phaseMap.values())
      .sort((a, b) => (a.index || 0) - (b.index || 0))
      .map(p => ({
        id: p._id,
        title: p.name,
        status: p.name,
        color: p.color || "#9CA3AF",
        count: 0,
        tasks: [],
      }));
  }

  // 3. Fallback to default sections if still nothing
  if (sections.length === 0) {
    sections = [
      { id: "pending", title: "In Progress", status: "pending", color: "#F97316", count: 0, tasks: [] },
      { id: "ready-to-check", title: "Review", status: "ready-to-check", color: "#3B82F6", count: 0, tasks: [] },
      { id: "completed", title: "Completed", status: "completed", color: "#22C55E", count: 0, tasks: [] },
      { id: "backlog", title: "Backlog", status: "backlog", color: "#6B7280", count: 0, tasks: [] },
    ];
  }

  // 4. Group parent tasks into sections
  const parentTasks = tasks.filter((task) => !task.parent_task_object_id);
  parentTasks.forEach((task) => {
    // Try matching by phase ID, then by name
    const section = sections.find(s =>
      s.id === task.phase_info?._id ||
      s.title === task.phase_info?.name ||
      s.status === task.status
    );

    if (section) {
      section.tasks.push(task);
      section.count++;
    }
  });

  // 5. If we fetched all phases, keep them even if empty (optional, but original code filtered empty)
  // For better UX with dynamic phases, we'll keep them if we fetched them explicitly
  return sections.filter(s => s.count > 0);
}