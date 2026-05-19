"use client";
import React from "react";
import CreateTaskModal from "../CreateTaskModal";
import CreateSubtaskModal from "../createSubtaskModal";
import FilterDrawer from "@/components/shared/FilterDrawer/FilterDrawer";
import { TaskDetailDrawer } from "@/components/shared/TaskDetailDrawer";
import { TaskReport } from "../TaskReport";
import { IntegrationsDrawer } from "../components/IntegrationsDrawer";
import { normalizeTask } from "@/hooks/useTasks";

interface TaskManagementModalsProps {
  isCreateModalOpen: boolean;
  selectedStatus: any;
  setIsCreateModalOpen: (val: boolean) => void;
  setSelectedStatus: (val: any) => void;
  handleCreateTaskSubmit: (data: any) => Promise<void>;
  phases: any[];
  filters: any;
  isCreateSubtaskModalOpen: boolean;
  setIsCreateSubtaskModalOpen: (val: boolean) => void;
  handleCreateSubtaskSubmit: (data: any) => Promise<void>;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (val: boolean) => void;
  setFilters: (filters: any) => void;
  selectedTask: any;
  setSelectedTask: (task: any) => void;
  handleEditTask: (id: string, payload: any) => Promise<any>;
  handleDeleteTaskById: (id: string) => Promise<void>;
  handleAddSubtask: (id: string) => void;
  handleAssignTaskToUser: (taskId: string, userId: string) => Promise<void>;
  handleUnassignTaskFromUser: (taskId: string, userId: string) => Promise<void>;
  reportRef: React.RefObject<HTMLDivElement | null>;
  tasks: any[];
  isIntegrationsOpen: boolean;
  setIsIntegrationsOpen: (val: boolean) => void;
}

const TaskManagementModals: React.FC<TaskManagementModalsProps> = ({
  isCreateModalOpen,
  selectedStatus,
  setIsCreateModalOpen,
  setSelectedStatus,
  handleCreateTaskSubmit,
  phases,
  filters,
  isCreateSubtaskModalOpen,
  setIsCreateSubtaskModalOpen,
  handleCreateSubtaskSubmit,
  isFilterDrawerOpen,
  setIsFilterDrawerOpen,
  setFilters,
  selectedTask,
  setSelectedTask,
  handleEditTask,
  handleDeleteTaskById,
  handleAddSubtask,
  handleAssignTaskToUser,
  handleUnassignTaskFromUser,
  reportRef,
  tasks,
  isIntegrationsOpen,
  setIsIntegrationsOpen,
}) => {
  return (
    <>
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

      {/* Create Subtask Modal */}
      <CreateSubtaskModal
        isOpen={isCreateSubtaskModalOpen}
        onClose={() => {
          setIsCreateSubtaskModalOpen(false);
        }}
        onSubmit={handleCreateSubtaskSubmit}
        phases={phases}
        initialProjectId={filters.project_object_id}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        phases={phases}
      />

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onEditTask={async (id, payload) => {
          const res = await handleEditTask(id, payload);
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

      {/* Hidden Report for Printing */}
      <div style={{ display: "none" }}>
        <TaskReport
          ref={reportRef}
          tasks={tasks}
          title={filters.project_object_id ? "Project Task Report" : "General Task Report"}
        />
      </div>

      {/* Integrations Drawer */}
      <IntegrationsDrawer
        isOpen={isIntegrationsOpen}
        onClose={() => setIsIntegrationsOpen(false)}
        projectContext={filters.project_object_id || undefined}
      />
    </>
  );
};

export default TaskManagementModals;
