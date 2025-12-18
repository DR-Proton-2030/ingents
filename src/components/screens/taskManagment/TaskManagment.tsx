"use client";
import React, { useState, useCallback } from "react";
import Layout from "@/screens/layout/Layout";
import TaskHeader from "./TaskHeader";
import TaskSection from "./TaskSection";
import { ViewMode, Task as TaskType } from "@/types/interface/task.interface";
import { useTasks } from "@/hooks/useTasks";

const TaskManagement: React.FC = () => {
  const { sections, loading, error, handleUpdateTask, refetchTasks } = useTasks();
  const [activeView, setActiveView] = useState<ViewMode>("spreadsheet");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

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
    // TODO: Implement add task modal/form
  }, []);

  const handleFilter = useCallback(() => {
    console.log("Open filter modal");
    // TODO: Implement filter functionality
  }, []);

  const handleCreateProject = useCallback(() => {
    console.log("Create project");
    // TODO: Implement create project
  }, []);

  const handleCreateTask = useCallback(() => {
    console.log("Create task");
    // TODO: Implement create task
  }, []);

  // Filter tasks based on search query
  const filteredSections = sections.map((section) => ({
    ...section,
    tasks: filterTasks(section.tasks, searchQuery),
  }));

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
          onCreateTask={handleCreateTask}
        />

        {/* Task Sections */}
        <div className="space-y-4">
          {filteredSections.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No tasks found</p>
            </div>
          ) : (
            filteredSections.map((section) => (
              <TaskSection
                key={section.id}
                section={section}
                onToggleTask={handleToggleTask}
                onCheckTask={handleCheckTask}
                onAddTask={handleAddTask}
                expandedTasks={expandedTasks}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

// Helper function to filter tasks based on search query
function filterTasks(
  tasks: TaskType[],
  query: string
): TaskType[] {
  if (!query.trim()) return tasks;

  const lowerQuery = query.toLowerCase();

  return tasks.filter((task) => {
    const matchesTitle = task.title.toLowerCase().includes(lowerQuery);
    const matchesDescription = task.description
      ?.toLowerCase()
      .includes(lowerQuery);
    const hasMatchingChildren =
      task.subtasks && filterTasks(task.subtasks, query).length > 0;

    return matchesTitle || matchesDescription || hasMatchingChildren;
  });
}

export default TaskManagement;
