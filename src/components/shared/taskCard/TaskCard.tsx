"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import {
  ProgressBar,
  AvatarGroup,
  PriorityBadge,
  TaskCheckbox,
  TaskDescriptionModal,
  ScheduleModal,
  DeleteConfirmationModal,
  EditableText,
  TaskActionDropdown
} from ".";
import { TaskCardProps } from "@/types/interface/props/TaskCard.props";
import { formatDate } from "@/utils/commonFunction/formatDate";
import StatusDropdown from "../statusDropdown/StatusDropdown";
import { TaskStatus } from "@/types/interface/task.interface";
import {
  AltArrowRight,
  AltArrowDown,
  ChatLine,
  MenuDots,
  Notes,
  Calendar,
  Layers,
  Widget,
  ChecklistMinimalistic,
  TrashBinTrash
} from "@solar-icons/react";
import { Plus, Trash } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";


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
  onTaskClick,
  isExpanded = false,
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const descTriggerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLTableCellElement>(null);
  const [descPosition, setDescPosition] = useState({ top: 0, left: 0 });
  const hasChildren = task.subtask && task.subtask.length > 0;
  const paddingLeft = depth * 24;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (descTriggerRef.current && !descTriggerRef.current.contains(event.target as Node)) {
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

  useEffect(() => {
    if (showDescription && descTriggerRef.current) {
      const rect = descTriggerRef.current.getBoundingClientRect();
      setDescPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });

      const handleResize = () => {
        const newRect = descTriggerRef.current?.getBoundingClientRect();
        if (newRect) {
          setDescPosition({
            top: newRect.bottom + 8,
            left: newRect.left,
          });
        }
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, true);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize, true);
      };
    }
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
                <ChecklistMinimalistic className="w-4 h-4 text-gray-600" />
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
                  onSave={(value: string) => handleEditTask(task._id, { title: value })}
                />

                {/* Indicators */}
                <div className="flex items-center gap-1.5">
                  {(task.subtaskCount || 0) > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] font-black text-gray-400 hover:text-orange-500 transition-colors uppercase  bg-gray-100 px-1.5 py-0.5 rounded">
                      <Layers className="w-3 h-3" />
                      {task.subtaskCount}
                    </span>
                  )}
                  {(task.commentCount || 0) > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] font-black text-gray-400 hover:text-blue-500 transition-colors uppercase  bg-gray-100 px-1.5 py-0.5 rounded">
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
        <td className="py-4 px-4 relative">
          <div
            ref={descTriggerRef}
            className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-orange-600 transition-all group/desc w-fit"
            onClick={() => setShowDescription(!showDescription)}
          >
            <Notes className={cn("w-4 h-4 shrink-0 transition-transform duration-300", showDescription ? "scale-110 text-orange-500" : "group-hover/desc:scale-110")} />
            <span className={cn("font-medium transition-colors", showDescription && "text-orange-600")}>View</span>
          </div>

          <TaskDescriptionModal
            isOpen={showDescription}
            onClose={() => setShowDescription(false)}
            description={task.description || ""}
            taskTitle={task.title}
            onSave={(value: string) => handleEditTask(task._id, { description: value })}
            position={descPosition}
          />
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
            currentStatus={task.phase_info?.name || task.status}
            phaseInfo={task.phase_info}
            onStatusChange={(taskId: string, status: string) => onStatusChange(taskId, status as TaskStatus)}
          />
        </td>

        {/* Due Date Cell */}
        <td className="py-4 px-4 relative w-32" ref={calendarRef}>
          <div
            className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer hover:text-orange-600 transition-all group/date"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <Calendar className={cn("w-3.5 h-3.5 transition-transform duration-300", isCalendarOpen ? "scale-110 text-orange-500" : "group-hover/date:scale-110 text-gray-400")} />
            <span className={cn("transition-colors", isCalendarOpen && "text-orange-600")}>
              {formatDate(task?.due_date)}
            </span>
          </div>

          <ScheduleModal
            isOpen={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
            dueDate={task.due_date}
            onSave={(date) => handleEditTask(task._id, { due_date: date })}
          />
        </td>

        {/* Priority Cell */}
        <td className="py-4 px-4">
          <PriorityBadge priority={task.priority} />
        </td>

        {/* Actions Cell */}
        <td className="py-4 px-4">
          <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            <TaskActionDropdown
              onViewDetails={() => onTaskClick?.(task)}
              onAddSubtask={() => handleAddSubtask(task._id)}
              onDelete={() => setIsDeleteDialogOpen(true)}
            />
          </div>
        </td>
      </tr>

      {/* Render Children */}
      {hasChildren &&
        isExpanded &&
        task.subtask?.map((child: any) => (
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
            onTaskClick={onTaskClick}
          />
        ))}
      <DeleteConfirmationModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => handleDeleteTask(task._id)}
        taskTitle={task.title}
      />
    </>
  );
};

export default TaskCard;
