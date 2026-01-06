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
      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="in-progress">In Progress</option>
      <option value="ready-to-check">Ready to check</option>
      <option value="backlog">Backlog</option>
      <option value="completed">Completed</option>
    </select>
  );
};

export default StatusDropdown;
