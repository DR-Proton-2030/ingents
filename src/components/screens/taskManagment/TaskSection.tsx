"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TaskSection as TaskSectionType, TaskStatus } from "@/types/interface/task.interface";
import TaskCard from "@/components/shared/taskCard/TaskCard";
import { ChevronDown, ChevronRight, MoreHorizontal, Plus } from "lucide-react";

interface TaskSectionProps {
  section: TaskSectionType;
  onToggleTask?: (taskId: string) => void;
  onCheckTask?: (taskId: string, checked: boolean) => void;
  onAddTask?: (sectionId: string) => void;
  expandedTasks?: Set<string>;
  handleStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  handleDeleteTask: (taskId: string) => void;
  handleUnAssignTask: (taskId: string, userId: string) => void;
  handleAssignTask: (taskId: string, userId: string) => void;
  handleAddSubtask: (parentTaskId: string) => void;
  searchUsers: (query: string) => Promise<any[]>;
}

const statusColors: Record<string, { bg: string; dot: string; text: string }> = {
  "pending": { bg: "bg-purple-600", dot: "bg-white", text: "text-white" },
  "ready-to-check": { bg: "bg-blue-500", dot: "bg-white", text: "text-white" },
  "completed": { bg: "bg-green-500", dot: "bg-white", text: "text-white" },
  "backlog": { bg: "bg-gray-500", dot: "bg-white", text: "text-white" },
};

const TaskSection: React.FC<TaskSectionProps> = ({
  section,
  onToggleTask,
  onCheckTask,
  onAddTask,
  handleStatusChange,
  handleDeleteTask,
  handleAddSubtask,
  handleUnAssignTask,
  handleAssignTask,
  searchUsers,
  expandedTasks = new Set(),
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const colors = statusColors[section.status] || statusColors.backlog;

  // Group tasks by parent_object_id
  const parentTasks = section.tasks.filter((task) => !task.parent_task_object_id);
  const subTasksMap: Record<string, typeof section.tasks> = {};

  section.tasks.forEach((task) => {
    if (task.parent_task_object_id) {
      if (!subTasksMap[task.parent_task_object_id]) subTasksMap[task.parent_task_object_id] = [];
      subTasksMap[task.parent_task_object_id].push(task);
    }
  });

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-0.5 hover:bg-gray-200 rounded"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {/* Section Badge */}
        <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full", colors.bg)}>
          <span className={cn("w-2 h-2 rounded-full", colors.dot)} />
          <span className={cn("text-sm font-medium", colors.text)}>{section.title}</span>
        </div>

        {/* Task Count */}
      <span
  className={cn(
    "text-sm px-2 py-0.5 rounded-lg font-bold",
    section.status === "pending" &&
      "bg-purple-200 text-purple-800",
    section.status === "completed" &&
      "bg-green-200 text-green-700",
    section.status === "backlog" &&
      "bg-gray-200 text-gray-600",
    section.status === "ready-to-check" &&
      "bg-blue-200 text-blue-800"
  )}
>
  {section.count}
</span>


        {/* Section Actions */}
        <button className="p-1 hover:bg-gray-200 rounded">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Task Table */}
      {!isCollapsed && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {parentTasks.map((task) => (
                <React.Fragment key={task._id}>
                  <TaskCard
                    task={task}
                    onToggle={onToggleTask}
                    onCheckChange={onCheckTask}
                    onStatusChange={handleStatusChange}
                    isExpanded={expandedTasks.has(task._id)}
                    handleDeleteTask={handleDeleteTask}
                    handleAddSubtask={() => handleAddSubtask(task._id)}
                    handleUnAssignTask={handleUnAssignTask} handleAssignTask={handleAssignTask} searchUsers={searchUsers}                />
                  {/* Render subtasks if any */}
                  {subTasksMap[task._id]?.map((subtask) => (
                    <TaskCard
                      key={subtask._id}
                      task={subtask}
                      onToggle={onToggleTask}
                      onCheckChange={onCheckTask}
                      onStatusChange={handleStatusChange}
                      isExpanded={expandedTasks.has(subtask._id)}
                      handleDeleteTask={handleDeleteTask}
                      handleAddSubtask={() => handleAddSubtask(subtask._id)}
                      handleUnAssignTask={handleUnAssignTask} handleAssignTask={handleUnAssignTask}    searchUsers={searchUsers}                />
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Add Task Row */}
          <button
            onClick={() => onAddTask?.(section.id)}
            className="w-full py-3 px-4 text-left text-sm text-gray-500 hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100"
          >
            <Plus className="w-4 h-4" />
            Add task
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskSection;
