"use client";
import React from "react";
import {
  ChevronDown,
  ChevronRight,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar, AvatarGroup, PriorityBadge, TaskCheckbox } from ".";
import { TaskCardProps } from "@/types/interface/props/TaskCard.props";
import { formatDate } from "@/utils/commonFunction/formatDate";
import StatusDropdown from "../statusDropdown/StatusDropdown";
import EditableText from "./EditableText";
import EditableSelect from "./EditableSelect";
import { TaskPriority } from "@/types/interface/task.interface";

export const PRIORITY_OPTIONS: {
  label: string;
  value: TaskPriority;
  icon: string;
}[] = [
  { value: "high", label: "High", icon: "🔴" },
  { value: "normal", label: "Normal", icon: "🟢" },
  { value: "low", label: "Low", icon: "🟡" },
  { value: "urgent", label: "Urgent", icon: "🚩" },
];
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  depth = 0,
  onToggle,
  onCheckChange,
  handleOpenUpdateTask,
  handleDeleteTask,
  handleAddSubtask,
  onStatusChange,
  handleEditTask,
  handleUnAssignTask,
  handleAssignTask,
  searchUsers,
  isExpanded = false,
}) => {
  const hasChildren = task.subtask && task.subtask.length > 0;
  const paddingLeft = depth * 24;

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
        {/* Task Name Cell */}
        <td className="py-3 px-4">
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            {/* Expand/Collapse Button */}
            {hasChildren ? (
              <button
                onClick={() => onToggle?.(task._id)}
                className="p-0.5 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
            ) : (
              <div className="w-5" />
            )}

            {/* Drag Handle */}
            <div className="opacity-0 group-hover:opacity-100 cursor-grab">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="9" cy="6" r="1.5" />
                <circle cx="15" cy="6" r="1.5" />
                <circle cx="9" cy="12" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="9" cy="18" r="1.5" />
                <circle cx="15" cy="18" r="1.5" />
              </svg>
            </div>

            {/* Checkbox */}
            {/* <TaskCheckbox
              checked={task.completed}
              onChange={(checked) => onCheckChange?.(task._id, checked)}
            /> */}

            {/* Task Title */}

            <EditableText
              value={task.title}
              placeholder="-"
              onSave={(value) => handleEditTask(task._id, { title: value })}
            />

            {/* Subtask Count */}
            {task.subtaskCount && task.subtaskCount > 0 && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01"
                  />
                </svg>
                {task.subtaskCount || 2}
              </span>
            )}

            {/* Comment Count */}
            {task.commentCount && task.commentCount > 0 && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {task.commentCount}
              </span>
            )}
          </div>
        </td>

        {/* Description Cell */}
        <td className="py-3 px-4">
          <EditableText
            value={task.description || ""}
            onSave={(value) => handleEditTask(task._id, { description: value })}
            placeholder="-"
          />
        </td>

        {/* Assignee Cell */}
        <td className="py-3 px-4">
          <AvatarGroup
            assignees={task.assignees || []}
            taskId={task._id}
            handleUnAssignTask={handleUnAssignTask}
            handleAssignTask={handleAssignTask}
            searchUsers={searchUsers}
          />
        </td>
        {/* <td className="py-3 px-4">
          <span className="text-sm text-gray-700">{task.status}</span>
        </td> */}
        <td className="py-3 px-4">
          <StatusDropdown
            taskId={task._id}
            currentStatus={task.status}
            onStatusChange={onStatusChange}
          />
        </td>

        {/* Due Date Cell */}
        <td className="py-3 px-4">
          <span className="text-sm text-gray-700">
            {formatDate(task?.due_date)}
          </span>
        </td>

        {/* Priority Cell */}
        <td className="py-3 px-4">
          <PriorityBadge priority={task.priority} />
        </td>
        {/* <td>
<EditableSelect<TaskPriority>
  value={task.priority}
  options={PRIORITY_OPTIONS}
  onSave={(priority) =>
    handleEditTask(task._id, { priority })
  }
/>
        </td> */}

        {/* Progress Cell */}
        {/* <td className="py-3 px-4">
          <ProgressBar progress={task.progress} className="w-24" />
        </td> */}

        {/* Actions Cell */}
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            {/* ➕ Add Subtask */}
            <div className="relative group/tooltip">
              <button
                className="p-2 rounded-lg bg-blue-100 transition-colors cursor-pointer"
                onClick={() => handleAddSubtask(task._id)}
              >
                <Plus size={14} className="text-blue-600" />
              </button>

              {/* Tooltip */}
              <span
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white
        opacity-0 group-hover/tooltip:opacity-100 transition-opacity
        pointer-events-none"
              >
                Add Subtask
              </span>
            </div>

            {/* 🗑️ Delete Task */}
            <div className="relative group/tooltip">
              <button
                className="p-2 rounded-lg bg-red-100 transition-colors cursor-pointer"
                onClick={() => {
                  const confirmed = window.confirm(
                    "Are you sure you want to delete this task?"
                  );
                  if (!confirmed) return;

                  handleDeleteTask(task._id);
                }}
              >
                <Trash2 size={14} className="text-red-600" />
              </button>

              {/* Tooltip */}
              <span
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white
        opacity-0 group-hover/tooltip:opacity-100 transition-opacity
        pointer-events-none"
              >
                Delete Task
              </span>
            </div>

            {/* More */}
            <button className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </td>
      </tr>

      {/* Render Children */}
      {hasChildren &&
        isExpanded &&
        task.subtask?.map((child) => (
          <TaskCard
            key={child._id}
            task={child}
            depth={depth + 1}
            onToggle={onToggle}
            handleOpenUpdateTask={handleOpenUpdateTask}
            onCheckChange={onCheckChange}
            onStatusChange={onStatusChange}
            handleDeleteTask={handleDeleteTask}
            handleAddSubtask={handleAddSubtask}
            handleUnAssignTask={handleUnAssignTask}
            handleAssignTask={handleAssignTask}
            searchUsers={searchUsers}
            handleEditTask={handleEditTask}
          />
        ))}
    </>
  );
};

export default TaskCard;
