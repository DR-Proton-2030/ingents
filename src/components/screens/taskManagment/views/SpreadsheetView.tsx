"use client";
import React, { useState } from "react";
import TaskSection from "../TaskSection";
import TaskEmptyState from "../TaskEmptyState";
import { Magnifer } from "@solar-icons/react";

interface SpreadsheetViewProps {
  sections: any[];
  itemsPerPage: number;
  setSectionPage: (sectionId: string, page: number) => void;
  handleToggleTask: (taskId: string) => void;
  handleAddTask: (sectionId: string) => void;
  expandedTasks: Set<string>;
  handleStatusChange: (taskId: string, newPhaseId: string) => void;
  handleDeleteTaskById: (taskId: string) => void;
  handleAddSubtask: (taskId: string) => void;
  handleUnassignTaskFromUser: (taskId: string, userId: string) => void;
  handleAssignTaskToUser: (taskId: string, userId: string) => void;
  searchUsers: (query: string) => Promise<any[]>;
  handleEditTask: (taskId: string, payload: any) => Promise<void>;
  setSelectedTask: (task: any) => void;
  filters: any;
  setFilters: (filters: any) => void;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
}

const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  sections,
  itemsPerPage,
  setSectionPage,
  handleToggleTask,
  handleAddTask,
  expandedTasks,
  handleStatusChange,
  handleDeleteTaskById,
  handleAddSubtask,
  handleUnassignTaskFromUser,
  handleAssignTaskToUser,
  searchUsers,
  handleEditTask,
  setSelectedTask,
  filters,
  setFilters,
  setSearchQuery,
  searchQuery,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>("all");

  const nonEmptySections = sections.filter(
    (section: any) => (section.tasks?.length ?? 0) > 0
  );

  // Validate that selected section is currently non-empty, otherwise fallback to 'all'
  const activeTabId = (selectedSectionId === "all" || nonEmptySections.some((s: any) => s.id === selectedSectionId))
    ? selectedSectionId
    : "all";

  const allTasks = nonEmptySections.flatMap((s: any) => s.tasks || []);

  const visibleSections = activeTabId === "all"
    ? nonEmptySections.length > 0 ? [
      {
        id: "all",
        title: "All Tasks",
        color: "#4f46e5", // Indigo
        count: allTasks.length,
        tasks: allTasks,
        currentPage: 1,
        totalPages: 1,
      }
    ] : []
    : nonEmptySections.filter((sec: any) => sec.id === activeTabId);

  return (
    <div className="space-y-6">
      {nonEmptySections.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative group w-full sm:w-72">
            <Magnifer className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 bg-white rounded-full text-sm w-full focus:outline-none border border-gray-200/70
             transition-all placeholder:text-gray-400 font-semibold"
            />
          </div>
          {/* Status Pills */}
          <div className="flex items-center bg-white p-1.5 rounded-full">
            <button
              onClick={() => setSelectedSectionId("all")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${activeTabId === "all"
                ? "bg-gray-100 text-gray-900 "
                : "text-gray-500 hover:text-gray-800"
                }`}
            >
              All
            </button>
            {nonEmptySections.map((sec: any) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${activeTabId === sec.id
                  ? "bg-gray-100 text-gray-900 "
                  : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                {sec.title}
              </button>
            ))}
          </div>


        </div>
      )}

      {visibleSections.length > 0 ? (
        visibleSections.map((section: any) => (
          <TaskSection
            key={section.id}
            section={section}
            onToggleTask={handleToggleTask}
            onAddTask={(sectionId) => handleAddTask(sectionId === "all" ? "todo" : sectionId)}
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
      )}
    </div>
  );
};

export default SpreadsheetView;
