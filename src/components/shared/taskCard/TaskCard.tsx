"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ProgressBar, AvatarGroup, PriorityBadge, TaskCheckbox } from ".";
import { TaskCardProps } from "@/types/interface/props/TaskCard.props";
import { formatDate } from "@/utils/commonFunction/formatDate";
import StatusDropdown from "../statusDropdown/StatusDropdown";
import EditableText from "./EditableText";
import { TaskPriority, TaskStatus } from "@/types/interface/task.interface";
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const descTriggerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLTableCellElement>(null);
  const [descPosition, setDescPosition] = useState({ top: 0, left: 0 });
  const hasChildren = task.subtask && task.subtask.length > 0;
  const paddingLeft = depth * 24;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Custom Picker States
  const [viewDate, setViewDate] = useState(new Date());
  const [selDate, setSelDate] = useState(new Date());
  const [selHour, setSelHour] = useState("09");
  const [selMinute, setSelMinute] = useState("00");
  const [selAmPm, setSelAmPm] = useState("AM");

  // Initialize picker states from task.due_date
  useEffect(() => {
    if (task.due_date) {
      const d = new Date(task.due_date);
      setSelDate(d);
      setViewDate(d);
      let h = d.getHours();
      const m = d.getMinutes();
      setSelAmPm(h >= 12 ? "PM" : "AM");
      h = h % 12 || 12;
      setSelHour(String(h).padStart(2, "0"));
      setSelMinute(String(m).padStart(2, "0"));
    }
  }, [task.due_date, isCalendarOpen]);

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

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return { firstDay, days };
  };

  const calendarData = getDaysInMonth(viewDate);

  const saveDateTime = () => {
    const year = selDate.getFullYear();
    const month = String(selDate.getMonth() + 1).padStart(2, "0");
    const day = String(selDate.getDate()).padStart(2, "0");

    let h = parseInt(selHour);
    if (selAmPm === "PM" && h < 12) h += 12;
    if (selAmPm === "AM" && h === 12) h = 0;

    const formattedDate = `${year}-${month}-${day}T${String(h).padStart(2, "0")}:${selMinute}`;
    handleEditTask(task._id, { due_date: new Date(formattedDate) });
    setIsCalendarOpen(false);
  };

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
        <td className="py-4 px-4 relative">
          <div
            ref={descTriggerRef}
            className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-orange-600 transition-all group/desc w-fit"
            onClick={() => setShowDescription(!showDescription)}
          >
            <Notes className={cn("w-4 h-4 shrink-0 transition-transform duration-300", showDescription ? "scale-110 text-orange-500" : "group-hover/desc:scale-110")} />
            <span className={cn("font-medium transition-colors", showDescription && "text-orange-600")}>View</span>
          </div>

          {mounted && createPortal(
            <AnimatePresence>
              {showDescription && (
                <div className="fixed inset-0 z-[99999]" onClick={() => setShowDescription(false)}>
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      top: descPosition.top,
                      left: Math.min(descPosition.left, typeof window !== 'undefined' ? window.innerWidth - 340 : descPosition.left)
                    }}
                    className="fixed w-80 p-5 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col gap-3"
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
                </div>
              )}
            </AnimatePresence>,
            document.body
          )}
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

          {mounted && createPortal(
            <AnimatePresence>
              {isCalendarOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsCalendarOpen(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  />

                  {/* Modal Content */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-[360px] bg-white shadow-2xl rounded-[32px] border border-white/20 flex flex-col gap-4 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-bold text-gray-800">Update Schedule</h4>
                        <button onClick={() => setIsCalendarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <CloseCircle className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Month Header */}
                        <div className="flex items-center justify-between px-1">
                          <h5 className="text-xs font-black text-gray-800 uppercase tracking-widest">
                            {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                          </h5>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <AltArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <AltArrowRight className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} className="text-[10px] font-bold text-gray-300 text-center py-1">{d}</div>
                          ))}
                          {[...Array(calendarData.firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
                          {[...Array(calendarData.days)].map((_, i) => {
                            const day = i + 1;
                            const isSelected = selDate.getDate() === day && selDate.getMonth() === viewDate.getMonth() && selDate.getFullYear() === viewDate.getFullYear();
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => setSelDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day))}
                                className={`h-9 w-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${isSelected ? "bg-orange-500 text-white shadow-lg shadow-orange-200 scale-110" : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                                  }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>

                        {/* Time Picker Section */}
                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between gap-2 p-1 bg-gray-50 rounded-2xl">
                            <div className="flex-1 flex flex-col gap-1 items-center py-2">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Hour</span>
                              <div className="flex gap-1 flex-wrap justify-center px-1">
                                {["09", "10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08"].map(h => (
                                  <button
                                    key={h}
                                    type="button"
                                    onClick={() => setSelHour(h)}
                                    className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${selHour === h ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-200"
                                      }`}
                                  >
                                    {h}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="w-px h-16 bg-gray-200 shrink-0" />
                            <div className="flex flex-col gap-2 shrink-0 pr-1">
                              <button
                                type="button"
                                onClick={() => setSelAmPm("AM")}
                                className={`px-3 py-2 rounded-lg text-[10px] font-black transition-all ${selAmPm === "AM" ? "bg-orange-500 text-white shadow-sm" : "bg-white text-gray-400 border border-gray-100"}`}
                              >AM</button>
                              <button
                                type="button"
                                onClick={() => setSelAmPm("PM")}
                                className={`px-3 py-2 rounded-lg text-[10px] font-black transition-all ${selAmPm === "PM" ? "bg-orange-500 text-white shadow-sm" : "bg-white text-gray-400 border border-gray-100"}`}
                              >PM</button>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            {["00", "15", "30", "45"].map(m => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setSelMinute(m)}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${selMinute === m ? "bg-orange-50 border-orange-200 text-orange-600 shadow-sm" : "bg-white border-gray-100 text-gray-400 hover:border-orange-200"
                                  }`}
                              >
                                :{m}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={saveDateTime}
                          className="w-full h-12 bg-black text-white rounded-2xl text-xs font-bold hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-gray-200 mt-2"
                        >
                          Update Schedule
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body
          )}
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
