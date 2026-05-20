"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Task, TaskSection as TaskSectionType, TaskStatus } from "@/types/interface/task.interface";
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
  handleEditTask: (
    taskId: string,
    payload: Partial<Task>
  ) => Promise<void>;
  onTaskClick?: (task: Task) => void;
  itemsPerPage?: number;
  onPageChange?: (sectionId: string, page: number) => void;
}
import Pagination from "@/components/shared/Pagination/Pagination";


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
  handleEditTask,
  searchUsers,
  onTaskClick,
  itemsPerPage = 30,
  onPageChange,
  expandedTasks = new Set(),
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Use hex color from section if it's there, else fallback
  const isHex = section.color && section.color.startsWith('#');
  const sectionColor = isHex ? section.color : "#8d8e91ff";

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
    <div className="mb-8">


      {/* Task Table */}
      {!isCollapsed && (
        <div className="bg-white rounded-xl border border-gray-200/50 overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 pl-10 text-sm font-bold text-gray-500 w-auto">
                  Task
                </th>
                <th className="text-left py-3 pl-0  text-sm font-semibold text-gray-500 w-[140px]">
                  Assignee
                </th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500 w-[140px]">
                  Status
                </th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500 w-[130px]">
                  Due Date
                </th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500 w-[110px]">
                  Tags
                </th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500 w-[110px]">
                  Priority
                </th>
                <th className="text-right py-3 pr-8 text-sm font-semibold text-gray-500 w-[80px]">
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
                    handleUnAssignTask={handleUnAssignTask}
                    handleAssignTask={handleAssignTask}
                    searchUsers={searchUsers}
                    handleEditTask={handleEditTask}
                    onTaskClick={onTaskClick}
                  />
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
                      handleUnAssignTask={handleUnAssignTask}
                      handleAssignTask={handleUnAssignTask}
                      searchUsers={searchUsers}
                      handleEditTask={handleEditTask}
                      onTaskClick={onTaskClick}
                    />
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Add Task Row */}
          {/* <button
            onClick={() => onAddTask?.(section.id)}
            className="w-full py-3 px-1 text-left text-sm text-gray-500 hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100"
          >
            <Plus className="w-4 h-4" />
            Add task
          </button> */}

          {/* Section Pagination */}
          {section.tasks.length > 0 && (
            <div className="border-t border-gray-100 px-1 bg-gray-50/30">
              <Pagination
                currentPage={section.currentPage}
                totalPages={section.totalPages}
                onPageChange={(page) => onPageChange?.(section.id, page)}
                totalItems={section.count}
                itemsPerPage={itemsPerPage}
                className="py-3"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskSection;
