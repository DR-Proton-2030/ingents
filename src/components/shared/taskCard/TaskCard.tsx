"use client";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ProgressBar, AvatarGroup, PriorityBadge, TaskCheckbox } from ".";
import { TaskCardProps } from "@/types/interface/props/TaskCard.props";
import { formatDate } from "@/utils/commonFunction/formatDate";
import StatusDropdown from "../statusDropdown/StatusDropdown";
import EditableText from "./EditableText";
import { TaskPriority } from "@/types/interface/task.interface";
import { motion, AnimatePresence } from "framer-motion";
import {
  AltArrowRight,
  AltArrowDown,
  ChatLine,
  MenuDots,
  CloseCircle,
  Notes,
  User,
  Calendar,
  Layers,
  Widget,
  ChecklistMinimalistic
} from "@solar-icons/react";
import { Plus, Trash } from "lucide-react";
import { BiTask } from "react-icons/bi";


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
  const [showDescription, setShowDescription] = useState(false);
  const descRef = useRef<HTMLDivElement>(null);
  const hasChildren = task.subtask && task.subtask.length > 0;
  const paddingLeft = depth * 24;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (descRef.current && !descRef.current.contains(event.target as Node)) {
        setShowDescription(false);
      }
    };
    if (showDescription) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDescription]);

  return (
    <>
      <tr className="border-b border-gray-100/80 hover:bg-gray-50/80 transition-all duration-300 group">
        {/* Task Name Cell */}
        <td className="py-4 px-4">
          <div
            className="flex items-center gap-3"
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            {/* Expand/Collapse Button */}
            {hasChildren ? (
              <button
                onClick={() => onToggle?.(task._id)}
                className="w-6 h-6 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400 hover:text-orange-500"
              >
                {isExpanded ? (
                  <AltArrowDown className="w-4 h-4" />
                ) : (
                  <AltArrowRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <div className="w-6 h-6 flex items-center justify-center">
                {/* <div className="w-1.5 h-1.5 rounded-full bg-gray-200" /> */}
                <ChecklistMinimalistic className="w-4 h-4" />
              </div>
            )}

            {/* Drag Handle (Visual only for now) */}
            <div className="opacity-0 group-hover:opacity-100 cursor-grab text-gray-300 transition-opacity">
              <Widget className="w-4 h-4" />
            </div>

            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <EditableText
                  value={task.title}
                  placeholder="Task title"
                  className="font-bold text-gray-800 text-sm tracking-tight"
                  onSave={(value) => handleEditTask(task._id, { title: value })}
                />

                {/* Indicators */}
                <div className="flex items-center gap-1.5">
                  {(task.subtaskCount || 0) > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] font-black text-gray-400 hover:text-orange-500 transition-colors uppercase tracking-widest bg-gray-100 px-1.5 py-0.5 rounded">
                      <Layers className="w-3 h-3" />
                      {task.subtaskCount}
                    </span>
                  )}
                  {(task.commentCount || 0) > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] font-black text-gray-400 hover:text-blue-500 transition-colors uppercase tracking-widest bg-gray-100 px-1.5 py-0.5 rounded">
                      <ChatLine className="w-3 h-3" />
                      {task.commentCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </td>

        {/* Description Cell */}
        <td className="py-4 px-4 relative "  >
          <div
            className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-orange-600 transition-all group/desc"
            onClick={() => setShowDescription(!showDescription)}
          >
            <Notes className={cn("w-4 h-4 shrink-0 transition-transform duration-300", showDescription ? "scale-110 text-orange-500" : "group-hover/desc:scale-110")} />
            <span className={cn("font-medium transition-colors", showDescription && "text-orange-600")}>View</span>
          </div>

          <AnimatePresence>
            {showDescription && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute z-[100] top-full left-4 mt-2 w-80 p-5 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Notes className="w-3 h-3" />
                    Description
                  </h4>
                  <button
                    onClick={() => setShowDescription(false)}
                    className="p-1 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <CloseCircle size={14} />
                  </button>
                </div>

                <div className="bg-gray-50/50 rounded-xl p-1 border border-gray-100/50">
                  <EditableText
                    value={task.description || ""}
                    onSave={(value) => {
                      handleEditTask(task._id, { description: value });
                    }}
                    placeholder="Add specific details or context..."
                    multiline
                    className="text-xs font-medium text-gray-700 italic leading-relaxed"
                  />
                </div>

                <div className="flex justify-end">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter italic">Click content to edit</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </td>

        {/* Assignee Cell */}
        <td className="py-4 px-4">
          <AvatarGroup
            assignees={task.assignees || []}
            taskId={task._id}
            handleUnAssignTask={handleUnAssignTask}
            handleAssignTask={handleAssignTask}
            searchUsers={searchUsers}
          />
        </td>

        {/* Status Cell */}
        <td className="py-4 px-4">
          <StatusDropdown
            taskId={task._id}
            currentStatus={task.status}
            onStatusChange={onStatusChange}
          />
        </td>

        {/* Due Date Cell */}
        <td className="py-4 px-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {formatDate(task?.due_date)}
          </div>
        </td>

        {/* Priority Cell */}
        <td className="py-4 px-4">
          <PriorityBadge priority={task.priority} />
        </td>

        {/* Actions Cell */}
        <td className="py-4 px-4">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleAddSubtask(task._id)}
              className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-all active:scale-90 tooltip"
              title="Add Subtask"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const confirmed = window.confirm("Are you sure you want to delete this task?");
                if (confirmed) handleDeleteTask(task._id);
              }}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all active:scale-90"
              title="Delete Task"
            >
              <Trash className="w-4 h-4" />
            </button>

            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all active:scale-90">
              <MenuDots className="w-4 h-4" />
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
