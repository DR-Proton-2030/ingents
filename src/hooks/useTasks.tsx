/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
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


export const normalizeTask = (task: any): Task => {
  if (!task) return {} as Task;
  return {
    ...task,
    assignees: task.assignees ?? task.assigned_users_info ?? [],
    tags: task.tags ?? task.tags_info ?? [],
    tag_object_id_list: task.tag_object_id_list ?? task.tag_object_ids ?? [],
  };
};

const DEFAULT_FILTERS = {};

export const useTasks = (filters: any = DEFAULT_FILTERS, searchQuery: string = "") => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sections, setSections] = useState<TaskSection[]>([]);
  const [phases, setPhases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage] = useState(10);
  
  // Track page for each section
  const [sectionPages, setSectionPages] = useState<Record<string, number>>({});
  const lastSectionIdRef = useRef<string | null>(null);

  const fetchTasks = useCallback(async (targetPhaseId?: string, silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      // 1. Fetch phases
      const phasesRes = await api.taskPhase.getTaskPhases();
      const fetchedPhases = phasesRes?.data || [];
      setPhases(fetchedPhases);

      // 2. Prepare common params
      const commonParams: any = {};
      if (filters.userId) commonParams.assigned_user_id = filters.userId;
      if (filters.dueDate) {
        commonParams.due_date_from = new Date().toISOString().split("T")[0];
        commonParams.due_date_to = filters.dueDate;
      }
      if (filters.onlyMyTasks) commonParams.my_tasks = "true";
      if (filters.project_object_id) commonParams.project_object_id = filters.project_object_id;
      if (searchQuery) commonParams.query = searchQuery;
      commonParams.limit = itemsPerPage;

      const phaseId = typeof targetPhaseId === 'string' ? targetPhaseId : null;

      if (phaseId) {
        // Targeted Pagination: Only triggered when user clicks a specific page
        const page = sectionPages[phaseId] || 1;
        const res = await getTasks({ ...commonParams, phase_object_id: phaseId, page });
        const normalized = (res?.data || []).map(normalizeTask);
        
        setSections(prev => prev.map(s => s.id === phaseId ? {
          ...s,
          tasks: normalized,
          currentPage: page,
          count: res?.pagination?.totalCount ?? s.count,
          totalPages: res?.pagination?.totalPages ?? s.totalPages,
        } : s));
      } else {
        // Initial / Global Load: SINGLE API CALL for all tasks
        // We fetch a larger initial set (e.g. limit * number of phases) to populate sections
        const globalRes = await getTasks({ ...commonParams, limit: 100 });
        const allFetchedTasks = (globalRes?.data || []).map(normalizeTask);
        setTasks(allFetchedTasks);

        // Group the single response into sections locally
        const grouped = groupTasksIntoSections(allFetchedTasks, fetchedPhases, itemsPerPage);
        setSections(grouped);
      }

    } catch (err: any) {
      const msg = err.message || "Failed to fetch tasks";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, sectionPages, itemsPerPage]);

  // Initial fetch on filters or search change
  useEffect(() => {
    setSectionPages({});
    fetchTasks();
  }, [filters, searchQuery]);

  // Pagination-specific trigger
  useEffect(() => {
    if (lastSectionIdRef.current) {
      fetchTasks(lastSectionIdRef.current);
      lastSectionIdRef.current = null;
    }
  }, [sectionPages]);

  const setSectionPage = (sectionId: string, page: number) => {
    lastSectionIdRef.current = sectionId;
    setSectionPages(prev => ({ ...prev, [sectionId]: page }));
  };

  const handleCreateTask = async (payload: TaskCreatePayload) => {
    const res = await createTask(payload);
    toast.success("Task created");
    fetchTasks();
    return res;
  };

  const handleUpdateTask = async (taskId: string, payload: object) => {
    const res = await updateTaskStatus(taskId, payload);
    toast.success("Task updated");
    fetchTasks();
    return res;
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    toast.success("Task deleted");
    fetchTasks();
  };

  const handleAssignTask = async (taskId: string, userId: string) => {
    const res = await assignTask(taskId, userId);
    toast.success("User assigned");
    fetchTasks();
    return res;
  };

  const handleUnassignTask = async (taskId: string, userId: string) => {
    const res = await unassignTask(taskId, userId);
    toast.success("User unassigned");
    fetchTasks();
    return res;
  };

  const handleEditTask = async (taskId: string, payload: TaskUpdatePayload, silent = false) => {
    const res = await updateTask(taskId, payload);
    if (!silent) {
      toast.success("Task updated");
    }
    fetchTasks(undefined, silent);
    return res;
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
    setSectionPage,
    itemsPerPage
  };
};

/**
 * Groups a flat tasks list into sections based on phase_info
 */
export function groupTasksIntoSections(tasks: Task[], allPhases: any[] = [], itemsPerPage: number = 10): TaskSection[] {
  const sections: TaskSection[] = allPhases
    .sort((a, b) => a.index - b.index)
    .map(phase => ({
      id: phase._id,
      title: phase.name,
      status: phase.name,
      color: phase.color || "#9CA3AF",
      count: 0,
      tasks: [],
      currentPage: 1,
      totalPages: 1
    }));

  const parentTasks = tasks.filter((task) => !task.parent_task_object_id);
  
  // First, count all tasks per phase to get correct pagination info
  parentTasks.forEach((task) => {
    const section = sections.find(s =>
      s.id === (task.phase_info?._id || task.phase_object_id)
    );
    if (section) section.count++;
  });

  // Then, populate only the first page (top 10) for each section
  sections.forEach(section => {
    const phaseTasks = parentTasks.filter(t => 
      (t.phase_info?._id || t.phase_object_id) === section.id
    );
    
    section.tasks = phaseTasks.slice(0, itemsPerPage);
    section.totalPages = Math.ceil(section.count / itemsPerPage);
  });

  return sections;
}
