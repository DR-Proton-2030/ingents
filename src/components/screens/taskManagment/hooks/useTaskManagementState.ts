"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useTasks, normalizeTask } from "@/hooks/useTasks";
import { ViewMode, TaskStatus } from "@/types/interface/task.interface";
import { TaskFormData } from "@/types/interface/task-modal.interface";
import { ITaskFilters } from "@/types/interface/taskFilter.interface";
import { useReactToPrint } from "react-to-print";

export function useTaskManagementState() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [filters, setFilters] = useState<ITaskFilters>({
    userId: null as string | null,
    statusId: null as string | null,
    dueDate: null as string | null,
    onlyMyTasks: false,
    sort_by: null,
    project_object_id: null,
  });

  const {
    tasks,
    sections,
    phases,
    loading,
    error,
    handleUpdateTask,
    refetchTasks,
    handleCreateTask,
    handleDeleteTask,
    handleUnassignTask,
    handleAssignTask,
    handleEditTask,
    setSectionPage,
    itemsPerPage,
  } = useTasks(filters, debouncedSearchQuery);

  const [activeView, setActiveView] = useState<ViewMode>("spreadsheet");
  const [parentTaskId, setParentTaskId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | undefined>();

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateSubtaskModalOpen, setIsCreateSubtaskModalOpen] =
    useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: "Task Management Report",
  });

  const handleAddSubtask = useCallback((taskId: string) => {
    setParentTaskId(taskId);
    setIsCreateSubtaskModalOpen(true);
  }, []);

  const handleToggleTask = useCallback((taskId: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }, []);

  const handleAddTask = useCallback((sectionId: string) => {
    setSelectedStatus(sectionId as TaskStatus);
    setIsCreateModalOpen(true);
  }, []);

  const handleFilter = useCallback(() => {
    setIsFilterDrawerOpen(true);
  }, []);

  const handleStatusChange = useCallback(
    async (taskId: string, newPhaseId: string) => {
      try {
        const res = await (handleUpdateTask(taskId, { phase_object_id: newPhaseId }) as any);
        if (selectedTask && selectedTask._id === taskId) {
          const rawTask = res?.data || res;
          setSelectedTask(normalizeTask(rawTask));
        }
      } catch (error) {
        console.error("Failed to update task status:", error);
      }
    },
    [handleUpdateTask, selectedTask]
  );

  const handleDeleteTaskById = useCallback(
    async (taskId: string) => {
      try {
        await handleDeleteTask(taskId);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    },
    [handleDeleteTask]
  );

  const handleUnassignTaskFromUser = useCallback(
    async (taskId: string, userId: string) => {
      try {
        const res = await (handleUnassignTask(taskId, userId) as any);
        if (selectedTask && selectedTask._id === taskId) {
          const rawTask = res?.data || res;
          setSelectedTask(normalizeTask(rawTask));
        }
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    },
    [handleUnassignTask, selectedTask]
  );

  const handleAssignTaskToUser = useCallback(
    async (taskId: string, userId: string) => {
      try {
        const res = await (handleAssignTask(taskId, userId) as any);
        if (selectedTask && selectedTask._id === taskId) {
          const rawTask = res?.data || res;
          setSelectedTask(normalizeTask(rawTask));
        }
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    },
    [handleAssignTask, selectedTask]
  );

  const handleCreateProject = useCallback(() => {
    console.log("Create project");
  }, []);

  const handleTaskModal = useCallback(() => {
    setSelectedStatus(undefined);
    setIsCreateModalOpen(true);
  }, []);

  const handleCreateTaskSubmit = useCallback(
    async (taskData: TaskFormData) => {
      const payload = {
        title: taskData.title,
        description: taskData.description,
        due_date: taskData.due_date
          ? new Date(taskData.due_date).toISOString()
          : undefined,
        priority: taskData.priority,
        phase_object_id: taskData.phase_object_id,
        assigned_user_list: taskData.assigned_user_list,
        tag_object_ids: taskData.tag_object_id_list,
        attachments: taskData.attachments,
        project_object_id: taskData.project_object_id || filters.project_object_id,
      };

      await handleCreateTask(payload);
      setIsCreateModalOpen(false);
    },
    [handleCreateTask, filters.project_object_id]
  );

  const handleCreateSubtaskSubmit = useCallback(
    async (taskData: TaskFormData) => {
      if (!parentTaskId) return;

      const payload = {
        title: taskData.title,
        description: taskData.description,
        due_date: taskData.due_date
          ? new Date(taskData.due_date).toISOString()
          : undefined,
        priority: taskData.priority,
        assigned_user_list: taskData.assigned_user_list,
        phase_object_id: taskData.phase_object_id,
        parent_task_object_id: parentTaskId,
        attachments: taskData.attachments,
        project_object_id: taskData.project_object_id || filters.project_object_id,
      };

      await handleCreateTask(payload);
      setIsCreateSubtaskModalOpen(false);
      setParentTaskId(null);
    },
    [handleCreateTask, parentTaskId, filters.project_object_id]
  );

  const searchUsers = async (query: string) => {
    const res = await fetch(
      `/api/users/search?query=${encodeURIComponent(query)}`,
      { credentials: "include" }
    );
    const data = await res.json();
    return data.data || [];
  };

  return {
    tasks,
    sections,
    phases,
    loading,
    error,
    refetchTasks,
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    expandedTasks,
    isCreateModalOpen,
    setIsCreateModalOpen,
    selectedStatus,
    setSelectedStatus,
    isCreateSubtaskModalOpen,
    setIsCreateSubtaskModalOpen,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    selectedTask,
    setSelectedTask,
    isIntegrationsOpen,
    setIsIntegrationsOpen,
    reportRef,
    handlePrint,
    handleAddSubtask,
    handleToggleTask,
    handleAddTask,
    handleFilter,
    handleStatusChange,
    handleDeleteTaskById,
    handleUnassignTaskFromUser,
    handleAssignTaskToUser,
    handleCreateProject,
    handleTaskModal,
    handleCreateTaskSubmit,
    handleCreateSubtaskSubmit,
    searchUsers,
    handleEditTask,
    itemsPerPage,
    setSectionPage,
  };
}
