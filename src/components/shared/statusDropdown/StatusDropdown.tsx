"use client";
import React from "react";
import { TaskStatus } from "@/types/interface/task.interface";

interface StatusDropdownProps {
  taskId: string;
  currentStatus: TaskStatus;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  taskId,
  currentStatus,
  onStatusChange,
}) => {
  return (
   <select
  value={currentStatus}
  onChange={(e) =>
    onStatusChange(taskId, e.target.value as TaskStatus)
  }
 className="
  px-4 py-1.5 text-sm rounded-full bg-gray-50 text-gray-800
  shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.9)]
  focus:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.12),inset_-1px_-1px_3px_rgba(255,255,255,1)]
  focus:outline-none
  transition-all duration-200
  cursor-pointer active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15)]
"

>
  <option value="in-progress">In Progress</option>
  <option value="ready-to-check">Ready to check</option>
  <option value="backlog">Backlog</option>
  <option value="completed">Completed</option>
</select>

  );
};

export default StatusDropdown;
