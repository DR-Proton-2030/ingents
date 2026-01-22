"use client";
import React, { useState, useCallback } from "react";
import Layout from "@/screens/layout/Layout";
import TaskHeader from "./TaskHeader";
import TaskSection from "./TaskSection";
import CreateTaskModal from "./CreateTaskModal";
import {
  ViewMode,
  Task as TaskType,
  TaskStatus,
} from "@/types/interface/task.interface";
import { useTasks, normalizeTask } from "@/hooks/useTasks";
import { TaskFormData } from "@/types/interface/task-modal.interface";
import CreateSubtaskModal from "./createSubtaskModal";
import { UserOption } from "@/components/shared/userMultiSelectDropdown/UserMultiSelectDropdown";
import TaskEmptyState from "./TaskEmptyState";
import { ITaskFilters } from "@/types/interface/taskFilter.interface";
import FilterDrawer from "@/components/shared/FilterDrawer/FilterDrawer";
import { Loading } from "@/components/shared/loadingScreen/Loading";
import { BoardView, CalendarView, TimelineView } from "./views";
import Pagination from "@/components/shared/Pagination/Pagination";
import { TaskDetailDrawer } from "@/components/shared/TaskDetailDrawer";

const TaskManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
    itemsPerPage
  } = useTasks(filters, searchQuery);

  const [activeView, setActiveView] = useState<ViewMode>("spreadsheet");
  const [parentTaskId, setParentTaskId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | undefined>();

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateSubtaskModalOpen, setIsCreateSubtaskModalOpen] =
    useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);


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

  const handleCheckTask = useCallback(
    async (taskId: string, checked: boolean) => {
      try {
        await handleUpdateTask(taskId, {
          status: checked ? "completed" : "in-progress",
          completed_at: checked ? new Date() : null,
        });
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    },
    [handleUpdateTask]
  );

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
      console.log("🔵 Parent delete handler called:", taskId);
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
    // TODO: Implement create project
  }, []);

  const handleTaskModal = useCallback(() => {
    setSelectedStatus(undefined);
    setIsCreateModalOpen(true);
  }, []);

  console.log("tasks", sections);

  const handleCreateTaskSubmit = useCallback(
    async (taskData: TaskFormData) => {
      // Transform form data to match API payload format
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
    [handleCreateTask]
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

        // 🔥 THIS MAKES IT A SUBTASK
        parent_task_object_id: parentTaskId,
        attachments: taskData.attachments,
        project_object_id: taskData.project_object_id || filters.project_object_id,
      };

      await handleCreateTask(payload);

      // cleanup
      setIsCreateSubtaskModalOpen(false);
      setParentTaskId(null);
    },
    [handleCreateTask, parentTaskId]
  );

  const searchUsers = async (query: string): Promise<UserOption[]> => {
    const res = await fetch(
      `/api/users/search?query=${encodeURIComponent(query)}`,
      { credentials: "include" }
    );
    const data = await res.json();
    return data.data || [];
  };

  // Filter tasks based on search query
  // const filteredSections = sections.map((section) => ({
  //   ...section,
  //   tasks: filterTasks(section.tasks, searchQuery),
  // }));

  if (loading) {
    return (
      <Layout showSidebar={true}>
        <Loading />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout showSidebar={true}>
        <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => refetchTasks()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6 hidescroll">
        {/* Header with tabs and search */}
        <TaskHeader
          activeView={activeView}
          onViewChange={setActiveView}
          searchQuery={searchQuery}
          onSearchChange={(query) => {
            setSearchQuery(query);
          }}
          onFilter={handleFilter}
          onCreateProject={handleCreateProject}
          onCreateTask={handleTaskModal}
          filters={filters}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
          }}
          phases={phases}
          selectedProjectId={filters.project_object_id || undefined}
          onProjectSelect={(project) => {
            setFilters((prev) => ({
              ...prev,
              project_object_id: project ? project._id : null,
            }));
          }}
        />

        {/* Task Views */}
        <div className="space-y-4">
          {activeView === "spreadsheet" && (
            sections.length > 0 ? (
              sections.map((section: any) => (
                <TaskSection
                  key={section.id}
                  section={section}
                  onToggleTask={handleToggleTask}
                  onAddTask={handleAddTask}
                  expandedTasks={expandedTasks}
                  handleStatusChange={handleStatusChange}
                  handleDeleteTask={handleDeleteTaskById}
                  handleAddSubtask={handleAddSubtask}
                  handleUnAssignTask={handleUnassignTaskFromUser}
                  handleAssignTask={handleAssignTaskToUser}
                  searchUsers={searchUsers}
                  handleEditTask={handleEditTask}
                  onTaskClick={setSelectedTask}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setSectionPage}
                />
              ))
            ) : (
              <TaskEmptyState
                hasFilters={!!(filters.userId || filters.statusId || filters.dueDate || filters.onlyMyTasks || filters.sort_by || searchQuery)}
                onClearFilters={() => {
                  setFilters({
                    userId: null,
                    statusId: null,
                    dueDate: null,
                    onlyMyTasks: false,
                    sort_by: null,
                    project_object_id: null,
                  });
                  setSearchQuery("");
                }}
              />
            )
          )}

          {activeView === "board" && (
            <BoardView
              sections={sections}
              onAddTask={handleAddTask}
              onAddSubtask={handleAddSubtask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTaskById}
              onAssignTask={handleAssignTaskToUser}
              onUnassignTask={handleUnassignTaskFromUser}
              onStatusChange={handleStatusChange}
            />
          )}

          {activeView === "calendar" && (
            <CalendarView
              tasks={tasks}
              onAddSubtask={handleAddSubtask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTaskById}
              onAssignTask={handleAssignTaskToUser}
              onUnassignTask={handleUnassignTaskFromUser}
            />
          )}

          {activeView === "timeline" && (
            <TimelineView
              tasks={tasks}
              onAddSubtask={handleAddSubtask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTaskById}
              onAssignTask={handleAssignTaskToUser}
              onUnassignTask={handleUnassignTaskFromUser}
            />
          )}
        </div>


        {/* Create Task Modal */}
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          initialStatus={selectedStatus}
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedStatus(undefined);
          }}
          onSubmit={handleCreateTaskSubmit}
          phases={phases}
          initialProjectId={filters.project_object_id}
        />
        <CreateSubtaskModal
          isOpen={isCreateSubtaskModalOpen}
          onClose={() => {
            setIsCreateSubtaskModalOpen(false);
            setParentTaskId(null);
          }}
          onSubmit={handleCreateSubtaskSubmit}
          phases={phases}
          initialProjectId={filters.project_object_id}
        />
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          filters={filters}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
          }}
          phases={phases}
        />
        <TaskDetailDrawer
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onEditTask={async (id, payload) => {
            const res = await (handleEditTask(id, payload) as any);
            if (selectedTask && selectedTask._id === id) {
              const rawTask = res?.data || res;
              setSelectedTask(normalizeTask(rawTask));
            }
          }}
          onDeleteTask={handleDeleteTaskById}
          onAddSubtask={handleAddSubtask}
          onAssignTask={handleAssignTaskToUser}
          onUnassignTask={handleUnassignTaskFromUser}
        />
      </div>
    </Layout>
  );
};

export default TaskManagement;
