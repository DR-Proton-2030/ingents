"use client";
import React from "react";
import Layout from "@/screens/layout/Layout";
import TaskHeader from "./TaskHeader";
import { Loading } from "@/components/shared/loadingScreen/Loading";
import { BoardView, CalendarView, TimelineView, SpreadsheetView } from "./views";
import VirtualAssistant from "../virtualAssistant/VirtualAssistant";
import { useTaskManagementState } from "./hooks/useTaskManagementState";
import TaskManagementModals from "./components/TaskManagementModals";

const TaskManagement: React.FC = () => {
  const state = useTaskManagementState();

  if (state.loading) {
    return (
      <Layout showSidebar={true}>
        <Loading />
      </Layout>
    );
  }

  if (state.error) {
    return (
      <Layout showSidebar={true}>
        <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{state.error}</p>
            <button
              onClick={() => state.refetchTasks()}
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
      <div className="mx-auto max-w-7xl px-4 py-2 space-y-6 hidescroll overflow-y-auto h-[80vh]">
        {/* Header with tabs and search */}
        <TaskHeader
          activeView={state.activeView}
          onViewChange={state.setActiveView}
          searchQuery={state.searchQuery}
          onSearchChange={state.setSearchQuery}
          onFilter={state.handleFilter}
          onCreateProject={state.handleCreateProject}
          onCreateTask={state.handleTaskModal}
          filters={state.filters}
          onFilterChange={state.setFilters}
          phases={state.phases}
          selectedProjectId={state.filters.project_object_id || undefined}
          onProjectSelect={(project) => {
            state.setFilters((prev: any) => ({
              ...prev,
              project_object_id: project ? project._id : null,
            }));
          }}
          onDownloadReport={() => state.handlePrint()}
          onIntegrationsOpen={() => state.setIsIntegrationsOpen(true)}
        />

        {/* Task Views */}
        <div className="space-y-4">
          {state.activeView === "spreadsheet" && (
            <SpreadsheetView
              sections={state.sections}
              itemsPerPage={state.itemsPerPage}
              setSectionPage={state.setSectionPage}
              handleToggleTask={state.handleToggleTask}
              handleAddTask={state.handleAddTask}
              expandedTasks={state.expandedTasks}
              handleStatusChange={state.handleStatusChange}
              handleDeleteTaskById={state.handleDeleteTaskById}
              handleAddSubtask={state.handleAddSubtask}
              handleUnassignTaskFromUser={state.handleUnassignTaskFromUser}
              handleAssignTaskToUser={state.handleAssignTaskToUser}
              searchUsers={state.searchUsers}
              handleEditTask={state.handleEditTask}
              setSelectedTask={state.setSelectedTask}
              filters={state.filters}
              setFilters={state.setFilters}
              setSearchQuery={state.setSearchQuery}
              searchQuery={state.searchQuery}
            />
          )}

          {state.activeView === "board" && (
            <BoardView
              sections={state.sections}
              onAddTask={state.handleAddTask}
              onAddSubtask={state.handleAddSubtask}
              onEditTask={state.handleEditTask}
              onDeleteTask={state.handleDeleteTaskById}
              onAssignTask={state.handleAssignTaskToUser}
              onUnassignTask={state.handleUnassignTaskFromUser}
              onStatusChange={state.handleStatusChange}
            />
          )}

          {state.activeView === "calendar" && (
            <CalendarView
              tasks={state.tasks}
              onAddSubtask={state.handleAddSubtask}
              onEditTask={state.handleEditTask}
              onDeleteTask={state.handleDeleteTaskById}
              onAssignTask={state.handleAssignTaskToUser}
              onUnassignTask={state.handleUnassignTaskFromUser}
            />
          )}

          {state.activeView === "timeline" && (
            <TimelineView
              tasks={state.tasks}
              onAddSubtask={state.handleAddSubtask}
              onEditTask={state.handleEditTask}
              onDeleteTask={state.handleDeleteTaskById}
              onAssignTask={state.handleAssignTaskToUser}
              onUnassignTask={state.handleUnassignTaskFromUser}
            />
          )}

          {state.activeView === "assistant" && (
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden h-[70vh]">
              <VirtualAssistant isEmbedded={true} projectContext={state.filters.project_object_id || undefined} />
            </div>
          )}
        </div>

        {/* Modal and Drawer Components */}
        <TaskManagementModals
          isCreateModalOpen={state.isCreateModalOpen}
          selectedStatus={state.selectedStatus}
          setIsCreateModalOpen={state.setIsCreateModalOpen}
          setSelectedStatus={state.setSelectedStatus}
          handleCreateTaskSubmit={state.handleCreateTaskSubmit}
          phases={state.phases}
          filters={state.filters}
          isCreateSubtaskModalOpen={state.isCreateSubtaskModalOpen}
          setIsCreateSubtaskModalOpen={state.setIsCreateSubtaskModalOpen}
          handleCreateSubtaskSubmit={state.handleCreateSubtaskSubmit}
          isFilterDrawerOpen={state.isFilterDrawerOpen}
          setIsFilterDrawerOpen={state.setIsFilterDrawerOpen}
          setFilters={state.setFilters}
          selectedTask={state.selectedTask}
          setSelectedTask={state.setSelectedTask}
          handleEditTask={state.handleEditTask}
          handleDeleteTaskById={state.handleDeleteTaskById}
          handleAddSubtask={state.handleAddSubtask}
          handleAssignTaskToUser={state.handleAssignTaskToUser}
          handleUnassignTaskFromUser={state.handleUnassignTaskFromUser}
          reportRef={state.reportRef}
          tasks={state.tasks}
          isIntegrationsOpen={state.isIntegrationsOpen}
          setIsIntegrationsOpen={state.setIsIntegrationsOpen}
        />
      </div>
    </Layout>
  );
};

export default TaskManagement;
