"use client";
import React from "react";
import { ChevronDown, ChevronRight, MessageSquare, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar, AvatarGroup, PriorityBadge, TaskCheckbox } from ".";
import { TaskCardProps } from "@/types/interface/props/TaskCard.props";

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  depth = 0,
  onToggle,
  onCheckChange,
  isExpanded = false,
}) => {
  const hasChildren = task.subtasks && task.subtasks.length > 0;
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
            <TaskCheckbox
              checked={task.completed}
              onChange={(checked) => onCheckChange?.(task._id, checked)}
            />

            {/* Task Title */}
            <span
              className={cn(
                "text-sm font-medium",
                task.completed ? "text-gray-400 line-through" : "text-gray-900"
              )}
            >
              {task.title}
            </span>

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
                {task.subtaskCount}
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
          <span className="text-sm text-gray-500 line-clamp-2">
            {task.description || "-"}
          </span>
        </td>

        {/* Assignee Cell */}
        <td className="py-3 px-4">
          <AvatarGroup assignees={task.assignees || []} />
        </td>

        {/* Due Date Cell */}
        <td className="py-3 px-4">
          <span className="text-sm text-gray-700">{task.due_date?.toLocaleDateString()}</span>
        </td>

        {/* Priority Cell */}
        <td className="py-3 px-4">
          <PriorityBadge priority={task.priority} />
        </td>

        {/* Progress Cell */}
        <td className="py-3 px-4">
          <ProgressBar progress={task.progress} className="w-24" />
        </td>

        {/* Actions Cell */}
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                className="w-4 h-4 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                />
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </td>
      </tr>

      {/* Render Children */}
      {hasChildren &&
        isExpanded &&
        task.subtasks?.map((child) => (
          <TaskCard
            key={child._id}
            task={child}
            depth={depth + 1}
            onToggle={onToggle}
            onCheckChange={onCheckChange}
          />
        ))}
    </>
  );
};

export default TaskCard;
