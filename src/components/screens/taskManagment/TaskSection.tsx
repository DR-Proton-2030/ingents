"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TaskSection as TaskSectionType } from "@/types/interface/task.interface";
import TaskCard from "@/components/shared/taskCard/TaskCard";
import { ChevronDown, ChevronRight, MoreHorizontal, Plus } from "lucide-react";

interface TaskSectionProps {
  section: TaskSectionType;
  onToggleTask?: (taskId: string) => void;
  onCheckTask?: (taskId: string, checked: boolean) => void;
  onAddTask?: (sectionId: string) => void;
  expandedTasks?: Set<string>;
}

const statusColors: Record<string, { bg: string; dot: string; text: string }> = {
  "in-progress": {
    bg: "bg-orange-50",
    dot: "bg-orange-400",
    text: "text-orange-600",
  },
  "ready-to-check": {
    bg: "bg-blue-50",
    dot: "bg-blue-400",
    text: "text-blue-600",
  },
  completed: {
    bg: "bg-green-50",
    dot: "bg-green-400",
    text: "text-green-600",
  },
  backlog: {
    bg: "bg-gray-50",
    dot: "bg-gray-400",
    text: "text-gray-600",
  },
};

const TaskSection: React.FC<TaskSectionProps> = ({
  section,
  onToggleTask,
  onCheckTask,
  onAddTask,
  expandedTasks = new Set(),
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const colors = statusColors[section.status] || statusColors.backlog;

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
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full",
            colors.bg
          )}
        >
          <span className={cn("w-2 h-2 rounded-full", colors.dot)} />
          <span className={cn("text-sm font-medium", colors.text)}>
            {section.title}
          </span>
        </div>

        {/* Task Count */}
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
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
                  Due Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  <Plus className="w-4 h-4" />
                </th>
              </tr>
            </thead>
            <tbody>
              {section.tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggle={onToggleTask}
                  onCheckChange={onCheckTask}
                  isExpanded={expandedTasks.has(task._id)}
                />
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
