import { Task, TaskPriority, TaskStatus } from "../task.interface";

export interface PriorityBadgeProps {
  priority: TaskPriority;
}

export interface TaskCardProps {
  task: Task;
  depth?: number;
  onToggle?: (taskId: string) => void;
  onCheckChange?: (taskId: string, checked: boolean) => void;
  handleOpenUpdateTask?: () => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  handleDeleteTask: (taskId: string) => void;
  handleAddSubtask: (parentTaskId: string) => void;
  handleUnAssignTask: (taskId: string, userId: string) => void;
  isExpanded?: boolean;
}
