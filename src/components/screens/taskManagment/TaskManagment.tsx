"use client";
import React, { useState, useCallback } from "react";
import Layout from "@/screens/layout/Layout";
import TaskHeader from "./TaskHeader";
import TaskSection from "./TaskSection";
import CreateTaskModal from "./CreateTaskModal";
import { ViewMode, Task as TaskType } from "@/types/interface/task.interface";
import { useTasks } from "@/hooks/useTasks";
import { TaskFormData } from "@/types/interface/task-modal.interface";

const TaskManagement: React.FC = () => {
  const {
    sections,
    loading,
    error,
    handleUpdateTask,
    refetchTasks,
    handleCreateTask,
  } = useTasks();
  const [activeView, setActiveView] = useState<ViewMode>("spreadsheet");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
    console.log("Add task to section:", sectionId);
  }, []);

  const handleFilter = useCallback(() => {
    console.log("Open filter modal");
  }, []);

  const handleCreateProject = useCallback(() => {
    console.log("Create project");
    // TODO: Implement create project
  }, []);

  const handleTaskModal = useCallback(() => {
    console.log("task open");
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
        status: taskData.status,
      };

      await handleCreateTask(payload);
    },
    [handleCreateTask]
  );

  // Filter tasks based on search query
  // const filteredSections = sections.map((section) => ({
  //   ...section,
  //   tasks: filterTasks(section.tasks, searchQuery),
  // }));

  if (loading) {
    return (
      <Layout showSidebar={true}>
        <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        </div>
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
              onClick={refetchTasks}
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
          onSearchChange={setSearchQuery}
          onFilter={handleFilter}
          onCreateProject={handleCreateProject}
          onCreateTask={handleTaskModal}
        />

        {/* Task Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <TaskSection
              key={section.id}
              section={section}
              onToggleTask={handleToggleTask}
              onCheckTask={handleCheckTask}
              onAddTask={handleAddTask}
              expandedTasks={expandedTasks}
            />
          ))}
        </div>

        {/* Create Task Modal */}
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTaskSubmit}
        />
      </div>
    </Layout>
  );
};

export default TaskManagement;
