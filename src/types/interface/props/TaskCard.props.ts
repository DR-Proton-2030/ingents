import { Task, TaskPriority } from "../task.interface";

export interface PriorityBadgeProps {
  priority: TaskPriority;
}

export interface TaskCardProps {
  task: Task;
  depth?: number;
  onToggle?: (taskId: string) => void;
  onCheckChange?: (taskId: string, checked: boolean) => void;
  isExpanded?: boolean;
}
